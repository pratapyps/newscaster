// app.js

import { sdk } from '@farcaster/miniapp-sdk';

const API_URL = 'https://api.farcaster.xyz/warpcast/v2/casts';

// Application state
let newsItems = [];

// Fetch real-time casts from a channel or multiple channels
async function fetchNews(categories = []) {
  try {
    // Example: fetch latest casts from multiple channels by name
    const channelQuery = categories.length
      ? `?channels=${categories.join(',')}`
      : '';
    const response = await fetch(`${API_URL}${channelQuery}&limit=20`);
    const data = await response.json();
    // Map casts to our news item structure
    newsItems = data.casts.map(cast => ({
      id: cast.hash,
      title: cast.text.split('\n')[0].slice(0, 100) || 'Newcast Update',
      excerpt: cast.text.slice(0, 140),
      author: cast.fidUser.username,
      channel: cast.parentHash || 'general',
      timestamp: new Date(cast.timestamp).toLocaleTimeString(),
      imageUrl: cast.embeds?.[0]?.url || '', 
      isBookmarked: false,
      isShared: false,
      isLive: true,
      category: cast.channelName || 'All'
    }));
    renderApp(newsItems);
  } catch (err) {
    console.error('Error fetching news:', err);
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

    // Bookmark toggle
    const bookmarkBtn = card.querySelector('.bookmark-btn');
    bookmarkBtn.addEventListener('click', () => {
      item.isBookmarked = !item.isBookmarked;
      renderApp(items);
    });

    // Share simulation
    const shareBtn = card.querySelector('.share-btn');
    shareBtn.addEventListener('click', () => {
      const message = prompt('Add a message to your Farcaster cast:', '');
      alert(`Shared to Farcaster:\n\n${item.title}\n\nMessage: ${message}`);
      item.isShared = true;
    });

    appContainer.appendChild(card);
  });
}

// Initial fetch and render
fetchNews(['base', 'crypto', 'tech', 'defi', 'farcaster']);

// Poll every 30 seconds for real-time updates
setInterval(() => fetchNews(['base', 'crypto', 'tech', 'defi', 'farcaster']), 30000);

// Hide the Farcaster splash screen when ready
window.addEventListener('DOMContentLoaded', async () => {
  try {
    await sdk.actions.ready();
    console.log('Splash screen hidden');
  } catch (err) {
    console.error('Error calling sdk.actions.ready()', err);
  }
});
