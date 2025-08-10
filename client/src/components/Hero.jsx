import React from 'react';

const Hero = ({ 
  title, 
  subtitle, 
  showCTA = false, 
  ctaText = "Get Started", 
  ctaAction = () => {},
  size = "large" // "large" | "medium" | "small"
}) => {
  // Dynamic sizing based on size prop
  const titleSizes = {
    large: "text-5xl md:text-7xl",
    medium: "text-4xl md:text-5xl", 
    small: "text-3xl md:text-4xl"
  };

  const subtitleSizes = {
    large: "text-lg md:text-xl",
    medium: "text-lg",
    small: "text-base"
  };

  const paddingSizes = {
    large: "py-20",
    medium: "py-16",
    small: "py-12"
  };

  return (
    <section className={`text-center ${paddingSizes[size]}`}>
      {/* Main Title */}
      <h1 className={`font-bold tracking-tight leading-tight ${titleSizes[size]}`}>
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p className={`mt-6 text-gray-500 max-w-4xl mx-auto leading-relaxed ${subtitleSizes[size]}`}>
          {subtitle}
        </p>
      )}

      {/* CTA Button */}
      {showCTA && ctaText && (
        <div className="mt-8">
          <button
            onClick={ctaAction}
            className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            {ctaText}
          </button>
        </div>
      )}
    </section>
  );
};

export default Hero;