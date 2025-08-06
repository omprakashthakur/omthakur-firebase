# How to Create YouTube Data API

This guide will walk you through creating and setting up YouTube Data API credentials for your vlog automation.

## Step 1: Create a Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click "Select a project" dropdown at the top
   - Click "New Project"
   - Enter a project name (e.g., "My Website YouTube API")
   - Click "Create"
   - Wait for the project to be created and select it

## Step 2: Enable YouTube Data API v3

1. **Navigate to APIs & Services**
   - In the left sidebar, click "APIs & Services" > "Library"

2. **Search for YouTube Data API**
   - In the search box, type "YouTube Data API v3"
   - Click on "YouTube Data API v3" from the results
   - Click the "Enable" button

## Step 3: Create API Credentials

1. **Go to Credentials**
   - In the left sidebar, click "APIs & Services" > "Credentials"

2. **Create API Key**
   - Click "Create Credentials" > "API Key"
   - Your API key will be generated and displayed
   - **Important**: Copy this key immediately and save it securely

3. **Restrict Your API Key (Recommended)**
   - Click on your newly created API key to edit it
   - Under "API restrictions":
     - Select "Restrict key"
     - Check "YouTube Data API v3"
   - Under "Application restrictions" (optional but recommended):
     - Select "HTTP referrers (web sites)"
     - Add your website domains (e.g., `localhost:8000`, `yourdomain.com`)
   - Click "Save"

## Step 4: Find Your YouTube Channel ID

### Method 1: From YouTube Studio (Easiest)
1. Go to https://studio.youtube.com/
2. Click "Settings" in the left sidebar
3. Click "Channel" > "Basic info"
4. Your Channel ID will be displayed

### Method 2: From Your Channel URL
1. Go to your YouTube channel
2. Look at the URL:
   - If it's `https://youtube.com/channel/UC...` - copy the part after `/channel/`
   - If it's `https://youtube.com/@username` - you'll need to use Method 3

### Method 3: Using Online Tool
1. Go to https://commentpicker.com/youtube-channel-id.php
2. Enter your channel URL or username
3. Click "Find Channel ID"

## Step 5: Test Your API Key

You can test your API key using this URL in your browser:
```
https://www.googleapis.com/youtube/v3/channels?part=snippet&id=YOUR_CHANNEL_ID&key=YOUR_API_KEY
```

Replace:
- `YOUR_CHANNEL_ID` with your actual channel ID
- `YOUR_API_KEY` with your actual API key

If it works, you'll see JSON data about your channel.

## Step 6: Set Up Environment Variables

Add these to your `.env` file:
```bash
YOUTUBE_API_KEY=your_actual_api_key_here
YOUTUBE_CHANNEL_ID=your_actual_channel_id_here
```

## Important Notes

### API Quotas
- YouTube Data API has daily quotas (default: 10,000 units/day)
- Each video fetch uses approximately 3-5 units
- Monitor your usage in Google Cloud Console

### Security Best Practices
1. **Never commit API keys to version control**
2. **Use environment variables** for API keys
3. **Restrict your API key** to specific APIs and domains
4. **Regenerate keys** if they're compromised

### Common Issues

**"API key not valid"**
- Make sure you copied the entire key
- Check if the key is restricted to the correct APIs
- Verify YouTube Data API v3 is enabled

**"Channel not found"**
- Double-check your channel ID format
- Make sure your channel has public videos
- Try using a different method to find your channel ID

**"Quota exceeded"**
- You've hit the daily API limit
- Wait until the next day or request a quota increase

## Next Steps

After setting up your API credentials:

1. **Run the setup script**:
   ```bash
   ./scripts/setup-youtube-api.sh
   ```

2. **Test the integration**:
   ```bash
   npm run dev
   curl "http://localhost:8000/api/youtube/videos?maxResults=1"
   ```

3. **Sync your videos**:
   ```bash
   npm run sync:youtube
   ```

## Need Help?

If you encounter issues:
1. Check the Google Cloud Console logs
2. Verify all credentials are correctly set
3. Test the API directly using the browser method above
4. Make sure your YouTube channel has public videos

The YouTube Data API documentation is available at:
https://developers.google.com/youtube/v3
