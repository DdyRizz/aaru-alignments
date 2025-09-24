// Content formatting utilities for different platforms
class ContentFormatter {
  constructor() {
    this.platformFormats = {
      tiktok: this.formatTikTok.bind(this),
      threads: this.formatThreads.bind(this),
      linkedin: this.formatLinkedIn.bind(this),
      twitter: this.formatTwitter.bind(this)
    };
  }

  // Main formatting function
  async format(content, platform, metadata = {}) {
    const formatter = this.platformFormats[platform];
    if (!formatter) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    return formatter(content, metadata);
  }

  // TikTok formatting
  formatTikTok(content, metadata) {
    const { hashtags = [], maxLength = 280 } = metadata;
    
    // Extract key points for short-form content
    const keyPoints = this.extractKeyPoints(content);
    const formattedContent = this.createShortFormContent(keyPoints, hashtags, maxLength);
    
    return {
      text: formattedContent,
      platform: 'tiktok',
      format: 'short-form',
      length: formattedContent.length,
      hashtags: hashtags,
      suggestions: {
        videoIdeas: this.generateVideoIdeas(keyPoints),
        hooks: this.generateHooks(keyPoints)
      }
    };
  }

  // Threads formatting
  formatThreads(content, metadata) {
    const { hashtags = [], maxLength = 500 } = metadata;
    
    // Create thread structure
    const thread = this.createThreadStructure(content, hashtags, maxLength);
    
    return {
      text: thread.content,
      platform: 'threads',
      format: 'long-form',
      length: thread.content.length,
      hashtags: hashtags,
      threadCount: thread.threadCount,
      suggestions: {
        engagement: this.generateEngagementTips(),
        callToAction: this.generateCallToAction()
      }
    };
  }

  // LinkedIn formatting
  formatLinkedIn(content, metadata) {
    const { hashtags = [], maxLength = 1300 } = metadata;
    
    // Professional formatting
    const professionalContent = this.createProfessionalContent(content, hashtags, maxLength);
    
    return {
      text: professionalContent,
      platform: 'linkedin',
      format: 'professional',
      length: professionalContent.length,
      hashtags: hashtags,
      suggestions: {
        networking: this.generateNetworkingTips(),
        industryInsights: this.generateIndustryInsights()
      }
    };
  }

  // Twitter formatting
  formatTwitter(content, metadata) {
    const { hashtags = [], maxLength = 280 } = metadata;
    
    // Micro-blog formatting
    const tweet = this.createTweetContent(content, hashtags, maxLength);
    
    return {
      text: tweet,
      platform: 'twitter',
      format: 'micro-blog',
      length: tweet.length,
      hashtags: hashtags,
      suggestions: {
        retweetable: this.generateRetweetableContent(),
        trending: this.generateTrendingTopics()
      }
    };
  }

  // Helper methods
  extractKeyPoints(content) {
    // Simple key point extraction (can be enhanced with NLP)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    return sentences.slice(0, 3); // Take first 3 meaningful sentences
  }

  createShortFormContent(keyPoints, hashtags, maxLength) {
    const content = keyPoints.join(' ');
    const hashtagString = hashtags.join(' ');
    const availableLength = maxLength - hashtagString.length - 2; // -2 for space and newline
    
    let formattedContent = content.substring(0, availableLength);
    if (content.length > availableLength) {
      formattedContent += '...';
    }
    
    return `${formattedContent}\n\n${hashtagString}`;
  }

  createThreadStructure(content, hashtags, maxLength) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const threads = [];
    let currentThread = '';
    let threadCount = 1;

    for (const sentence of sentences) {
      if (currentThread.length + sentence.length + 1 <= maxLength) {
        currentThread += (currentThread ? ' ' : '') + sentence.trim() + '.';
      } else {
        if (currentThread) {
          threads.push(currentThread);
          currentThread = sentence.trim() + '.';
          threadCount++;
        }
      }
    }

    if (currentThread) {
      threads.push(currentThread);
    }

    const hashtagString = hashtags.join(' ');
    const content = threads.join('\n\n---\n\n') + (hashtagString ? `\n\n${hashtagString}` : '');

    return { content, threadCount };
  }

  createProfessionalContent(content, hashtags, maxLength) {
    // Add professional opening
    const opening = "💡 Professional Insight:\n\n";
    const closing = "\n\nWhat are your thoughts on this? Let's discuss in the comments! 👇";
    const hashtagString = hashtags.join(' ');
    
    const availableLength = maxLength - opening.length - closing.length - hashtagString.length - 3;
    const mainContent = content.substring(0, availableLength);
    
    return `${opening}${mainContent}${closing}\n\n${hashtagString}`;
  }

  createTweetContent(content, hashtags, maxLength) {
    const hashtagString = hashtags.join(' ');
    const availableLength = maxLength - hashtagString.length - 1;
    
    let tweet = content.substring(0, availableLength);
    if (content.length > availableLength) {
      tweet += '...';
    }
    
    return `${tweet} ${hashtagString}`;
  }

  // Suggestion generators
  generateVideoIdeas(keyPoints) {
    return [
      "Screen recording of the code in action",
      "Split screen: problem vs solution",
      "Quick tutorial with voiceover",
      "Before/after comparison"
    ];
  }

  generateHooks(keyPoints) {
    return [
      "You won't believe what happened when...",
      "This one trick changed everything...",
      "Developers hate this simple mistake...",
      "I wish I knew this earlier..."
    ];
  }

  generateEngagementTips() {
    return [
      "Ask a question at the end",
      "Share a personal experience",
      "Include a poll or survey",
      "Tag relevant people or companies"
    ];
  }

  generateCallToAction() {
    return [
      "What's your experience with this?",
      "Share your thoughts below!",
      "Have you tried this approach?",
      "Let me know if this helps!"
    ];
  }

  generateNetworkingTips() {
    return [
      "Connect with industry professionals",
      "Join relevant groups and communities",
      "Share your expertise regularly",
      "Engage with others' content"
    ];
  }

  generateIndustryInsights() {
    return [
      "Market trends and predictions",
      "Salary and career progression data",
      "Technology adoption rates",
      "Industry challenges and solutions"
    ];
  }

  generateRetweetableContent() {
    return [
      "Shareable quotes and insights",
      "Quick tips and tricks",
      "Industry news and updates",
      "Motivational content for developers"
    ];
  }

  generateTrendingTopics() {
    return [
      "#AI", "#MachineLearning", "#WebDev", "#DataScience",
      "#CloudComputing", "#DevOps", "#Cybersecurity", "#Blockchain"
    ];
  }
}

module.exports = new ContentFormatter();