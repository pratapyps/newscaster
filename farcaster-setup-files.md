# Complete Farcaster Mini App Setup Files

## File 1: vercel.json (for static sites)
Place this in your repository root:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "redirects": [
    {
      "source": "/.well-known/farcaster.json",
      "destination": "https://api.farcaster.xyz/miniapps/hosted-manifest/REPLACE_WITH_YOUR_MANIFEST_ID",
      "permanent": false
    }
  ]
}
```

## File 2: next.config.js (for Next.js projects)
Place this in your repository root:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/REPLACE_WITH_YOUR_MANIFEST_ID',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
```

## File 3: Self-Hosted Manifest (public/.well-known/farcaster.json)
Alternative to hosted manifest - create folder structure: `public/.well-known/farcaster.json`

```json
{
  "accountAssociation": {
    "header": "YOUR_SIGNED_HEADER_HERE",
    "payload": "YOUR_SIGNED_PAYLOAD_HERE",
    "signature": "YOUR_SIGNED_SIGNATURE_HERE"
  },
  "miniapp": {
    "version": "1",
    "name": "Newscaster",
    "iconUrl": "https://YOUR_DOMAIN.vercel.app/icon.png",
    "homeUrl": "https://YOUR_DOMAIN.vercel.app/",
    "splashImageUrl": "https://YOUR_DOMAIN.vercel.app/splash.png",
    "splashBackgroundColor": "#8B5CF6",
    "subtitle": "Real-time Farcaster news",
    "description": "Stay updated with real-time news from multiple Farcaster channels. Bookmark articles to read later and discover trending content from Base, DeFi, Tech, Crypto, NFTs, and Degen communities.",
    "primaryCategory": "news-media",
    "tags": ["news", "farcaster", "miniapp", "realtime", "bookmarks", "base", "defi", "crypto"],
    "ogTitle": "Newscaster - Real-time Farcaster News",
    "ogDescription": "Real-time news from Farcaster channels with bookmarking and interest-based filtering",
    "buttonTitle": "📰 Open Newscaster"
  }
}
```

## What You Need to Do (3 Simple Steps):

### Step 1: Add Configuration File
- Copy either `vercel.json` OR `next.config.js` (depending on your project type) to your repository root
- Commit and push to GitHub
- Vercel will auto-deploy

### Step 2: Get Your Manifest ID
- Visit: https://farcaster.xyz/~/developers/mini-apps/manifest
- Enter your Vercel domain
- Fill out the form with these details:
  - Name: Newscaster
  - Description: Real-time news from Farcaster channels with bookmarking
  - Category: news-media
  - Tags: news, farcaster, miniapp, realtime
- Sign with your wallet (this is the only step I cannot do for you)
- Copy the manifest ID from the generated URL
- Replace `REPLACE_WITH_YOUR_MANIFEST_ID` in your config file

### Step 3: Test and Deploy
- Push your updated config file to GitHub
- Test: `curl -s https://YOUR_DOMAIN.vercel.app/.well-known/farcaster.json`
- Debug at: https://warpcast.com/~/developers/mini-apps/debug

## Images Needed:
Create and upload these to your `public` folder:
- `icon.png` (1024x1024px) - Your app icon
- `splash.png` (200x200px, optional) - Loading screen image

## Ready-to-Use Form Data:
When filling out the Farcaster manifest form, use these exact values:
- **Name**: Newscaster
- **Description**: Real-time news from Farcaster channels with bookmarking and interest-based filtering
- **Category**: news-media
- **Tags**: news, farcaster, miniapp, realtime, bookmarks
- **Button Text**: 📰 Open Newscaster

That's it! Your app will be discoverable across the Farcaster network.