// app.js

import { sdk } from '@farcaster/miniapp-sdk';

console.log('🛠️ App loading…');
window.addEventListener('error', e => console.error('Unhandled error:', e.error));

// Replace with your actual API key!
const NEWSDATA_API_KEY = 'pub_a13d516305494142b5ed774c0a17e361';
const NEWSDATA_API_URL = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&country=us&language=en&category=technology,top,world,business,science,health,entertainment,sports`;
const POLL_INTERVAL = 60000; // 1 minute

let newsItems = [];
let bookmarks = [];

// Skeleton for loading state
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

// Fetch NewsData.io headlines
async function fetchNews() {
  renderSkeleton();
  try {
    console.log('Fetching Newsdata.io…', NEWSDATA_API_URL);
    const resp = await fetch(NEWSDATA_API_URL);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
    const data = await resp.json();
    console.log('Newsdata API response:', data);
    newsItems = (data.results || []).map((item, idx) => ({
      id: item.link || 'id-' + idx,
      title: item.title,
      excerpt: item.description || '',
      author: item.source_id || item.creator?.[0] || 'News',
      timestamp: new Date(item.pubDate).toLocaleTimeString(),
      imageUrl: item.image_url || '',
      sourceUrl: item.link,
      isBookmarked: bookmarks.includes(item.link || 'id-' + idx),
      category: item.category?.[0] || 'General'
    }));
    renderApp();
  } catch (err) {
    console.error('Error fetching news:', err);
    document.getElementById('app').innerHTML = `<div class="error">Error loading news:<br>${err.message}</div>`;
  }
}

// Render cards
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
    card.innerHTML =
