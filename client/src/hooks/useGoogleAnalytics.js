import { useEffect } from 'react';

const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;

const useGoogleAnalytics = () => {
  useEffect(() => {
    // Check if GA script is already loaded
    if (window.gtag) {
      return;
    }

    // Create and load the Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    // Configure Google Analytics
    gtag('js', new Date());
    gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }, []);

  // Function to track page views
  const trackPageView = (path, title) => {
    if (window.gtag) {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: path,
        page_title: title,
      });
    }
  };

  // Function to track custom events
  const trackEvent = (action, category = 'engagement', label = '', value = 0) => {
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  // Function to track button clicks
  const trackButtonClick = (buttonName, location = '') => {
    trackEvent('click', 'button', `${buttonName}${location ? ` - ${location}` : ''}`, 1);
  };

  // Function to track link clicks
  const trackLinkClick = (linkUrl, linkText = '') => {
    trackEvent('click', 'link', `${linkText} - ${linkUrl}`, 1);
  };

  // Function to track blog/event views
  const trackContentView = (contentType, contentTitle, contentId = '') => {
    trackEvent('view_content', contentType, `${contentTitle}${contentId ? ` - ${contentId}` : ''}`, 1);
  };

  return {
    trackPageView,
    trackEvent,
    trackButtonClick,
    trackLinkClick,
    trackContentView,
  };
};

export default useGoogleAnalytics;