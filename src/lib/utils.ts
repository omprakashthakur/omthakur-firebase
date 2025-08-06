import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a data URL for a simple colored placeholder image with text
 * @param width Image width
 * @param height Image height
 * @param text Text to display in the center of the image
 * @param bgColor Background color in hex format
 * @param textColor Text color in hex format
 * @returns A data URL string for the generated SVG image
 */
export function generatePlaceholderImage(
  width = 800, 
  height = 600, 
  text = 'Image Unavailable', 
  bgColor = '#2A2A2A', 
  textColor = '#CCCCCC'
): string {
  // Create an SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="sans-serif" 
        font-size="${Math.min(width, height) / 20}px" 
        fill="${textColor}" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >
        ${text}
      </text>
    </svg>
  `;
  
  // Convert SVG to a data URL
  const encoded = encodeURIComponent(svg.trim());
  return `data:image/svg+xml;charset=UTF-8,${encoded}`;
}
