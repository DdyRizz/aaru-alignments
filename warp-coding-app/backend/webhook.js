const express = require('express');
const router = require('./router');
const formatContent = require('./formatContent');
const postToPlatform = require('./postToPlatform');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

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
    
    res.json({
      success: true,
      message: 'Content processed and posted successfully',
      platform: route.platform,
      postId: result.postId || null,
      url: result.url || null
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