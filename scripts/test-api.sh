#!/bin/bash

# This script tests the API endpoints to verify they're working correctly
# Run this script while your development server is running

echo "===== API Endpoint Testing ====="
echo ""

BASE_URL="http://localhost:8000/api"
ENDPOINTS=(
  "vlogs"
  "vlogs/4"
  "posts"
  "posts/sample-blog-post-1754415054"
  "photography"
  "photography/4"
)

for endpoint in "${ENDPOINTS[@]}"; do
  echo "Testing $BASE_URL/$endpoint"
  
  # Use curl to make a GET request to the endpoint and capture both status and response body
  response=$(curl -s -w "\n%{http_code}" "$BASE_URL/$endpoint")
  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [[ $status_code -ge 200 && $status_code -lt 300 ]]; then
    echo "✅ Success: HTTP $status_code"
    echo "Response (first 5 lines):"
    echo "$body" | head -n 5
  elif [[ $status_code -eq 404 ]]; then
    echo "⚠️ Not Found: HTTP 404"
    echo "Response:"
    echo "$body"
  else
    echo "❌ Error: HTTP $status_code"
    echo "Response:"
    echo "$body"
  fi
  
  echo ""
done

echo "===== Frontend Page Testing ====="
echo ""

PAGES=(
  "/"
  "/blog"
  "/vlog"
  "/photography"
  "/contact"
  "/about"
  "/seo-optimizer"
)

for page in "${PAGES[@]}"; do
  echo "Testing http://localhost:8000$page"
  
  # Use curl to make a GET request to the page
  response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8000$page")
  
  if [[ $response -ge 200 && $response -lt 300 ]]; then
    echo "✅ Success: HTTP $response"
  elif [[ $response -eq 404 ]]; then
    echo "❌ Not Found: HTTP 404"
  else
    echo "❌ Error: HTTP $response"
  fi
  
  echo ""
done

echo "===== Test Complete ====="
