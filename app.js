// app.js

import { sdk } from '@farcaster/miniapp-sdk';

console.log('🛠️ App loading…');
window.addEventListener('error', e => console.error('Unhandled error:', e.error));

const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';
const NEWS_API_KEY = 'bc419587b5ac425b99ed67a265f50946';    // Replace with your free NewsAPI.org key
const SOURCES      = ['techcrunch','forbes','techradar','yahoo'];  
const POLL_INTERVAL = 30000;  // 30s

let newsItems = [];
let bookmarks = [];

// Show skeleton placeholders while loading
function renderSkeleton(count = 5) {
  const app = document.getElementById('app');
  app.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const skel = document.createElement('div');
    skel.className = 'news-card skeleton';
    skel.innerHTML = `
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
    app.appendChild(skel);
  }
}

// Fetch top headlines from free news sources
async function fetchNews() {
  renderSkeleton();
  try {
    const url = `${NEWS_API_URL}?sources=${SOURCES.join(',')}&pageSize=20&apiKey=${NEWS_API_KEY}`;
    console.log('Fetching news from:', url);
    const res = await fetch(url);
    console.log('Response status:', res.status);
    const body = await res.text();
    console.log('Raw body:', body);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const data = JSON.parse(body);
    console.log('Parsed data:', data);
    newsItems = data.articles.map((a, idx) => ({
      id: `ext-${idx}`,
      title: a.title,
      excerpt: a.description || '',
      author: a.author || a.source.name,
      timestamp: new Date(a.publishedAt).toLocaleTimeString(),
      imageUrl: a.urlToImage || '',
      sourceUrl: a.url,
      isBookmarked: bookmarks.includes(`ext-${idx}`)
    }));
    renderApp();
  } catch (err) {
    console.error('Error fetching news:', err);
    document.getElementById('app').innerHTML = `<div class="error">Error loading news: ${err.message}</div>`;
  }
}

// Render news cards with bookmark & share
function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  if (!newsItems.length) {
    app.innerHTML = '<p class="empty">No news articles available.</p>';
    return;
  }
  newsItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `
      ${item.imageUrl
        ? `<img src="${item.imageUrl}" alt="${item.title}" class="news-image"/>`
        : ''}
      <div class="news-content">
        <h2 class="news-title">${item.title}</h2>
        <p class="news-excerpt">${item.excerpt}</p>
        <div class="news-meta">
          <span class="news-author">${item.author}</span>
          <span class="news-timestamp">${item.timestamp}</span>
        </div>
        <div class="news-actions">
          <button class="btn bookmark-btn">${item.isBookmarked ? '💖' : '🤍'}</button>
          <a href="${item.sourceUrl}" target="_blank" rel="noopener" class="btn external-btn">↗</a>
        </div>
      </div>
    `;
    card.querySelector('.bookmark-btn').addEventListener('click', () => {
      if (item.isBookmarked) bookmarks = bookmarks.filter(id => id !== item.id);
      else bookmarks.push(item.id);
      fetchNews();
    });
    app.appendChild(card);
  });
}

// Initialize and poll for real-time updates
window.addEventListener('DOMContentLoaded', async () => {
  console.log('DOMContentLoaded event fired');
  try {
    await sdk.actions.ready();
    console.log('Splash screen hidden');
  } catch (err) {
    console.error('Error calling sdk.actions.ready():', err);
  }
  fetchNews();
  setInterval(fetchNews, POLL_INTERVAL);
});
