#!/bin/bash

# scripts/sync-photos.sh
# Quick script to sync photos from Pexels collection

echo "🔄 Syncing photos from Pexels collection..."

# Option 1: Use the Node.js script (local development)
if [ "$1" == "local" ]; then
    echo "📝 Running local sync script..."
    node scripts/sync-pexels-to-db.js
    exit 0
fi

# Option 2: Use the API endpoint (production/deployed)
if [ "$1" == "api" ]; then
    echo "🌐 Using API endpoint..."
    if [ -z "$2" ]; then
        echo "Usage: ./scripts/sync-photos.sh api <your-domain>"
        echo "Example: ./scripts/sync-photos.sh api https://omthakur.site"
        exit 1
    fi
    
    curl -X POST "$2/api/sync-pexels" \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" | jq '.'
    exit 0
fi

# Default: Run local script
echo "📝 Running local sync script (default)..."
echo "💡 Use './scripts/sync-photos.sh api https://omthakur.site' for production sync"
node scripts/sync-pexels-to-db.js
