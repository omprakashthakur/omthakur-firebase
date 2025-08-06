# How to Get Your Pexels Photo IDs

To add your actual photos from your Pexels account, you need to get the photo IDs from your profile:

## Step 1: Visit Your Pexels Profile
Go to: https://www.pexels.com/@om-prakash-thakur-2154104473/

## Step 2: Get Photo IDs
For each photo you want to add:

1. Click on a photo in your profile
2. Look at the URL in your browser
3. The photo ID is the number at the end of the URL

**Example:**
- Photo URL: `https://www.pexels.com/photo/beautiful-sunset-landscape-12345678/`
- Photo ID: `12345678`

## Step 3: Add IDs to Script
Edit the file: `scripts/add-om-pexels-photos.sh`

Find this section:
```bash
PHOTO_IDS=(
    # Add your actual photo IDs here, for example:
    # "12345678"
    # "87654321"
    # For now, we'll use some sample IDs - replace with your actual ones
)
```

Replace it with your actual photo IDs:
```bash
PHOTO_IDS=(
    "12345678"
    "87654321"
    "11223344"
    # Add more IDs as needed
)
```

## Step 4: Run the Script
```bash
cd /home/om/Documents/omthakur-firebase
./scripts/add-om-pexels-photos.sh
```

## Step 5: Verify Photos Added
Check your photography page: http://localhost:8000/photography

---

## Alternative: Manual Addition

If you can't find many photos on your Pexels account, you can also:

1. Upload your own photos through the admin interface
2. Add photos manually to the database
3. Use the placeholder photos (already implemented)

The photography page now includes:
✅ Next/Previous navigation in modal
✅ Higher resolution images  
✅ Keyboard navigation (arrow keys, ESC)
✅ Photo counter
✅ Download functionality
✅ Responsive design
