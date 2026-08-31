// Archetype-based routing configuration
const archetypeRoutes = {
  // TikTok content routes
  'coding-tips': {
    platform: 'tiktok',
    format: 'short-form',
    maxLength: 280,
    hashtags: ['#coding', '#programming', '#techtips', '#developer'],
    targetAudience: 'developers'
  },
  'code-review': {
    platform: 'tiktok',
    format: 'short-form',
    maxLength: 280,
    hashtags: ['#codereview', '#programming', '#bestpractices', '#developer'],
    targetAudience: 'developers'
  },
  'debugging': {
    platform: 'tiktok',
    format: 'short-form',
    maxLength: 280,
    hashtags: ['#debugging', '#programming', '#coding', '#developer'],
    targetAudience: 'developers'
  },

  // Threads content routes
  'tech-news': {
    platform: 'threads',
    format: 'long-form',
    maxLength: 500,
    hashtags: ['#technews', '#programming', '#technology', '#innovation'],
    targetAudience: 'tech-enthusiasts'
  },
  'tutorial': {
    platform: 'threads',
    format: 'long-form',
    maxLength: 500,
    hashtags: ['#tutorial', '#programming', '#coding', '#learntocode'],
    targetAudience: 'learners'
  },
  'industry-insights': {
    platform: 'threads',
    format: 'long-form',
    maxLength: 500,
    hashtags: ['#techindustry', '#programming', '#career', '#developer'],
    targetAudience: 'professionals'
  },

  // LinkedIn content routes
  'career-advice': {
    platform: 'linkedin',
    format: 'professional',
    maxLength: 1300,
    hashtags: ['#career', '#programming', '#techcareer', '#developer'],
    targetAudience: 'professionals'
  },
  'project-showcase': {
    platform: 'linkedin',
    format: 'professional',
    maxLength: 1300,
    hashtags: ['#project', '#programming', '#portfolio', '#developer'],
    targetAudience: 'professionals'
  },

  // Twitter/X content routes
  'quick-tips': {
    platform: 'twitter',
    format: 'micro-blog',
    maxLength: 280,
    hashtags: ['#coding', '#programming', '#tips', '#developer'],
    targetAudience: 'developers'
  },
  'tech-quotes': {
    platform: 'twitter',
    format: 'micro-blog',
    maxLength: 280,
    hashtags: ['#techquotes', '#programming', '#motivation', '#developer'],
    targetAudience: 'developers'
  }
};

class Router {
  constructor() {
    this.routes = archetypeRoutes;
  }

  // Get route configuration for an archetype
  getRoute(archetype) {
    return this.routes[archetype] || null;
  }

  // Get all available archetypes
  getAvailableArchetypes() {
    return Object.keys(this.routes);
  }

  // Get routes by platform
  getRoutesByPlatform(platform) {
    return Object.entries(this.routes)
      .filter(([_, config]) => config.platform === platform)
      .map(([archetype, config]) => ({ archetype, ...config }));
  }

  // Add new route dynamically
  addRoute(archetype, config) {
    this.routes[archetype] = config;
  }

  // Remove route
  removeRoute(archetype) {
    delete this.routes[archetype];
  }

  // Validate route configuration
  validateRoute(config) {
    const requiredFields = ['platform', 'format', 'maxLength', 'hashtags', 'targetAudience'];
    return requiredFields.every(field => config.hasOwnProperty(field));
  }
}

module.exports = new Router();