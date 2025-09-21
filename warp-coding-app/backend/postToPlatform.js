const axios = require('axios');

// Platform posting utilities
class PlatformPoster {
  constructor() {
    this.platforms = {
      tiktok: this.postToTikTok.bind(this),
      threads: this.postToThreads.bind(this),
      linkedin: this.postToLinkedIn.bind(this),
      twitter: this.postToTwitter.bind(this)
    };
  }

  // Main posting function
  async post(formattedContent, route) {
    const { platform } = route;
    const poster = this.platforms[platform];
    
    if (!poster) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    return await poster(formattedContent, route);
  }

  // TikTok posting (via Pipedream webhook)
  async postToTikTok(formattedContent, route) {
    const webhookUrl = process.env.PIPEDREAM_TIKTOK_WEBHOOK;
    
    if (!webhookUrl) {
      console.warn('Pipedream TikTok webhook URL not configured');
      return { success: false, error: 'Webhook URL not configured' };
    }

    try {
      const payload = {
        content: formattedContent.text,
        platform: 'tiktok',
        metadata: {
          hashtags: formattedContent.hashtags,
          suggestions: formattedContent.suggestions,
          route: route
        }
      };

      const response = await axios.post(webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PIPEDREAM_API_KEY}`
        }
      });

      return {
        success: true,
        postId: response.data.postId,
        url: response.data.url,
        platform: 'tiktok'
      };

    } catch (error) {
      console.error('Error posting to TikTok:', error.message);
      return {
        success: false,
        error: error.message,
        platform: 'tiktok'
      };
    }
  }

  // Threads posting (via Pipedream webhook)
  async postToThreads(formattedContent, route) {
    const webhookUrl = process.env.PIPEDREAM_THREADS_WEBHOOK;
    
    if (!webhookUrl) {
      console.warn('Pipedream Threads webhook URL not configured');
      return { success: false, error: 'Webhook URL not configured' };
    }

    try {
      const payload = {
        content: formattedContent.text,
        platform: 'threads',
        metadata: {
          hashtags: formattedContent.hashtags,
          threadCount: formattedContent.threadCount,
          suggestions: formattedContent.suggestions,
          route: route
        }
      };

      const response = await axios.post(webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PIPEDREAM_API_KEY}`
        }
      });

      return {
        success: true,
        postId: response.data.postId,
        url: response.data.url,
        platform: 'threads'
      };

    } catch (error) {
      console.error('Error posting to Threads:', error.message);
      return {
        success: false,
        error: error.message,
        platform: 'threads'
      };
    }
  }

  // LinkedIn posting (via Pipedream webhook)
  async postToLinkedIn(formattedContent, route) {
    const webhookUrl = process.env.PIPEDREAM_LINKEDIN_WEBHOOK;
    
    if (!webhookUrl) {
      console.warn('Pipedream LinkedIn webhook URL not configured');
      return { success: false, error: 'Webhook URL not configured' };
    }

    try {
      const payload = {
        content: formattedContent.text,
        platform: 'linkedin',
        metadata: {
          hashtags: formattedContent.hashtags,
          suggestions: formattedContent.suggestions,
          route: route
        }
      };

      const response = await axios.post(webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PIPEDREAM_API_KEY}`
        }
      });

      return {
        success: true,
        postId: response.data.postId,
        url: response.data.url,
        platform: 'linkedin'
      };

    } catch (error) {
      console.error('Error posting to LinkedIn:', error.message);
      return {
        success: false,
        error: error.message,
        platform: 'linkedin'
      };
    }
  }

  // Twitter posting (via Pipedream webhook)
  async postToTwitter(formattedContent, route) {
    const webhookUrl = process.env.PIPEDREAM_TWITTER_WEBHOOK;
    
    if (!webhookUrl) {
      console.warn('Pipedream Twitter webhook URL not configured');
      return { success: false, error: 'Webhook URL not configured' };
    }

    try {
      const payload = {
        content: formattedContent.text,
        platform: 'twitter',
        metadata: {
          hashtags: formattedContent.hashtags,
          suggestions: formattedContent.suggestions,
          route: route
        }
      };

      const response = await axios.post(webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PIPEDREAM_API_KEY}`
        }
      });

      return {
        success: true,
        postId: response.data.postId,
        url: response.data.url,
        platform: 'twitter'
      };

    } catch (error) {
      console.error('Error posting to Twitter:', error.message);
      return {
        success: false,
        error: error.message,
        platform: 'twitter'
      };
    }
  }

  // Alternative: Direct API posting (if webhooks are not available)
  async postDirectly(formattedContent, route) {
    const { platform } = route;
    
    switch (platform) {
      case 'twitter':
        return await this.postToTwitterAPI(formattedContent);
      case 'linkedin':
        return await this.postToLinkedInAPI(formattedContent);
      default:
        throw new Error(`Direct posting not implemented for ${platform}`);
    }
  }

  // Direct Twitter API posting
  async postToTwitterAPI(formattedContent) {
    const twitterAPI = process.env.TWITTER_API_URL;
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    
    if (!twitterAPI || !bearerToken) {
      throw new Error('Twitter API credentials not configured');
    }

    try {
      const response = await axios.post(`${twitterAPI}/2/tweets`, {
        text: formattedContent.text
      }, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        postId: response.data.data.id,
        url: `https://twitter.com/user/status/${response.data.data.id}`,
        platform: 'twitter'
      };

    } catch (error) {
      console.error('Error posting to Twitter API:', error.message);
      return {
        success: false,
        error: error.message,
        platform: 'twitter'
      };
    }
  }

  // Direct LinkedIn API posting
  async postToLinkedInAPI(formattedContent) {
    const linkedinAPI = process.env.LINKEDIN_API_URL;
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    
    if (!linkedinAPI || !accessToken) {
      throw new Error('LinkedIn API credentials not configured');
    }

    try {
      const response = await axios.post(`${linkedinAPI}/ugcPosts`, {
        author: `urn:li:person:${process.env.LINKEDIN_PERSON_URN}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: formattedContent.text
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });

      return {
        success: true,
        postId: response.data.id,
        url: response.data.id, // LinkedIn doesn't provide direct URLs
        platform: 'linkedin'
      };

    } catch (error) {
      console.error('Error posting to LinkedIn API:', error.message);
      return {
        success: false,
        error: error.message,
        platform: 'linkedin'
      };
    }
  }
}

module.exports = new PlatformPoster();