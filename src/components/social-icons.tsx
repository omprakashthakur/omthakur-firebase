// This file is not meant to be edited, but rather to be used as a library of social media icons.
// Each icon is a React component that can be used as a normal React component.
// The icons are optimized for size and performance.
// Each icon is a SVG element with a viewBox of "0 0 24 24".

import { SVGProps } from "react";

export const SocialIcons = {
  Instagram: (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
  ),
  Twitter: (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" {...props}>
      <path d="M22.46,6.52c-0.81,0.36-1.68,0.61-2.59,0.71c0.93-0.56,1.64-1.44,1.98-2.5c-0.87,0.51-1.84,0.89-2.88,1.1 C18.16,4.82,17.03,4.2,15.77,4.2c-2.5,0-4.52,2.03-4.52,4.52c0,0.35,0.04,0.7,0.12,1.03C7.88,9.54,4.9,7.9,2.83,5.53 c-0.34,0.58-0.54,1.26-0.54,1.99c0,1.57,0.8,2.95,2.01,3.76c-0.74-0.02-1.44-0.23-2.05-0.57v0.06c0,2.19,1.56,4.01,3.62,4.43 c-0.38,0.1-0.78,0.15-1.19,0.15c-0.29,0-0.57-0.03-0.85-0.08c0.57,1.79,2.24,3.1,4.22,3.13c-1.55,1.21-3.5,1.93-5.62,1.93 c-0.36,0-0.72-0.02-1.08-0.06C2.68,19.92,4.98,20.8,7.5,20.8c7.45,0,11.52-6.18,11.52-11.52c0-0.18,0-0.35-0.01-0.53 C19.96,8.23,21.36,7.46,22.46,6.52z"/>
    </svg>
  ),
  Facebook: (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
  ),
  Youtube: (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2.5 17a24.12 24.12 0 0 1 0-10C2.5 6 7.5 4 12 4s9.5 2 9.5 3-2.5 4-2.5 4.5 2.5 4.5 2.5 5c0 1-5 3-9.5 3s-9.5-2-9.5-3z"/><path d="m10 9 5 3-5 3z"/></svg>
  ),
  Pinterest: (props: SVGProps<SVGSVGElement>) => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" {...props}><path d="M12.6,2.19C6.2,2.19,2,7.34,2,12.45c0,4.2,2.7,7.21,6.5,7.21c0.8,0,1.4-0.1,1.4-1c0-.5-.3-0.8-.6-1.4 c-0.3-0.6-0.5-1.1-0.5-1.9c0-0.9,0.5-1.7,1.5-1.7c1.7,0,2.9,1.2,2.9,3.1c0,1.8-1.1,4.5-3.3,4.5c-1.8,0-3.2-1.5-3.2-3.4 c0-1.4,0.7-2.6,1.8-3.3c0.2-0.1,0.2-0.2,0.1-0.4c0-0.1-0.1-0.3-0.1-0.4c-0.1-0.2,0-0.3,0.1-0.3c0.3,0,1.3-0.6,1.3-2.3 c0-1.9-1.3-3.4-3.8-3.4c-2.9,0-4.9,2.2-4.9,4.9c0,1,0.3,1.6,0.8,2.1c0.1,0.1,0.1,0.2,0.1,0.3c-0.1,0.5-0.3,1.2-0.3,1.3 C5,13.85,5,13.95,5.1,14c0.1,0,0.6-0.2,0.8-0.4c1.1-0.9,1.4-2.5,1.4-3.3c0-1.7-1-3.1-3-3.1c-2.3,0-4,1.8-4,4.2c0,2.2,1.3,4,3,4 c0.5,0,0.8-0.2,0.8-0.5c0-0.3-0.2-0.5-0.3-0.7c-0.3-0.5-0.4-1-0.4-1.5c0-1.1,0.7-2.1,2.1-2.1c1.1,0,1.9,0.7,1.9,1.9 c0,1.4-0.6,3.3-1.6,3.3c-0.4,0-0.7-0.3-0.7-0.7c0-0.3,0.1-0.6,0.2-0.8c0.2-0.4,0.3-0.7,0.3-1.1c0-0.8-0.3-1.4-1.1-1.4 c-0.9,0-1.6,0.8-1.6,1.9c0,0.8,0.3,1.4,0.3,1.4s-0.8,3.2-1,3.8C6.1,19.69,5.2,21,5.2,22c0,0.1,0,0.1,0.1,0.1c0.1,0,0.2-0.1,0.3-0.1 c0.5-0.4,0.8-0.7,1.2-1.3c0.1-0.2,0.2-0.4,0.3-0.6c0.8,0.4,1.8,0.6,2.8,0.6c4.6,0,8.1-3.6,8.1-8.5C22,7.19,17.9,2.19,12.6,2.19z"/></svg>
  ),
  Linkedin: (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" {...props}><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
  ),
  TikTok: (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z"/><path d="M16.5 3h-9A4.5 4.5 0 0 0 3 7.5v9A4.5 4.5 0 0 0 7.5 21h9a4.5 4.5 0 0 0 4.5-4.5v-9A4.5 4.5 0 0 0 16.5 3z"/></svg>
  ),
  Github: (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg>
  ),
};
