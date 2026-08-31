// Warp Coding App Frontend JavaScript
class WarpCodingApp {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000';
        this.posts = JSON.parse(localStorage.getItem('warpCodingPosts') || '[]');
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadRecentPosts();
        this.updateAnalytics();
        this.checkPlatformStatus();
    }

    bindEvents() {
        const form = document.getElementById('contentForm');
        form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const content = formData.get('content');
        const archetype = formData.get('archetype');
        const hashtags = formData.get('hashtags');

        if (!content || !archetype) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        this.showLoading(true);

        try {
            const response = await fetch(`${this.apiBaseUrl}/webhook/journal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    archetype,
                    metadata: {
                        hashtags: hashtags ? hashtags.split(' ').filter(tag => tag.trim()) : []
                    }
                })
            });

            const result = await response.json();

            if (result.success) {
                this.addPost({
                    id: Date.now(),
                    content: content.substring(0, 100) + '...',
                    archetype,
                    platform: result.platform,
                    postId: result.postId,
                    url: result.url,
                    timestamp: new Date().toISOString(),
                    status: 'success'
                });

                this.showNotification(`Content posted successfully to ${result.platform}!`, 'success');
                e.target.reset();
            } else {
                throw new Error(result.message || 'Failed to post content');
            }

        } catch (error) {
            console.error('Error posting content:', error);
            this.showNotification(`Error: ${error.message}`, 'error');
            
            this.addPost({
                id: Date.now(),
                content: content.substring(0, 100) + '...',
                archetype,
                platform: 'unknown',
                postId: null,
                url: null,
                timestamp: new Date().toISOString(),
                status: 'error'
            });
        } finally {
            this.showLoading(false);
        }
    }

    addPost(post) {
        this.posts.unshift(post);
        this.savePosts();
        this.loadRecentPosts();
        this.updateAnalytics();
    }

    loadRecentPosts() {
        const container = document.getElementById('recentPosts');
        
        if (this.posts.length === 0) {
            container.innerHTML = `
                <div class="no-posts">
                    <i class="fas fa-inbox"></i>
                    <p>No posts yet. Create your first content!</p>
                </div>
            `;
            return;
        }

        const postsHtml = this.posts.slice(0, 5).map(post => `
            <div class="post-item">
                <h4>${this.getArchetypeDisplayName(post.archetype)}</h4>
                <p>${post.content}</p>
                <div class="post-meta">
                    <span>${this.formatTimestamp(post.timestamp)}</span>
                    <span class="post-status ${post.status}">
                        ${post.status === 'success' ? 'Posted' : 'Failed'}
                    </span>
                </div>
            </div>
        `).join('');

        container.innerHTML = postsHtml;
    }

    updateAnalytics() {
        const totalPosts = this.posts.length;
        const successfulPosts = this.posts.filter(post => post.status === 'success').length;
        const successRate = totalPosts > 0 ? Math.round((successfulPosts / totalPosts) * 100) : 0;
        const platformsUsed = new Set(this.posts.filter(post => post.status === 'success').map(post => post.platform)).size;

        document.getElementById('totalPosts').textContent = totalPosts;
        document.getElementById('successRate').textContent = `${successRate}%`;
        document.getElementById('platformsUsed').textContent = platformsUsed;
    }

    async checkPlatformStatus() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/health`);
            const data = await response.json();
            
            if (data.status === 'healthy') {
                this.updatePlatformStatus('all', 'connected');
            } else {
                this.updatePlatformStatus('all', 'error');
            }
        } catch (error) {
            console.error('Error checking platform status:', error);
            this.updatePlatformStatus('all', 'error');
        }
    }

    updatePlatformStatus(platform, status) {
        if (platform === 'all') {
            ['tiktok', 'threads', 'linkedin', 'twitter'].forEach(p => {
                this.updatePlatformStatus(p, status);
            });
        } else {
            const indicator = document.getElementById(`${platform}-status`);
            if (indicator) {
                indicator.className = `status-indicator ${status}`;
            }
        }
    }

    getArchetypeDisplayName(archetype) {
        const displayNames = {
            'coding-tips': 'Coding Tips',
            'code-review': 'Code Review',
            'debugging': 'Debugging',
            'tech-news': 'Tech News',
            'tutorial': 'Tutorial',
            'industry-insights': 'Industry Insights',
            'career-advice': 'Career Advice',
            'project-showcase': 'Project Showcase',
            'quick-tips': 'Quick Tips',
            'tech-quotes': 'Tech Quotes'
        };
        return displayNames[archetype] || archetype;
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return date.toLocaleDateString();
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const messageElement = document.getElementById('notificationMessage');
        
        messageElement.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    savePosts() {
        localStorage.setItem('warpCodingPosts', JSON.stringify(this.posts));
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WarpCodingApp();
});

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}