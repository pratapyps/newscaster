// app.js

// Use the global SDK from the script tag in index.html
const sdk = window.miniappSdk;

console.log('🛠️ App loading…');
window.addEventListener('error', e => console.error('Unhandled error:', e.error));

// Replace with your actual API key!
const NEWSDATA_API_KEY = 'pub_a13d516305494142b5ed774c0a17e361';
const NEWSDATA_API_URL = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&country=us&language=en&category=technology,top,world,business,science,health,entertainment,sports`;
const POLL_INTERVAL = 60000; // 1 minute

let newsItems = [];
let bookmarks = [];

// Show skeletons while loading
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
      author: item.source_id || (item.creator && item.creator[0]) || 'News',
      timestamp: new Date(item.pubDate).toLocaleTimeString(),
      imageUrl: item.image_url || '',
      sourceUrl: item.link,
      isBookmarked: bookmarks.includes(item.link || 'id-' + idx),
      category: item.category && item.category[0] ? item.category[0] : 'General'
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
    card.innerHTML = `
      ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.title}" class="news-image"/>` : ''}
      <div class="news-content">
        <h2 class="news-title">${item.title}</h2>
        <p class="news-excerpt">${item.excerpt}</p>
        <div class="news-meta">
          <span class="news-author">${item.author}</span>
          <span class="news-timestamp">${item.timestamp}</span>
          <span class="badge">${item.category}</span>
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
      renderApp();
    });
    app.appendChild(card);
  });
}

// Setup polling and initialize
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
