#!/bin/bash

# Script to add specific Pexels photos by Om Prakash Thakur
# You can add your specific Pexels photo IDs here

echo "Adding your specific Pexels photos to the database..."

# Add your actual Pexels photo IDs here
# You can find these from your Pexels profile: https://www.pexels.com/@om-prakash-thakur-2154104473/

PHOTO_IDS=(
    # Add your actual photo IDs here, for example:
    # "12345678"
    # "87654321"
    # For now, we'll use some sample IDs - replace with your actual ones
)

# Supabase configuration
SUPABASE_URL="https://xwacjujhpdnpytjmbcyh.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3YWNqdWpocGRucHl0am1iY3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNzQyOTQsImV4cCI6MjA2OTk1MDI5NH0.xFPhGSPxNFvs5CbTrmGFz2Klc9hsWeslndzYJuQaTVY"
PEXELS_API_KEY="X4w8lmm2YSiidusOb6j6VTzG5dlj3OxqgxAeTrD02Pj9MyXzR5kCPVeT"

if [ ${#PHOTO_IDS[@]} -eq 0 ]; then
    echo "No photo IDs specified. Please edit this script and add your Pexels photo IDs."
    echo "You can find your photo IDs from your Pexels profile URL."
    echo "Example: https://www.pexels.com/photo/your-photo-title-12345678/ -> ID is 12345678"
    exit 1
fi

for PHOTO_ID in "${PHOTO_IDS[@]}"; do
    echo "Processing photo ID: $PHOTO_ID"
    
    # Fetch photo details from Pexels API
    PHOTO_DATA=$(curl -s -X GET "https://api.pexels.com/v1/photos/$PHOTO_ID" \
        -H "Authorization: $PEXELS_API_KEY")
    
    if [ $? -eq 0 ]; then
        # Extract photo information using jq
        PHOTOGRAPHER=$(echo "$PHOTO_DATA" | jq -r '.photographer // "Unknown"')
        
        # Only add if it's actually your photo
        if [[ "$PHOTOGRAPHER" == *"Om"* ]] && [[ "$PHOTOGRAPHER" == *"Prakash"* || "$PHOTOGRAPHER" == *"Thakur"* ]]; then
            TITLE=$(echo "$PHOTO_DATA" | jq -r '.alt // "Photo by Om Prakash Thakur"')
            SRC=$(echo "$PHOTO_DATA" | jq -r '.src.large2x // .src.large') # Higher resolution for display
            ALT=$(echo "$PHOTO_DATA" | jq -r '.alt // .photographer')
            DOWNLOAD_URL=$(echo "$PHOTO_DATA" | jq -r '.src.original') # Highest resolution for download
            WIDTH=$(echo "$PHOTO_DATA" | jq -r '.width')
            HEIGHT=$(echo "$PHOTO_DATA" | jq -r '.height')
            PEXELS_URL=$(echo "$PHOTO_DATA" | jq -r '.url')
            
            # Add to Supabase
            curl -X POST "$SUPABASE_URL/rest/v1/photography" \
                -H "apikey: $SUPABASE_KEY" \
                -H "Authorization: Bearer $SUPABASE_KEY" \
                -H "Content-Type: application/json" \
                -H "Prefer: return=representation" \
                -d "{
                    \"id\": \"pexels-$PHOTO_ID\",
                    \"title\": \"$TITLE\",
                    \"src\": \"$SRC\",
                    \"alt\": \"$ALT\",
                    \"downloadUrl\": \"$DOWNLOAD_URL\",
                    \"category\": \"pexels-om\",
                    \"tags\": [\"pexels\", \"om-prakash-thakur\", \"photography\"],
                    \"photographer_name\": \"$PHOTOGRAPHER\",
                    \"photographer_url\": \"https://www.pexels.com/@om-prakash-thakur-2154104473/\",
                    \"original_url\": \"$PEXELS_URL\",
                    \"width\": $WIDTH,
                    \"height\": $HEIGHT
                }"
            echo ""
            echo "Added photo: $TITLE"
        else
            echo "Skipping photo $PHOTO_ID - not by Om Prakash Thakur (photographer: $PHOTOGRAPHER)"
        fi
    else
        echo "Failed to fetch photo $PHOTO_ID from Pexels API"
    fi
    
    # Small delay to avoid rate limiting
    sleep 1
done

echo "Done! Your Pexels photos have been added to the database."
