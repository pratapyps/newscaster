// app.js

// Diagnostic logging
console.log('🛠️ App loading…');
window.addEventListener('error', e => console.error('Unhandled error:', e.error));

import { sdk } from '@farcaster/miniapp-sdk';

const API_URL = 'https://api.farcaster.xyz/warpcast/v2/casts';

let newsItems = [];
let isLoading = true;

// Skeleton loader
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
  isLoading =
