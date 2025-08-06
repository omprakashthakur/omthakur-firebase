## Creating Your YouTube API Key - Step by Step

You're currently in the right place! Follow these exact steps:

### Step 1: Create the API Key
1. Click the blue **"+ Create credentials"** button (top right in your screenshot)
2. Select **"API Key"** from the dropdown menu
3. Google will generate and display your API key
4. **IMPORTANT**: Copy this key immediately and save it somewhere safe

### Step 2: Restrict Your API Key (Security)
After creating the key, you'll see an option to restrict it:

1. Click **"Restrict Key"** (recommended for security)
2. Under **"API restrictions"**:
   - Select "Restrict key"
   - Check ✅ **"YouTube Data API v3"**
3. Under **"Application restrictions"** (optional):
   - Select "HTTP referrers (web sites)" 
   - Add: `localhost:8000` and `*.yourdomain.com`
4. Click **"Save"**

### Step 3: Find Your YouTube Channel ID
You'll also need your YouTube channel ID:

**Quick Method:**
1. Go to https://studio.youtube.com/
2. Click "Settings" → "Channel" → "Basic info"
3. Copy your Channel ID (starts with UC...)

**Alternative Method:**
- Go to your YouTube channel page
- Copy the URL - if it's `youtube.com/channel/UC123...`, copy the part after `/channel/`

### Step 4: Add to Your Project
Once you have both:
1. Your API Key
2. Your Channel ID

Add them to your `.env` file:
```bash
YOUTUBE_API_KEY=your_api_key_here
YOUTUBE_CHANNEL_ID=your_channel_id_here
```

### Step 5: Test It
Test your setup:
```bash
# In your project directory
npm run setup:youtube
```

Or manually test with:
```bash
curl "https://www.googleapis.com/youtube/v3/channels?part=snippet&id=YOUR_CHANNEL_ID&key=YOUR_API_KEY"
```

## What You Should See
After creating the API key, you should see it listed in the "API Keys" section with:
- Name of the key
- Creation date  
- Restrictions (if any)
- Actions (edit/delete buttons)

## Need Help?
If you have issues:
1. Make sure YouTube Data API v3 is enabled (✅ you already did this)
2. Check that your API key isn't restricted to the wrong domains
3. Verify your channel ID format is correct (UC...)

Let me know once you've created the API key and I'll help you test it!
