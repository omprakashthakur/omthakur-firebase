# YouTube Integration for Vlogs

This document explains how to set up automatic YouTube video synchronization for your vlog section.

## Features

✅ **Automatic Video Sync**: Fetch your latest YouTube videos automatically  
✅ **Smart Categorization**: AI-powered video categorization based on title and description  
✅ **No Duplicates**: Prevents syncing videos that already exist  
✅ **Rich Metadata**: Includes duration, view count, thumbnails, and descriptions  
✅ **Manual Control**: Test connections and force sync when needed  
✅ **Admin Dashboard**: Full control through the admin interface  

## Setup Instructions

### 1. Get YouTube Data API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**:
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key
5. Restrict the API key (recommended):
   - Edit your API key
   - Under "API restrictions", select "Restrict key"
   - Choose "YouTube Data API v3"

### 2. Get Your YouTube Channel ID

**Method 1: From YouTube Studio**
1. Go to [YouTube Studio](https://studio.youtube.com/)
2. In the left sidebar, click "Settings" > "Channel" > "Basic info"
3. Copy your Channel ID

**Method 2: From Channel URL**
1. Go to your YouTube channel
2. The URL will be like: `https://www.youtube.com/channel/YOUR_CHANNEL_ID`
3. Copy the part after `/channel/`

**Method 3: Using Online Tool**
- Use [this tool](https://commentpicker.com/youtube-channel-id.php) to find your channel ID

### 3. Configure Environment Variables

Run the setup script:
```bash
./scripts/setup-youtube-api.sh
```

Or manually add to your `.env` file:
```bash
# YouTube Data API Configuration
YOUTUBE_API_KEY=your_youtube_api_key_here
YOUTUBE_CHANNEL_ID=your_youtube_channel_id_here
```

### 4. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the API connection:
   ```bash
   curl "http://localhost:8000/api/youtube/videos?maxResults=1"
   ```

3. Or visit the admin dashboard:
   ```
   http://localhost:8000/admin/vlogs
   ```

## Usage

### Automatic Sync

The system automatically checks for new videos when:
- The vlogs page is loaded (once per day)
- The vlogs API is called with `autoSync=true` (default)

### Manual Sync

**Via Admin Dashboard:**
1. Go to `/admin/vlogs`
2. Configure sync settings (max results, force sync)
3. Click "Sync YouTube Videos"

**Via Script:**
```bash
# Sync 10 latest videos
./scripts/sync-youtube-videos.sh

# Sync 25 videos
./scripts/sync-youtube-videos.sh -n 25

# Force sync (re-sync existing videos)
./scripts/sync-youtube-videos.sh -f

# Custom base URL
./scripts/sync-youtube-videos.sh -u https://yourdomain.com
```

**Via API:**
```bash
# Basic sync
curl "http://localhost:8000/api/youtube/sync"

# With parameters
curl "http://localhost:8000/api/youtube/sync?maxResults=20&forceSync=true"
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/youtube/videos` | GET | Fetch videos from YouTube (testing) |
| `/api/youtube/sync` | GET | Sync videos to database |
| `/api/youtube/sync` | POST | Manual sync with custom parameters |
| `/api/vlogs` | GET | Get all vlogs (includes auto-sync) |

### Query Parameters

**For `/api/youtube/sync`:**
- `maxResults` (number): Max videos to fetch (1-50, default: 10)
- `publishedAfter` (ISO date): Only fetch videos published after this date
- `forceSync` (boolean): Re-sync existing videos

**For `/api/vlogs`:**
- `autoSync` (boolean): Enable/disable auto-sync (default: true)
- `order` (string): Sort order for results

## Video Categorization

Videos are automatically categorized based on keywords in title and description:

| Category | Keywords |
|----------|----------|
| **Tech** | tech, technology, coding, programming, software, development, tutorial, review |
| **Travel** | travel, trip, vacation, journey, explore, adventure, destination, tourism |
| **Food** | food, cooking, recipe, restaurant, eating, cuisine, chef, kitchen |
| **Lifestyle** | lifestyle, daily, routine, life, personal, vlog, day in the life |
| **Education** | education, learn, tutorial, how to, guide, tips, advice, explain |
| **Entertainment** | entertainment, fun, funny, comedy, music, movie, game, review |

Default category: **Lifestyle**

## Database Schema

The vlogs table includes these YouTube-specific fields:

```sql
CREATE TABLE vlogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(255),
    platform ENUM('YouTube', 'Instagram', 'TikTok') NOT NULL,
    url VARCHAR(255) NOT NULL,
    category ENUM('Travel', 'Tech', 'Food', 'Lifestyle', 'Education', 'Entertainment') NOT NULL,
    
    -- YouTube-specific fields
    youtube_video_id VARCHAR(50),
    duration VARCHAR(20), -- ISO 8601 format (PT4M13S)
    view_count INT,
    tags TEXT, -- Comma-separated
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Troubleshooting

### Common Issues

**1. "YouTube API credentials not configured"**
- Make sure `YOUTUBE_API_KEY` and `YOUTUBE_CHANNEL_ID` are set in `.env`
- Restart your development server after adding credentials

**2. "Failed to fetch YouTube videos"**
- Check if your API key is valid and not quota exceeded
- Verify your channel ID is correct
- Make sure YouTube Data API v3 is enabled in Google Cloud Console

**3. "No videos found"**
- Check if your channel has public videos
- Verify the channel ID format (should be like `UC...` or `UU...`)
- Try using `publishedAfter` parameter to fetch recent videos

**4. API Quota Exceeded**
- YouTube Data API has daily quotas (default: 10,000 units/day)
- Each video fetch uses ~3-5 units
- Monitor usage in Google Cloud Console

### Debug Mode

Enable detailed logging by setting:
```bash
DEBUG=true
```

### Manual Testing

Test individual components:

```bash
# Test YouTube API directly
curl "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=YOUR_CHANNEL_ID&key=YOUR_API_KEY"

# Test your app's YouTube integration
curl "http://localhost:8000/api/youtube/videos?maxResults=1"

# Test sync endpoint
curl "http://localhost:8000/api/youtube/sync?maxResults=5"
```

## Best Practices

1. **Set reasonable sync limits**: Don't sync all videos at once, use `maxResults` wisely
2. **Use publishedAfter**: Only sync recent videos to save API quota
3. **Monitor quotas**: Keep track of your YouTube API usage in Google Cloud Console
4. **Regular syncing**: Set up a cron job for automatic daily syncing
5. **Error handling**: Always check sync results and handle failures gracefully

## Automated Deployment

For production, consider:

1. **Environment Variables**: Set YouTube credentials in your hosting platform
2. **Cron Jobs**: Set up scheduled syncing (e.g., daily at 6 AM)
3. **Error Monitoring**: Track sync failures and API quota usage
4. **Backup Strategy**: Regular database backups before syncing

Example cron job:
```bash
# Sync YouTube videos daily at 6 AM
0 6 * * * /path/to/your/app/scripts/sync-youtube-videos.sh -n 10
```

## Support

If you encounter issues:

1. Check the console logs for detailed error messages
2. Verify all credentials are correctly set
3. Test the YouTube API directly using the Google API Explorer
4. Check your API quotas in Google Cloud Console

For additional help, refer to:
- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [Google Cloud Console](https://console.cloud.google.com/)
- [API Quotas and Limits](https://developers.google.com/youtube/v3/getting-started#quota)
