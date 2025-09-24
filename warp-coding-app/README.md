# Warp Coding App

A powerful automation tool that transforms your coding journal entries into engaging social media content across multiple platforms including TikTok, Threads, LinkedIn, and Twitter.

## 🚀 Features

- **Multi-Platform Support**: Automatically posts to TikTok, Threads, LinkedIn, and Twitter
- **Archetype-Based Routing**: Smart content routing based on content type and audience
- **Content Formatting**: Platform-specific content optimization and formatting
- **Webhook Integration**: Seamless integration with Pipedream and Replit bots
- **Flexible Architecture**: Easy to extend with new platforms and content types

## 📁 Project Structure

```
warp-coding-app/
├── backend/
│   ├── webhook.js         # Main webhook server
│   ├── router.js          # Archetype-based routing logic
│   ├── formatContent.js   # Content formatting for each platform
│   ├── postToPlatform.js  # Platform posting utilities
│   └── package.json       # Backend dependencies
├── frontend/              # Optional dashboard (coming soon)
├── .env                   # Environment variables and API keys
└── README.md             # This file
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd warp-coding-app
   ```

2. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and webhook URLs
   ```

4. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Pipedream Webhook URLs
PIPEDREAM_TIKTOK_WEBHOOK=https://your-pipedream-tiktok-webhook-url
PIPEDREAM_THREADS_WEBHOOK=https://your-pipedream-threads-webhook-url
PIPEDREAM_LINKEDIN_WEBHOOK=https://your-pipedream-linkedin-webhook-url
PIPEDREAM_TWITTER_WEBHOOK=https://your-pipedream-twitter-webhook-url
PIPEDREAM_API_KEY=your-pipedream-api-key

# Direct API Credentials (Alternative)
TWITTER_API_URL=https://api.twitter.com
TWITTER_BEARER_TOKEN=your-twitter-bearer-token
LINKEDIN_API_URL=https://api.linkedin.com/v2
LINKEDIN_ACCESS_TOKEN=your-linkedin-access-token
```

### Supported Archetypes

The app supports the following content archetypes:

#### TikTok
- `coding-tips` - Short coding tips and tricks
- `code-review` - Code review insights
- `debugging` - Debugging techniques and solutions

#### Threads
- `tech-news` - Technology news and updates
- `tutorial` - Step-by-step tutorials
- `industry-insights` - Industry analysis and insights

#### LinkedIn
- `career-advice` - Professional career guidance
- `project-showcase` - Project demonstrations and case studies

#### Twitter
- `quick-tips` - Quick programming tips
- `tech-quotes` - Motivational tech quotes

## 📡 API Usage

### Webhook Endpoint

**POST** `/webhook/journal`

Processes journal entries and posts to appropriate platforms.

**Request Body:**
```json
{
  "content": "Your journal entry content here...",
  "archetype": "coding-tips",
  "metadata": {
    "hashtags": ["#coding", "#programming"],
    "targetAudience": "developers"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Content processed and posted successfully",
  "platform": "tiktok",
  "postId": "1234567890",
  "url": "https://tiktok.com/@user/video/1234567890"
}
```

### Health Check

**GET** `/health`

Returns server health status.

## 🔌 Integration Options

### Option 1: Pipedream Integration (Recommended)

1. Create Pipedream workflows for each platform
2. Configure webhook URLs in your `.env` file
3. Set up authentication tokens

### Option 2: Direct API Integration

1. Obtain API credentials for each platform
2. Configure direct API endpoints in `.env`
3. The app will use direct API calls instead of webhooks

### Option 3: Replit Bot Integration

1. Deploy Replit bots for each platform
2. Configure bot URLs in `.env`
3. The app will send requests to your Replit bots

## 🎯 Content Formatting

The app automatically formats content based on platform requirements:

- **TikTok**: Short-form content with engaging hooks and video suggestions
- **Threads**: Long-form threaded content with engagement tips
- **LinkedIn**: Professional content with networking suggestions
- **Twitter**: Micro-blog format with trending topic suggestions

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```bash
docker build -t warp-coding-app .
docker run -p 3000:3000 --env-file .env warp-coding-app
```

## 🧪 Testing

```bash
npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the example configurations

## 🔄 Roadmap

- [ ] Frontend dashboard for content management
- [ ] Advanced content analytics
- [ ] Multi-language support
- [ ] Custom archetype creation
- [ ] Content scheduling
- [ ] Performance metrics dashboard

---

**Note**: Make sure to keep your API keys secure and never commit them to version control. Use environment variables for all sensitive configuration.