const express = require('express');
const cors = require('cors');
require('dotenv').config();
const router = require('./router');
const formatContent = require('./formatContent');
const postToPlatform = require('./postToPlatform');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use cors middleware for standard CORS handling
app.use(cors());

// Webhook endpoint to receive journal entries
app.post('/webhook/journal', async (req, res) => {
  try {
    const { content, archetype, metadata } = req.body;
    
    if (!content || !archetype) {
      return res.status(400).json({ 
        error: 'Missing required fields: content and archetype' 
      });
    }

    console.log(`Received journal entry for archetype: ${archetype}`);
    
    // Route based on archetype
    const route = router.getRoute(archetype);
    if (!route) {
      return res.status(400).json({ 
        error: `Unknown archetype: ${archetype}` 
      });
    }

    // Format content for the target platform
    const formattedContent = await formatContent.format(content, route.platform, metadata);
    
    // Post to platform
    const result = await postToPlatform.post(formattedContent, route);

    if (result && result.success === false) {
      // Upstream posting failed (webhook/API) - surface as 502
      return res.status(502).json({
        success: false,
        error: 'Failed to post to target platform',
        details: result.error || null,
        platform: route.platform
      });
    }

    res.json({
      success: true,
      message: 'Content processed and posted successfully',
      platform: route.platform,
      postId: result && result.postId ? result.postId : null,
      url: result && result.url ? result.url : null
    });

  } catch (error) {
    console.error('Error processing journal entry:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'warp-coding-app-backend'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/webhook/journal`);
});

module.exports = app;