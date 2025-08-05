#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}This script will add sample data to your Supabase database${NC}"
echo -e "${YELLOW}Make sure your .env file has valid Supabase credentials${NC}"
echo ""

# Define the base URL
BASE_URL="http://localhost:8000/api"

# Add a sample vlog
echo -e "${YELLOW}Adding a sample vlog...${NC}"
curl -X POST "$BASE_URL/vlogs" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Vlog",
    "platform": "YouTube",
    "category": "Tech",
    "thumbnail": "https://via.placeholder.com/400x300?text=Sample+Vlog",
    "url": "https://youtube.com/watch?v=sample"
  }'
echo ""

# Add a sample blog post
echo -e "${YELLOW}Adding a sample blog post...${NC}"
curl -X POST "$BASE_URL/posts" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Blog Post",
    "slug": "sample-blog-post-'$(date +%s)'",
    "excerpt": "This is a sample blog post excerpt for testing purposes.",
    "content": "# Sample Blog Post\n\nThis is a sample blog post created for testing purposes.\n\n## Introduction\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\n\n## Conclusion\n\nThank you for reading!",
    "image": "https://via.placeholder.com/800x400?text=Sample+Blog+Post",
    "category": "Tech",
    "tags": ["JavaScript", "React"],
    "author": "Test User",
    "date": "2023-01-01T00:00:00.000Z"
  }'
echo ""

# Add a sample photo
echo -e "${YELLOW}Adding a sample photo...${NC}"
curl -X POST "$BASE_URL/photography" \
  -H "Content-Type: application/json" \
  -d '{
    "src": "https://via.placeholder.com/800x600?text=Sample+Photo",
    "alt": "A beautiful sample photograph",
    "downloadUrl": "https://via.placeholder.com/800x600?text=Sample+Photo"
  }'
echo ""

echo -e "${GREEN}Done! Sample data has been added to your database.${NC}"
echo -e "${YELLOW}You can now test the dynamic routes with the new data.${NC}"
