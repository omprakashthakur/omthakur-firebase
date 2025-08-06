# Photo Sync System Documentation

## 📸 Overview

This documentation explains how to sync photos from your Pexels collection to your website automatically. The system fetches photos from your personal Pexels collection and displays them on your photography page at `https://omthakur.site/photography`.

## 🎯 Features

- **Automatic Daily Sync**: Photos sync automatically every day at 12:00 UTC
- **Manual Sync**: Trigger sync manually when you upload new photos
- **Smart Duplicate Detection**: Only adds new photos, prevents duplicates
- **Database Fallback**: Website works even if Pexels API is unavailable
- **Real Photo Display**: Shows your actual professional photos instead of placeholder content

## 🔧 System Components

### 1. **Pexels Collection**
- **Collection ID**: `ofymzs7` (Om Prakash Thakur's collection)
- **Photos**: Professional photography by Om Prakash Thakur
- **Current Count**: 3 photos (as of last sync)

### 2. **Database Storage**
- **Platform**: Supabase
- **Table**: `photography`
- **Schema**:
  ```sql
  CREATE TABLE photography (
    id SERIAL PRIMARY KEY,
    src TEXT NOT NULL,
    alt TEXT,
    downloadurl TEXT,
    downloadUrl TEXT
  );
  ```

### 3. **API Endpoints**
- **Photography API**: `/api/photography` - Returns formatted photos for the website
- **Sync API**: `/api/sync-pexels` - Triggers manual sync from Pexels collection

## 🚀 How to Sync New Photos

### Method 1: Manual Sync (Instant) ⚡

When you upload new photos to your Pexels collection:

```bash
# Option A: Using Node.js script
node scripts/sync-pexels-to-db.js

# Option B: Using shell script
./scripts/sync-photos.sh

# Option C: Using API endpoint
curl -X POST "https://omthakur.site/api/sync-pexels"
```

### Method 2: GitHub Actions (Automated) 🤖

#### Daily Automatic Sync
- **Schedule**: Every day at 12:00 UTC
- **File**: `.github/workflows/sync-pexels-photos.yml`
- **Status**: Check at `https://github.com/omprakashthakur/omthakur-firebase/actions`

#### Manual GitHub Action Trigger
1. Go to GitHub repository
2. Click **Actions** tab
3. Select **"Sync Pexels Photos"** workflow
4. Click **"Run workflow"**
5. Optionally check "Force sync all photos"

### Method 3: API Integration 🌐

```bash
# Test the sync API
curl -X POST "https://omthakur.site/api/sync-pexels" \
  -H "Content-Type: application/json"

# Check current photos
curl -s "https://omthakur.site/api/photography" | jq 'length'
```

## 📁 File Structure

```
├── scripts/
│   ├── sync-pexels-to-db.js      # Main sync script
│   └── sync-photos.sh            # Shell wrapper script
├── src/app/api/
│   ├── photography/route.ts      # Photography API endpoint
│   └── sync-pexels/route.ts      # Sync API endpoint
├── src/lib/
│   ├── pexelsClient.ts           # Pexels API integration
│   └── supabaseClient.ts         # Database client
└── .github/workflows/
    └── sync-pexels-photos.yml    # Automated sync workflow
```

## 🔑 Environment Variables

Required environment variables for the sync system:

```bash
# Pexels API
PEXELS_API_KEY=your_pexels_api_key

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Sync API security
SYNC_TOKEN=your_sync_security_token
```

### Setting up Environment Variables

#### Local Development (.env.local)
```bash
echo "PEXELS_API_KEY=your_api_key" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_URL=your_url" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key" >> .env.local
```

#### GitHub Secrets (for Actions)
1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:
   - `PEXELS_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📊 Current Status

### Photos in Database
- **Mr. Om Thakur** (Pexels ID: 33059766)
- **Om Thakur** (Pexels ID: 33059731)
- **With IOE Students** (Pexels ID: 33337381)
- **testttt** (test photo - can be removed)

### API Response Format
```json
[
  {
    "id": "db-15",
    "title": "With IOE Students",
    "description": "Professional photography by Om Prakash Thakur",
    "src": "https://images.pexels.com/photos/33337381/...",
    "alt": "With IOE Students",
    "category": "personal",
    "tags": ["photography", "om-prakash-thakur"],
    "photographerName": "Om Prakash Thakur",
    "photographerUrl": "https://omthakur.site",
    "width": 800,
    "height": 600,
    "originalUrl": "https://images.pexels.com/photos/33337381/...",
    "downloadUrl": "https://images.pexels.com/photos/33337381/...",
    "created_at": "2025-08-07T...",
    "blurDataURL": "data:image/png;base64,iVBORw0KGg...",
    "placeholder": "blur"
  }
]
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. No New Photos Detected
```bash
# Check if photos exist in Pexels collection
curl -H "Authorization: YOUR_PEXELS_API_KEY" \
  "https://api.pexels.com/v1/collections/ofymzs7"

# Check database current state
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
supabase.from('photography').select('*').then(({data}) => console.log(data));
"
```

#### 2. API Key Issues
- Verify `PEXELS_API_KEY` is set correctly
- Check API key permissions at https://www.pexels.com/api/
- Ensure key has access to collections

#### 3. Database Connection Issues
- Verify Supabase URL and keys
- Check database table exists
- Verify table permissions

### Debug Commands

```bash
# Test local sync
npm run sync-photos  # if you add this script to package.json

# Check API status
curl "https://omthakur.site/api/sync-pexels"

# Verify database connection
node scripts/sync-pexels-to-db.js

# Check GitHub Actions logs
# Go to: https://github.com/omprakashthakur/omthakur-firebase/actions
```

## 🎨 Customization

### Adding More Collections
To sync from additional Pexels collections, modify `scripts/sync-pexels-to-db.js`:

```javascript
const COLLECTIONS = ['ofymzs7', 'another-collection-id'];
```

### Changing Sync Schedule
Modify `.github/workflows/sync-pexels-photos.yml`:

```yaml
schedule:
  - cron: '0 6 * * *'  # 6:00 AM UTC instead of 12:00 PM
```

### Custom Photo Processing
Modify the `formatPhotoForDB` function in `scripts/sync-pexels-to-db.js` to customize how photos are processed.

## 📈 Performance

- **Sync Speed**: ~2-3 seconds per photo
- **Duplicate Detection**: O(1) lookup by src URL
- **Database Impact**: Minimal, only new photos inserted
- **API Rate Limits**: Respects Pexels API limits (200 requests/hour)

## 🔒 Security

- Environment variables stored securely in GitHub Secrets
- API endpoints can be protected with `SYNC_TOKEN`
- Database access limited to photography table only
- No sensitive data in logs

## 📞 Support

For issues or questions:
1. Check GitHub Actions logs
2. Review this documentation
3. Test individual components using debug commands
4. Check environment variable configuration

---

**Last Updated**: August 7, 2025  
**System Status**: ✅ Operational  
**Latest Sync**: Successfully synced "With IOE Students" photo  
**Next Scheduled Sync**: Daily at 12:00 UTC  

## Quick Start Checklist

- [ ] Upload photo to Pexels collection `ofymzs7`
- [ ] Run `./scripts/sync-photos.sh` 
- [ ] Check `https://omthakur.site/photography`
- [ ] Verify new photo appears on website
- [ ] ✅ Done! Photo is now live on your website
