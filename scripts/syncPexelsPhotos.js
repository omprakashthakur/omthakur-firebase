// scripts/syncPexelsPhotos.js
// This script can be run manually or scheduled to sync Pexels photos with your database

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Pexels API key
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

// Your Pexels username (if known)
const PEXELS_USERNAME = 'YOUR_PEXELS_USERNAME'; // Replace with your actual username

async function fetchPexelsPhotos(perPage = 30, page = 1) {
  try {
    // Using curated photos API - replace with collections or specific queries as needed
    const response = await fetch(
      `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${page}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch from Pexels API: ${response.status}`);
    }

    const data = await response.json();
    return data.photos;
  } catch (error) {
    console.error('Error fetching Pexels photos:', error);
    return [];
  }
}

function formatPexelsPhotos(photos) {
  return photos.map(photo => ({
    id: `pexels-${photo.id}`,
    title: photo.alt || `Photo by ${photo.photographer}`,
    description: `Photo by ${photo.photographer} on Pexels`,
    src: photo.src.large,
    alt: photo.alt || photo.photographer,
    category: 'pexels',
    tags: ['pexels', 'photography'],
    photographer_name: photo.photographer,
    photographer_url: photo.photographer_url,
    width: photo.width,
    height: photo.height,
    original_url: photo.url,
    created_at: new Date().toISOString()
  }));
}

async function storePexelsPhotos(photos) {
  try {
    const { data, error } = await supabase
      .from('pexels_photos')
      .upsert(photos, { onConflict: 'id' });

    if (error) {
      throw error;
    }

    console.log(`Successfully synced ${photos.length} Pexels photos`);
    return true;
  } catch (error) {
    console.error('Error storing photos in Supabase:', error);
    return false;
  }
}

async function syncPexelsPhotos() {
  try {
    console.log('Starting Pexels photos sync...');
    const photos = await fetchPexelsPhotos(30, 1);
    
    if (photos.length > 0) {
      const formattedPhotos = formatPexelsPhotos(photos);
      await storePexelsPhotos(formattedPhotos);
      console.log('Sync complete!');
    } else {
      console.log('No photos found to sync.');
    }
  } catch (error) {
    console.error('Error during sync process:', error);
  }
}

// Run the sync
syncPexelsPhotos();
