// app.js

import { sdk } from '@farcaster/miniapp-sdk';

console.log('🛠️ App loading…');
window.addEventListener('error', e => console.error('Unhandled error:', e.error));

const API_URL = 'https://api.farcaster.xyz/warpcast/v2/casts';
const CATEGORIES = ['All', 'Tech', 'Crypto', 'DeFi', 'Base', 'Farcaster', 'NFTs', 'Degen'];

let newsItems = [];
let bookmarks = [];

// Render skeleton placeholders
function renderSkeleton(count = 5) {
  const app = document.getElementById('app');
  app.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'news-card skeleton';
    skeleton.innerHTML = `
      <div class="news-image placeholder"></div>
      <div class="news-content">
        <div class="news-title placeholder"></div>
        <div class="news-excerpt placeholder"></div>
        <div class="news-meta">
          <span class="news-author placeholder"></span>
          <span class="news-timestamp placeholder"></span>
        </div>
      </div>
    `;
    app.appendChild(skeleton);
  }
}

// Fetch live Farcaster casts
async function fetchNews(category = 'All') {
  renderSkeleton();
  try {
    const channels = category === 'All' ? CATEGORIES.slice(1) : [category];
    const channelQuery = channels.map(c => c.toLowerCase()).join(',');
    const res = await fetch(`${API_URL}?channels=${channelQuery}&limit=20`);
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    newsItems = data.casts.map(c => ({
      id: c.hash,
      title: (c.text.split('\n')[0] || '').slice(0, 80) || 'No Title',
      excerpt: c.text.slice(0, 120),
      author: c.fidUser.username,
      timestamp: new Date(c.timestamp).toLocaleTimeString(),
      imageUrl: c.embeds?.[0]?.url || '',
      isBookmarked: bookmarks.includes(c.hash),
      category: c.channelName || 'All'
    }));
    renderApp();
  } catch (err) {
    console.error('Fetch error:', err);
    document.getElementById('app').innerHTML = `<div class="error">Error loading news: ${err.message}</div>`;
  }
}

// Render news cards or bookmarks
function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const activeTab = document.querySelector('.nav-tab.active').dataset.category;
  const items = activeTab === 'Bookmarks'
    ? newsItems.filter(n => n.isBookmarked)
    : newsItems.filter(n => activeTab === 'All' || n.category === activeTab);

  if (!items.length) {
    app.innerHTML = '<p class="empty">No articles to display.</p>';
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `
      ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.title}" class="news-image">` : ''}
      <div class="news-content">
        <h2 class="news-title">${item.title}</h2>
        <p class="news-excerpt">${item.excerpt}</p>
        <div class="news-meta">
          <span class="news-author">${item.author}</span>
          <span class="news-timestamp">${item.timestamp}</span>
          ${item.category !== 'All' ? `<span class="badge">${item.category}</span>` : ''}
        </div>
        <div class="news-actions">
          <button class="btn bookmark-btn">${item.isBookmarked ? '💖' : '🤍'}</button>
          <button class="btn share-btn">📤</button>
        </div>
      </div>
    `;

    card.querySelector('.bookmark-btn').addEventListener('click', () => {
      if (item.isBookmarked) bookmarks = bookmarks.filter(id => id !== item.id);
      else bookmarks.push(item.id);
      fetchNews(activeTab);
    });

    card.querySelector('.share-btn').addEventListener('click', () => {
      const msg = prompt('Add a message to share:', '');
      alert(`Shared: ${item.title}\nMessage: ${msg}`);
    });

    app.appendChild(card);
  });
}

// Initialize category tabs
function initTabs() {
  const tabs = document.getElementById('navTabs').children;
  Array.from(tabs).forEach(tab => {
    tab.addEventListener('click', () => {
      Array.from(tabs).forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      fetchNews(tab.dataset.category);
    });
  });
}

// Search functionality
function initSearch() {
  document.getElementById('searchBtn').addEventListener('click', () => {
    document.getElementById('searchModal').classList.remove('hidden');
  });
  document.getElementById('searchClose').addEventListener('click', () => {
    document.getElementById('searchModal').classList.add('hidden');
  });
  document.getElementById('searchInput').addEventListener('input', e => {
    const query = e.target.value.toLowerCase();
    newsItems = newsItems.filter(n => n.title.toLowerCase().includes(query));
    renderApp();
  });
}

// Hide Farcaster splash screen
window.addEventListener('DOMContentLoaded', async () => {
  console.log('DOMContentLoaded event fired');
  try {
    await sdk.actions.ready();
    console.log('Splash screen hidden (ready called)');
  } catch (err) {
    console.error('Error calling sdk.actions.ready():', err);
  }

  initTabs();
  initSearch();
  fetchNews();
  setInterval(() => fetchNews(document.querySelector('.nav-tab.active').dataset.category), 30000);
});
