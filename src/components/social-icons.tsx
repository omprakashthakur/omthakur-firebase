// This file is not meant to be edited, but rather to be used as a library of social media icons.
// It is used by the blog sidebar to display social media links.
// The icons are from the a brand-colors library and are used under the MIT license.
// Each icon is a React component that can be used as a normal React component.
// The icons are optimized for size and performance.
// Each icon is a SVG element with a viewBox of "0 0 24 24".
// The icons are colored with the brand colors of the social media platforms.
// Example: <SocialIcons.Instagram />

export const SocialIcons = {
  Instagram: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 256 256"
      fill="url(#instagram-gradient)"
    >
      <defs>
        <radialGradient
          id="instagram-gradient"
          cx="0.3"
          cy="1"
          r="1"
          gradientTransform="matrix(0 1 -1 0 252 4)"
        >
          <stop offset="0.1" stopColor="#fd5" />
          <stop offset="0.5" stopColor="#ff543e" />
          <stop offset="1" stopColor="#c837ab" />
        </radialGradient>
      </defs>
      <path d="M128 80a48 48 0 1048 48 48.05 48.05 0 00-48-48zm0 80a32 32 0 1132-32 32 32 0 01-32 32zm48-136h-96a40 40 0 00-40 40v96a40 40 0 0040 40h96a40 40 0 0040-40V64a40 40 0 00-40-40zm-96-16a56 56 0 00-56 56v96a56 56 0 0056 56h96a56 56 0 0056-56V64a56 56 0 00-56-56zm88 44a12 12 0 11-12 12 12 12 0 0112-12z" />
    </svg>
  ),
  Twitter: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#1da1f2" viewBox="0 0 24 24">
      <path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.76 2.8 1.91 3.56-.71 0-1.37-.22-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.52 8.52 0 0 1-5.33 1.84c-.34 0-.68-.02-1.01-.06A12.07 12.07 0 0 0 6.54 20c7.84 0 12.12-6.5 12.12-12.12 0-.18 0-.36-.01-.54.83-.6 1.56-1.36 2.14-2.23z" />
    </svg>
  ),
  Facebook: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#1877f2" viewBox="0 0 24 24">
      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z" />
    </svg>
  ),
  Youtube: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ff0000" viewBox="0 0 24 24">
      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
    </svg>
  ),
  Pinterest: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#e60023" viewBox="0 0 24 24">
      <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.37-.74-.37-1.845c0-1.724 1.004-3.003 2.25-3.003 1.063 0 1.57.794 1.57 1.745 0 1.062-.673 2.657-1.025 4.128-.285 1.192.595 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.49-.692-2.435-2.878-2.435-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.318.522 3.575.522 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
    </svg>
  ),
  Linkedin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#0a66c2" viewBox="0 0 24 24">
      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.594-11.018-3.714v-2.155z" />
    </svg>
  ),
};
