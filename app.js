// Newscaster App JavaScript

// Application State
class NewsApp {
  constructor() {
    this.newsData = [
      {
        "id": "1",
        "title": "Base Mainnet Hits New All-Time High in Daily Transactions",
        "excerpt": "Base blockchain processes over 2.5M transactions in a single day, marking significant growth in the ecosystem.",
        "author": "jesse.base.eth",
        "channel": "base",
        "timestamp": "2 hours ago",
        "imageUrl": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop",
        "isBookmarked": false,
        "isShared": false,
        "isLive": true,
        "category": "Base"
      },
      {
        "id": "2", 
        "title": "Farcaster Launches New Mini Apps Developer Tools",
        "excerpt": "Enhanced SDK and debugging tools make it easier for developers to build interactive Mini Apps on Farcaster.",
        "author": "dwr.eth",
        "channel": "farcaster",
        "timestamp": "4 hours ago",
        "imageUrl": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop",
        "isBookmarked": false,
        "isShared": false,
        "isLive": true,
        "category": "Farcaster"
      },
      {
        "id": "3",
        "title": "DeFi TVL Surges Past $100B as Yields Increase",
        "excerpt": "Total Value Locked in DeFi protocols reaches new highs driven by attractive yield farming opportunities.",
        "author": "defi.alpha",
        "channel": "defi", 
        "timestamp": "6 hours ago",
        "imageUrl": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=200&fit=crop",
        "isBookmarked": false,
        "isShared": false,
        "isLive": false,
        "category": "DeFi"
      },
      {
        "id": "4",
        "title": "New AI Agent Framework Built on Base Goes Viral",
        "excerpt": "Revolutionary AI framework allows anyone to deploy autonomous agents with crypto capabilities in minutes.",
        "author": "crypto.builder",
        "channel": "tech",
        "timestamp": "8 hours ago", 
        "imageUrl": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop",
        "isBookmarked": false,
        "isShared": false,
        "isLive": false,
        "category": "Tech"
      },
      {
        "id": "5",
        "title": "Degen Token Launches New Community Governance Features",
        "excerpt": "DEGEN holders can now vote on protocol upgrades and community initiatives through new governance portal.",
        "author": "degen.dao",
        "channel": "degen",
        "timestamp": "10 hours ago",
        "imageUrl": "https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=400&h=200&fit=crop", 
        "isBookmarked": false,
        "isShared": false,
        "isLive": false,
        "category": "Degen"
      },
      {
        "id": "6",
        "title": "Bitcoin ETF Sees Record $2B Inflow This Week",
        "excerpt": "Institutional demand for Bitcoin exposure continues to grow as ETF products gain mainstream adoption.",
        "author": "btc.news",
        "channel": "crypto",
        "timestamp": "12 hours ago",
        "imageUrl": "https://images.unsplash.com/photo-1518544866273-fc86f1b1b96c?w=400&h=200&fit=crop",
        "isBookmarked": false,
        "isShared": false,
        "isLive": false,
        "category": "Crypto"
      },
      {
        "id": "7",
        "title": "NFT Collection Generates $5M Revenue in 24 Hours",
        "excerpt": "Limited edition PFP collection sells out instantly, showcasing continued demand for quality digital collectibles.",
        "author": "nft.alpha",
        "channel": "nfts",
        "timestamp": "14 hours ago",
        "imageUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=200&fit=crop",
        "isBookmarked": false,   
        "isShared": false,
        "isLive": false,
        "category": "NFTs"
      },
      {
        "id": "8",
        "title": "Layer 2 Scaling Solutions See 300% Growth",
        "excerpt": "Ethereum Layer 2 networks experience massive adoption as gas fees decrease and transaction speeds improve.",
        "author": "l2.researcher", 
        "channel": "tech",
        "timestamp": "16 hours ago",
        "imageUrl": "https://images.unsplash.com/photo-1559526324-593bc073d938?w=400&h=200&fit=crop",
        "isBookmarked": false,
        "isShared": false,
        "isLive": false,
        "category": "Tech"
      },
      {
        "id": "9",
        "title": "Coinbase Announces Major Platform Upgrade",
        "excerpt": "Enhanced trading features and improved user interface rolling out to millions of users globally.",
        "author": "coinbase.news",
        "channel": "crypto",
        "timestamp": "18 hours ago",
        "imageUrl": "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=200&fit=crop",
        "isBookmarked": false,
        "isShared": false,
        "isLive": false,
        "category": "Crypto"
      },
      {
        "id": "10",
        "title": "New Yield Farming Protocol Launches on Base",
        "excerpt": "Innovative DeFi protocol offers up to 25% APY on stablecoin deposits with minimal impermanent loss risk.",
        "author": "yield.farmer",
        "channel": "defi",
        "timestamp": "20 hours ago",
        "imageUrl": "https://images.unsplash.com/photo-1640161704729-cbe966a08476?w=400&h=200&fit=crop",
        "isBookmarked": false,
        "isShared": false,
        "isLive": false,
        "category": "DeFi"
      }
    ];
    
    this.categories = ["All", "Tech", "Crypto", "DeFi", "Base", "Farcaster", "NFTs", "Degen"];
    this.currentCategory = "All";
    this.searchQuery = "";
    this.bookmarkedItems = new Set();
    this.sharedItems = new Set();
    this.highlightedCard = null;
    this.currentShareItem = null;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderNews();
    this.simulateRealTimeUpdates();
    
    // Hide loading state after initial render
    setTimeout(() => {
      const loadingState = document.getElementById('loadingState');
      if (loadingState) {
        loadingState.classList.add('hidden');
      }
    }, 1000);
  }

  setupEventListeners() {
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');

    if (searchBtn && searchModal) {
      searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        searchModal.classList.remove('hidden');
        if (searchInput) {
          setTimeout(() => searchInput.focus(), 100);
        }
      });
    }

    if (searchClose && searchModal) {
      searchClose.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        searchModal.classList.add('hidden');
        if (searchInput) {
          searchInput.value = '';
        }
        this.searchQuery = '';
        this.renderNews();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderNews();
      });
    }

    // Category navigation
    const navTabs = document.getElementById('navTabs');
    if (navTabs) {
      navTabs.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-tab')) {
          e.preventDefault();
          e.stopPropagation();
          
          // Update active tab
          document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
          });
          e.target.classList.add('active');
          
          // Update current category
          this.currentCategory = e.target.dataset.category;
          this.renderNews();
        }
      });
    }

    // Share Modal functionality
    this.setupShareModal();

    // Close search modal when clicking outside
    document.addEventListener('click', (e) => {
      const searchModal = document.getElementById('searchModal');
      const searchBtn = document.getElementById('searchBtn');
      
      if (searchModal && searchBtn && 
          !searchModal.contains(e.target) && 
          !searchBtn.contains(e.target) && 
          !searchModal.classList.contains('hidden')) {
        searchModal.classList.add('hidden');
      }
    });

    // Handle escape key for modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const searchModal = document.getElementById('searchModal');
        const shareModal = document.getElementById('shareModal');
        const searchInput = document.getElementById('searchInput');
        
        if (searchModal && !searchModal.classList.contains('hidden')) {
          searchModal.classList.add('hidden');
          if (searchInput) {
            searchInput.value = '';
          }
          this.searchQuery = '';
          this.renderNews();
        }
        
        if (shareModal && !shareModal.classList.contains('hidden')) {
          this.closeShareModal();
        }
      }
    });
  }

  setupShareModal() {
    const shareModal = document.getElementById('shareModal');
    const shareBackdrop = document.getElementById('shareBackdrop');
    const shareClose = document.getElementById('shareClose');
    const shareCancelBtn = document.getElementById('shareCancelBtn');
    const shareConfirmBtn = document.getElementById('shareConfirmBtn');

    // Close modal handlers
    [shareBackdrop, shareClose, shareCancelBtn].forEach(element => {
      if (element) {
        element.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.closeShareModal();
        });
      }
    });

    // Share confirm handler
    if (shareConfirmBtn) {
      shareConfirmBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.confirmShare();
      });
    }
  }

  openShareModal(newsId) {
    const newsItem = this.newsData.find(item => item.id === newsId);
    if (!newsItem) return;

    this.currentShareItem = newsItem;
    const shareModal = document.getElementById('shareModal');
    const sharePreview = document.getElementById('sharePreview');
    const shareMessage = document.getElementById('shareMessage');

    if (sharePreview) {
      sharePreview.innerHTML = `
        <h4 class="share-preview__title">${newsItem.title}</h4>
        <p class="share-preview__excerpt">${newsItem.excerpt}</p>
        <p class="share-preview__meta">By ${newsItem.author} • /${newsItem.channel} • ${newsItem.timestamp}</p>
      `;
    }

    if (shareMessage) {
      shareMessage.value = '';
    }

    if (shareModal) {
      shareModal.classList.remove('hidden');
      // Focus on the message input
      setTimeout(() => {
        if (shareMessage) {
          shareMessage.focus();
        }
      }, 300);
    }
  }

  closeShareModal() {
    const shareModal = document.getElementById('shareModal');
    const shareMessage = document.getElementById('shareMessage');
    
    if (shareModal) {
      shareModal.classList.add('hidden');
    }
    
    if (shareMessage) {
      shareMessage.value = '';
    }
    
    this.currentShareItem = null;
  }

  confirmShare() {
    if (!this.currentShareItem) return;

    const shareMessage = document.getElementById('shareMessage');
    const customMessage = shareMessage ? shareMessage.value.trim() : '';

    // Mark as shared
    this.currentShareItem.isShared = true;
    this.sharedItems.add(this.currentShareItem.id);

    // Close modal
    this.closeShareModal();

    // Show success toast
    this.showShareToast();

    // Re-render to update UI
    this.renderNews();

    // Simulate posting to Farcaster (console log for demo)
    console.log('Shared to Farcaster:', {
      article: this.currentShareItem.title,
      customMessage: customMessage,
      timestamp: new Date().toISOString()
    });
  }

  showShareToast() {
    const shareToast = document.getElementById('shareToast');
    if (shareToast) {
      shareToast.classList.remove('hidden');
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        shareToast.classList.add('hidden');
      }, 3000);
    }
  }

  toggleBookmark(newsId) {
    const newsItem = this.newsData.find(item => item.id === newsId);
    if (newsItem) {
      if (this.bookmarkedItems.has(newsId)) {
        this.bookmarkedItems.delete(newsId);
        newsItem.isBookmarked = false;
      } else {
        this.bookmarkedItems.add(newsId);
        newsItem.isBookmarked = true;
      }
      
      // Re-render to update the UI
      this.renderNews();
    }
  }

  handleShare(newsId) {
    this.openShareModal(newsId);
  }

  highlightCard(newsId) {
    // Remove previous highlight
    if (this.highlightedCard) {
      const prevCard = document.querySelector(`[data-news-id="${this.highlightedCard}"]`);
      if (prevCard) {
        prevCard.classList.remove('highlighted');
      }
    }
    
    // Add new highlight
    const card = document.querySelector(`[data-news-id="${newsId}"]`);
    if (card) {
      card.classList.add('highlighted');
      this.highlightedCard = newsId;
      
      // Remove highlight after 3 seconds
      setTimeout(() => {
        if (card) {
          card.classList.remove('highlighted');
        }
        if (this.highlightedCard === newsId) {
          this.highlightedCard = null;
        }
      }, 3000);
    }
  }

  getFilteredNews() {
    let filteredNews = [...this.newsData];

    // Filter by category
    if (this.currentCategory === "Bookmarks") {
      filteredNews = filteredNews.filter(item => this.bookmarkedItems.has(item.id));
    } else if (this.currentCategory !== "All") {
      filteredNews = filteredNews.filter(item => item.category === this.currentCategory);
    }

    // Filter by search query
    if (this.searchQuery) {
      filteredNews = filteredNews.filter(item =>
        item.title.toLowerCase().includes(this.searchQuery) ||
        item.excerpt.toLowerCase().includes(this.searchQuery) ||
        item.author.toLowerCase().includes(this.searchQuery)
      );
    }

    // Sort by live status and timestamp (live items first)
    return filteredNews.sort((a, b) => {
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      return 0;
    });
  }

  createNewsCard(newsItem) {
    const card = document.createElement('article');
    card.className = 'news-card';
    card.dataset.newsId = newsItem.id;
    
    const isBookmarked = this.bookmarkedItems.has(newsItem.id);
    const isShared = this.sharedItems.has(newsItem.id);
    
    card.innerHTML = `
      <div class="news-card__image">
        <img src="${newsItem.imageUrl}" alt="${newsItem.title}" loading="lazy">
        ${newsItem.isLive ? '<span class="news-card__live-badge">🔴 LIVE</span>' : ''}
        <div class="news-card__actions">
          <button class="news-card__bookmark ${isBookmarked ? 'bookmarked' : ''}" 
                  data-news-id="${newsItem.id}" 
                  data-action="bookmark"
                  aria-label="${isBookmarked ? 'Remove bookmark' : 'Add bookmark'}">
            ${isBookmarked ? '💜' : '🤍'}
          </button>
          <button class="news-card__share ${isShared ? 'shared' : ''}" 
                  data-news-id="${newsItem.id}" 
                  data-action="share"
                  aria-label="Share to Farcaster">
            ${isShared ? '✅' : '📤'}
          </button>
        </div>
      </div>
      <div class="news-card__content">
        <h2 class="news-card__title">${newsItem.title}</h2>
        <p class="news-card__excerpt">${newsItem.excerpt}</p>
        <div class="news-card__meta">
          <div class="news-card__author">
            <span class="news-card__channel">/${newsItem.channel}</span>
            <span class="news-card__author-name">${newsItem.author}</span>
          </div>
          <span class="news-card__timestamp">${newsItem.timestamp}</span>
        </div>
      </div>
    `;

    // Add single click handler for the entire card
    card.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const target = e.target.closest('[data-action]');
      
      if (target) {
        const action = target.dataset.action;
        const newsId = target.dataset.newsId;
        
        if (action === 'bookmark') {
          this.toggleBookmark(newsId);
        } else if (action === 'share') {
          this.handleShare(newsId);
        }
      } else {
        // Highlight card if not clicking on action buttons
        this.highlightCard(newsItem.id);
      }
    });

    return card;
  }

  renderNews() {
    const newsFeed = document.getElementById('newsFeed');
    const emptyState = document.getElementById('emptyState');
    const bookmarksEmptyState = document.getElementById('bookmarksEmptyState');
    const liveIndicator = document.getElementById('liveIndicator');
    
    if (!newsFeed) return;
    
    const filteredNews = this.getFilteredNews();
    
    // Clear previous content
    newsFeed.innerHTML = '';
    
    // Hide all empty states initially
    if (emptyState) emptyState.classList.add('hidden');
    if (bookmarksEmptyState) bookmarksEmptyState.classList.add('hidden');
    
    // Show live indicator if there are live items and not in bookmarks
    const hasLiveItems = filteredNews.some(item => item.isLive);
    if (liveIndicator) {
      if (hasLiveItems && this.currentCategory !== "Bookmarks") {
        liveIndicator.classList.remove('hidden');
      } else {
        liveIndicator.classList.add('hidden');
      }
    }
    
    if (filteredNews.length === 0) {
      // Show appropriate empty state
      if (this.currentCategory === "Bookmarks") {
        if (bookmarksEmptyState) bookmarksEmptyState.classList.remove('hidden');
      } else {
        if (emptyState) emptyState.classList.remove('hidden');
      }
    } else {
      // Render news cards
      filteredNews.forEach(newsItem => {
        const card = this.createNewsCard(newsItem);
        newsFeed.appendChild(card);
      });
    }
  }

  simulateRealTimeUpdates() {
    // Simulate new live content every 30 seconds
    setInterval(() => {
      // Only add live status if not all items are already live
      const nonLiveItems = this.newsData.filter(item => !item.isLive);
      if (nonLiveItems.length > 0) {
        const randomItem = nonLiveItems[Math.floor(Math.random() * nonLiveItems.length)];
        randomItem.isLive = true;
        
        // Re-render if showing all or matching category
        if (this.currentCategory === "All" || this.currentCategory === randomItem.category) {
          this.renderNews();
        }
        
        // Remove live status after 15 seconds
        setTimeout(() => {
          randomItem.isLive = false;
          if (this.currentCategory === "All" || this.currentCategory === randomItem.category) {
            this.renderNews();
          }
        }, 15000);
      }
    }, 30000);

    // Make live indicator clickable
    const liveIndicator = document.getElementById('liveIndicator');
    if (liveIndicator) {
      liveIndicator.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      liveIndicator.style.cursor = 'pointer';
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new NewsApp();
});

// Handle image loading errors with a better fallback
document.addEventListener('error', (e) => {
  if (e.target.tagName === 'IMG') {
    e.target.style.display = 'none';
    const parent = e.target.parentElement;
    if (parent && parent.classList.contains('news-card__image')) {
      parent.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      parent.style.display = 'flex';
      parent.style.alignItems = 'center';
      parent.style.justifyContent = 'center';
      parent.innerHTML += '<span style="color: white; font-size: 14px; font-weight: 500;">📰 News Image</span>';
    }
  }
}, true);