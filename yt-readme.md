# YouTube Vlog Sync System Documentation

## 🎬 Overview

This documentation explains how to automatically sync videos from your YouTube channel to your website's vlog section. The system fetches videos from your YouTube channel and displays them on your vlog page at `https://omthakur.site/vlog`.

## 🎯 Features

- **Automatic Video Sync**: Fetch latest videos from your YouTube channel
- **Smart Duplicate Detection**: Only adds new videos, prevents duplicates
- **Category Auto-Detection**: Automatically categorizes videos (Tech Talks, Travel, Daily Life)
- **Thumbnail Integration**: Fetches and displays video thumbnails
- **Manual & Automated Sync**: Multiple ways to trigger synchronization
- **Admin Management**: Manage vlogs through admin dashboard

## 🔧 System Components

### 1. **YouTube Channel Integration**
- **API**: YouTube Data API v3
- **Channel ID**: Your YouTube channel identifier
- **Video Categories**: Tech Talks, Travel, Daily Life
- **Supported Platforms**: YouTube (extensible to other platforms)

### 2. **Database Storage**
- **Platform**: Supabase
- **Table**: `vlogs`
- **Schema**:
  ```sql
  CREATE TABLE vlogs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    platform VARCHAR(50) DEFAULT 'YouTube',
    category VARCHAR(100),
    thumbnail TEXT,
    url TEXT NOT NULL,
    youtube_video_id VARCHAR(50),
    duration VARCHAR(20),
    view_count INTEGER,
    tags TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```

### 3. **API Endpoints**
- **Sync API**: `/api/youtube/sync` - Syncs videos from YouTube
- **Videos API**: `/api/youtube/videos` - Returns formatted videos
- **Vlogs API**: `/api/vlogs` - CRUD operations for vlogs

## 🚀 How to Sync YouTube Videos

### Method 1: Manual Sync (Instant) ⚡

#### Option A: Using Shell Script
```bash
# Basic sync (10 latest videos)
./scripts/sync-youtube-videos.sh

# Sync specific number of videos
./scripts/sync-youtube-videos.sh -n 20

# Force sync (re-sync existing videos)
./scripts/sync-youtube-videos.sh -f

# Production sync
./scripts/sync-youtube-videos.sh -u https://omthakur.site
```

#### Option B: Using API Directly
```bash
# GET request - basic sync
curl "https://omthakur.site/api/youtube/sync?maxResults=10"

# POST request - advanced sync with parameters
curl -X POST "https://omthakur.site/api/youtube/sync" \
  -H "Content-Type: application/json" \
  -d '{
    "maxResults": 15,
    "forceSync": false,
    "category": "Tech Talks"
  }'
```

### Method 2: Programmatic Sync 🤖

#### Using Next.js API
```typescript
// Sync latest 20 videos
const response = await fetch('/api/youtube/sync?maxResults=20');
const result = await response.json();

console.log(`Synced ${result.syncedVideos} videos`);
```

#### Using Admin Dashboard
1. Go to `/admin/vlogs`
2. Click "Sync from YouTube"
3. Configure sync parameters
4. Monitor sync progress

### Method 3: Scheduled Sync ⏰

Create a GitHub Action for automated sync:

```yaml
# .github/workflows/sync-youtube-vlogs.yml
name: Sync YouTube Vlogs

on:
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM UTC
  workflow_dispatch:

jobs:
  sync-vlogs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Sync YouTube Videos
        run: |
          curl -X POST "${{ secrets.APP_URL }}/api/youtube/sync" \
            -H "Content-Type: application/json" \
            -d '{"maxResults": 10}'
```

## 📁 File Structure

```
├── scripts/
│   └── sync-youtube-videos.sh        # Manual sync script
├── src/app/api/
│   ├── youtube/
│   │   ├── sync/route.ts             # YouTube sync API endpoint
│   │   └── videos/route.ts           # Video fetching API
│   └── vlogs/
│       ├── route.ts                  # Main vlogs API
│       ├── [id]/route.ts             # Individual vlog operations
│       └── migrate/route.ts          # Database migration
├── src/lib/
│   ├── youtubeClient.ts              # YouTube API integration
│   └── youtubeThumbnails.ts          # Thumbnail processing
├── src/app/
│   ├── vlog/page.tsx                 # Public vlog page
│   └── admin/vlogs/                  # Admin management pages
└── docs/
    ├── youtube-api-setup.md          # API setup guide
    └── youtube-integration.md        # Integration details
```

## 🔑 Environment Variables

Required environment variables for YouTube sync:

```bash
# YouTube API Configuration
YOUTUBE_API_KEY=your_youtube_data_api_key
YOUTUBE_CHANNEL_ID=your_youtube_channel_id

# Database Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: App Configuration
APP_URL=https://omthakur.site
```

### Setting up Environment Variables

#### 1. Get YouTube API Credentials
Follow the detailed guide in `docs/youtube-api-setup.md`:

1. **Create Google Cloud Project**
   - Go to https://console.cloud.google.com/
   - Create new project
   - Enable YouTube Data API v3

2. **Create API Key**
   - Go to APIs & Services → Credentials
   - Create API Key
   - Restrict to YouTube Data API v3

3. **Get Channel ID**
   ```bash
   # Method 1: From YouTube Studio
   # Go to YouTube Studio → Settings → Channel → Basic info
   
   # Method 2: From any video URL
   # https://www.youtube.com/watch?v=VIDEO_ID
   # Use Channel ID finder online tool
   ```

#### 2. Configure Local Environment (.env.local)
```bash
echo "YOUTUBE_API_KEY=your_api_key_here" >> .env.local
echo "YOUTUBE_CHANNEL_ID=UC1234567890abcdef" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key" >> .env.local
```

#### 3. Configure Production Environment
**GitHub Secrets** (for Actions):
1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Add secrets:
   - `YOUTUBE_API_KEY`
   - `YOUTUBE_CHANNEL_ID`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `APP_URL`

**Vercel Environment Variables**:
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add the same variables as above

## 📊 Current System Status

### Database Schema
Current vlogs table structure:
```sql
vlogs (
  id: integer,
  title: text,
  description: text,
  platform: varchar(50) DEFAULT 'YouTube',
  category: varchar(100),
  thumbnail: text,
  url: text,
  youtube_video_id: varchar(50),
  duration: varchar(20),
  view_count: integer,
  tags: text,
  created_at: timestamp
)
```

### Video Categories
- **Tech Talks**: Technology-related content
- **Travel**: Travel vlogs and experiences  
- **Daily Life**: Personal and lifestyle content

### API Response Format
```json
{
  "success": true,
  "message": "Successfully synced 3 new videos",
  "syncedVideos": 3,
  "totalFetched": 10,
  "videos": [
    {
      "id": 1,
      "title": "My Latest Tech Review",
      "category": "Tech Talks",
      "url": "https://www.youtube.com/watch?v=abc123",
      "thumbnail": "https://img.youtube.com/vi/abc123/maxresdefault.jpg",
      "created_at": "2025-08-07T12:00:00Z"
    }
  ]
}
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. API Key Problems
```bash
# Check if API key is configured
grep YOUTUBE_API_KEY .env.local

# Test API key validity
curl "https://www.googleapis.com/youtube/v3/channels?part=snippet&id=YOUR_CHANNEL_ID&key=YOUR_API_KEY"
```

#### 2. Channel ID Issues
```bash
# Verify channel ID format (should start with UC)
echo $YOUTUBE_CHANNEL_ID | grep "^UC"

# Test channel exists
curl "https://www.googleapis.com/youtube/v3/channels?part=snippet&id=$YOUTUBE_CHANNEL_ID&key=$YOUTUBE_API_KEY"
```

#### 3. No New Videos Found
- Check if channel has new videos since last sync
- Verify `publishedAfter` parameter if using date filtering
- Use `forceSync=true` to re-sync existing videos

#### 4. Database Connection Issues
```bash
# Test Supabase connection
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
supabase.from('vlogs').select('count').then(console.log);
"
```

### Debug Commands

```bash
# Test local sync with verbose output
./scripts/sync-youtube-videos.sh -n 5 -u http://localhost:3000

# Check API endpoints
curl "https://omthakur.site/api/youtube/sync?maxResults=1"
curl "https://omthakur.site/api/vlogs"

# Verify database state
curl "https://omthakur.site/api/vlogs" | jq 'length'

# Test YouTube API directly
curl "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=$YOUTUBE_CHANNEL_ID&type=video&order=date&maxResults=5&key=$YOUTUBE_API_KEY"
```

## 🎨 Customization

### Adding Custom Categories
Modify `src/lib/youtubeClient.ts`:

```typescript
export function categorizeYouTubeVideo(video: YouTubeVideo): string {
  const title = video.title.toLowerCase();
  const description = video.description.toLowerCase();
  
  if (title.includes('coding') || title.includes('programming')) {
    return 'Programming';
  }
  if (title.includes('travel') || title.includes('trip')) {
    return 'Travel';
  }
  if (title.includes('review') || title.includes('tech')) {
    return 'Tech Talks';
  }
  // Add your custom categories here
  return 'Daily Life';
}
```

### Custom Sync Intervals
Create automated sync with cron:

```bash
# Add to crontab (runs every 6 hours)
0 */6 * * * cd /path/to/project && ./scripts/sync-youtube-videos.sh -u https://omthakur.site
```

### Filtering Videos
Add video filtering logic in `src/app/api/youtube/sync/route.ts`:

```typescript
// Filter out shorts (videos under 60 seconds)
const filteredVideos = youtubeVideos.filter(video => {
  const duration = parseDuration(video.duration);
  return duration > 60; // seconds
});
```

## 📈 Performance & Limits

### YouTube API Quotas
- **Free Tier**: 10,000 quota units per day
- **Typical Usage**: ~100 units per sync (10 videos)
- **Recommended**: Sync 2-3 times per day maximum

### Rate Limiting
- **API Calls**: Respect YouTube's rate limits
- **Batch Size**: Default 10 videos per sync (adjustable)
- **Frequency**: Daily sync recommended

### Optimization Tips
- Use `publishedAfter` parameter to sync only recent videos
- Set appropriate `maxResults` based on upload frequency
- Enable database indexing for faster queries

## 🔒 Security

### API Key Security
- Store API keys in environment variables only
- Never commit API keys to code repository
- Use different API keys for development and production
- Monitor API key usage in Google Cloud Console

### Database Security
- Use Supabase Row Level Security (RLS)
- Limit API access to vlogs table only
- Regular backup of vlog data

## 📞 Support

### Troubleshooting Steps
1. Check environment variables configuration
2. Verify YouTube API credentials and quotas
3. Test database connection
4. Review API endpoint responses
5. Check YouTube channel accessibility

### Useful Resources
- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Supabase Documentation](https://supabase.com/docs)

---

**Last Updated**: August 7, 2025  
**System Status**: ✅ Operational  
**API Integration**: YouTube Data API v3  
**Sync Method**: Automated + Manual  

## Quick Start Checklist

- [ ] Set up YouTube Data API key ([Guide](docs/youtube-api-setup.md))
- [ ] Configure environment variables
- [ ] Get your YouTube Channel ID
- [ ] Run first sync: `./scripts/sync-youtube-videos.sh`
- [ ] Check vlogs at `https://omthakur.site/vlog`
- [ ] Set up automated sync (optional)
- [ ] ✅ Done! Videos automatically sync to your website

## Sync Commands Reference

```bash
# Basic sync (10 videos)
./scripts/sync-youtube-videos.sh

# Sync 20 videos
./scripts/sync-youtube-videos.sh -n 20

# Force re-sync existing videos
./scripts/sync-youtube-videos.sh -f

# Production sync
./scripts/sync-youtube-videos.sh -u https://omthakur.site

# Help
./scripts/sync-youtube-videos.sh -h
```
