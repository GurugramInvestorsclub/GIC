// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // your existing content paths
  ],
  safelist: [
    // Force include responsive prose classes for dangerouslySetInnerHTML
    'prose',
    'prose-lg',
    'prose-xl',
    'max-w-none',
    
    // Mobile prose classes
    'prose-p:text-base',
    'prose-p:leading-relaxed',
    'prose-p:mb-4',
    'prose-h1:text-2xl',
    'prose-h1:mb-4',
    'prose-h2:text-xl',
    'prose-h2:mb-3',
    'prose-h3:text-lg',
    'prose-h3:mb-3',
    'prose-li:text-base',
    'prose-li:leading-relaxed',
    'prose-img:max-w-full',
    'prose-img:w-auto',
    'prose-img:mx-auto',
    
    // Tablet (sm:) prose classes
    'sm:prose-p:text-lg',
    'sm:prose-p:mb-6',
    'sm:prose-h1:text-3xl',
    'sm:prose-h1:mb-5',
    'sm:prose-h2:text-2xl',
    'sm:prose-h2:mb-4',
    'sm:prose-h3:text-xl',
    'sm:prose-h3:mb-4',
    'sm:prose-li:text-lg',
    'sm:prose-img:max-w-md',
    
    // Desktop (md:) prose classes
    'md:prose-p:text-[20px]',
    'md:prose-p:leading-[1.7]',
    'md:prose-p:mb-8',
    'md:prose-h1:text-4xl',
    'md:prose-h1:mb-6',
    'md:prose-h2:text-3xl',
    'md:prose-h2:mb-5',
    'md:prose-h3:text-2xl',
    'md:prose-h3:mb-4',
    'md:prose-li:text-[20px]',
    'md:prose-li:leading-[1.7]',
    'md:prose-img:max-w-[600px]',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    // your other plugins
  ],
}