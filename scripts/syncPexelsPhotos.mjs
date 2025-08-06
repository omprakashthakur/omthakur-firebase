// scripts/syncPexelsPhotos.mjs
// This script can be run manually or scheduled to sync Pexels photos with your database

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name properly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Load environment variables from .env file
dotenv.config({ path: path.join(rootDir, '.env') });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use service role key if available, otherwise fall back to anon key
const supabaseKey = serviceRoleKey || supabaseAnonKey;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

// Log which key we're using (without showing the actual key)
console.log(`Using Supabase ${serviceRoleKey ? 'service role key' : 'anon key'} for database operations`);

const supabase = createClient(supabaseUrl, supabaseKey);

// Pexels API key
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

if (!PEXELS_API_KEY) {
  console.error('Missing PEXELS_API_KEY in environment variables');
  process.exit(1);
}

// Your Pexels username (if known)
const PEXELS_USERNAME = 'Om Prakash Thakur'; // Replace with your actual username

async function fetchPexelsPhotos(perPage = 30, page = 1) {
  try {
    console.log('Fetching photos from Om Prakash Thakur on Pexels...');
    
    // First try to search for photos specifically by Om Prakash Thakur
    let response = await fetch(
      `https://api.pexels.com/v1/search?query=photographer:"${PEXELS_USERNAME}"&per_page=${perPage}&page=${page}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    let data = await response.json();
    
    // If no photos found by specific photographer, try a general search with your name
    if (!data.photos || data.photos.length === 0) {
      console.log('No photos found for specific photographer, trying general search...');
      response = await fetch(
        `https://api.pexels.com/v1/search?query=Om Prakash Thakur&per_page=${perPage}&page=${page}`,
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );
      
      if (response.ok) {
        data = await response.json();
      }
    }
    
    // If still no photos, use curated photos as fallback
    if (!data.photos || data.photos.length === 0) {
      console.log('No photos found with your name, using curated photos as placeholder...');
      response = await fetch(
        `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${page}`,
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );
      
      if (response.ok) {
        data = await response.json();
      }
    }

    console.log(`Retrieved ${data.photos?.length || 0} photos from Pexels API`);
    return data.photos || [];
  } catch (error) {
    console.error('Error fetching Pexels photos:', error);
    return [];
  }
}

function formatPexelsPhotos(photos) {
  console.log('Formatting photos for database...');
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
  if (!photos || photos.length === 0) {
    console.log('No photos to store');
    return false;
  }

  try {
    console.log(`Storing ${photos.length} photos in Supabase...`);
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
    process.exit(1);
  }
}

// Run the sync
syncPexelsPhotos();
