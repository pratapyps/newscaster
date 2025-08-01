// app.js

import { sdk } from '@farcaster/miniapp-sdk';

const API_URL = 'https://api.farcaster.xyz/warpcast/v2/casts';

let newsItems = [];
let isLoading = true;

// Show skeleton cards while loading
function renderSkeleton(count = 5) {
  const appContainer = document.getElementById('app');
  appContainer.innerHTML = '';
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
    appContainer.appendChild(skeleton);
  }
}

// Fetch real-time casts
async function fetchNews(categories = []) {
  isLoading = true;
  renderSkeleton();
  try {
    const channelQuery = categories.length ? `?channels=${categories.join(',')}` : '';
    const response = await fetch(`${API_URL}${channelQuery}&limit=20`);
    const data = await response.json();
    newsItems = data.casts.map(cast => ({
      id: cast.hash,
      title: (cast.text.split('\n')[0] || '').slice(0, 80) || 'No Title',
      excerpt: cast.text.slice(0, 120),
      author: cast.fidUser.username,
      timestamp: new Date(cast.timestamp).toLocaleTimeString(),
      imageUrl: cast.embeds?.[0]?.url || '',
      isBookmarked: false,
      isShared: false,
      isLive: true,
      category: cast.channelName || 'All'
    }));
  } catch (err) {
    console.error('Error fetching news:', err);
  } finally {
    isLoading = false;
    renderApp(newsItems);
  }
}

// Render the app UI
function renderApp(items) {
  const appContainer = document.getElementById('app');
  appContainer.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `
      ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.title}" class="news-image"/>` : ''}
      <div class="news-content">
        <h2 class="news-title">${item.title}</h2>
        <p class="news-excerpt">${item.excerpt}</p>
        <div class="news-meta">
          <span class="news-author">${item.author}</span>
          <span class="news-timestamp">${item.timestamp}</span>
          ${item.isLive ? '<span class="badge live">LIVE</span>' : ''}
        </div>
        <div class="news-actions">
          <button class="btn bookmark-btn">${item.isBookmarked ? '💖' : '🤍'}</button>
          <button class="btn share-btn">📤</button>
        </div>
      </div>
    `;
    card.querySelector('.bookmark-btn').addEventListener('click', () => {
      item.isBookmarked = !item.isBookmarked;
      renderApp(items);
    });
    card.querySelector('.share-btn').addEventListener('click', () => {
      const message = prompt('Add message to share:', '');
      alert(`Shared: ${item.title}\nMessage: ${message}`);
      item.isShared = true;
    });
    appContainer.appendChild(card);
  });
}

// Initial load and polling
fetchNews(['base','crypto','tech','defi','farcaster']);
setInterval(() => fetchNews(['base','crypto','tech','defi','farcaster']), 30000);

// Hide splash screen when ready
window.addEventListener('DOMContentLoaded', async () => {
  try { await sdk.actions.ready(); }
  catch (err) { console.error(err); }
});
