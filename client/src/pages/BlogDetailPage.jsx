import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlog } from '../hooks/useApi';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { blog, loading, error } = useBlog(slug);
  const [shareMessage, setShareMessage] = useState('');
  const [showFloatingShare, setShowFloatingShare] = useState(false);

  // DEBUG: Log blog data to check image_url
  useEffect(() => {
    if (blog) {
      console.log('🖼️ BLOG IMAGE DEBUG:', {
        blog_exists: !!blog,
        image_url: blog?.image_url,
        image_url_type: typeof blog?.image_url,
        image_url_length: blog?.image_url?.length,
        content_preview: blog?.content?.substring(0, 200),
        full_blog_object: blog
      });
    }
  }, [blog]);

  // Show floating share button after user scrolls past the header
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 400; // Show after scrolling 400px
      setShowFloatingShare(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    
    let date;
    if (dateString.includes('T')) {
      date = new Date(dateString);
    } else {
      date = new Date(dateString + 'T00:00:00');
    }
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getReadTime = (content) => {
    if (!content || typeof content !== 'string') return 0;
    // Strip HTML tags for word counting
    const plainText = content.replace(/<[^>]*>/g, '');
    const wordsPerMinute = 200;
    const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
    return Math.ceil(words.length / wordsPerMinute);
  };

  const handleBackClick = () => {
    navigate('/blog');
  };

  const handleShare = async (source = 'header') => {
    const shareUrl = window.location.href;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage('Link copied to clipboard!');
      setTimeout(() => setShareMessage(''), 3000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShareMessage('Link copied to clipboard!');
      setTimeout(() => setShareMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-red-600 text-lg mb-4 font-medium">{error}</p>
          <button 
            onClick={handleBackClick}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-gray-600 text-lg mb-4">Article not found</p>
          <button 
            onClick={handleBackClick}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Floating Share Button - Scrolls with content - Right Side - Hidden on Mobile */}
      <div className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-300 hidden md:block ${showFloatingShare ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}>
        <div className="flex flex-col space-y-3">
          {/* Share Button - Tablet and Desktop Only */}
          <button
            onClick={() => handleShare('floating')}
            className="w-12 h-12 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200 hover:scale-110 flex items-center justify-center group"
            title="Share this article"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
          
          {/* Floating Share Success Message - Positioned for Right Side */}
          {shareMessage && (
            <div className="absolute right-16 top-0 bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
              {shareMessage}
            </div>
          )}

          {/* Back to Top Button - Tablet and Desktop Only */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 bg-gray-100 text-gray-600 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-200 hover:scale-110 flex items-center justify-center"
            title="Back to top"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Container with optimal reading width */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Blog</span>
          </button>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {blog.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  {tag.replace('#', '')}
                </span>
              ))}
            </div>
          )}

          {/* Title - Optimized Typography */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 mb-8 tracking-tight">
            {blog.title}
          </h1>

          {/* Author and Meta Info */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-8 mb-8">
            <div className="flex items-center space-x-4">
              {/* Author Avatar */}
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-700 font-semibold text-lg">
                  {blog.author ? blog.author.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
              
              {/* Author Info */}
              <div>
                <p className="font-semibold text-gray-900 text-lg">
                  {blog.author || 'Anonymous'}
                </p>
                <div className="flex items-center text-sm text-gray-600 space-x-2 mt-1">
                  <span>
                    {blog.published_date ? formatDate(blog.published_date) : formatDate(blog.created_at)}
                  </span>
                  <span>•</span>
                  <span>{getReadTime(blog.content)} min read</span>
                </div>
              </div>
            </div>

            {/* Header Share Button */}
            <div className="relative">
              <button
                onClick={() => handleShare('header')}
                className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>Share</span>
              </button>
              
              {/* Header Share Success Message */}
              {shareMessage && (
                <div className="absolute top-full mt-2 right-0 bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg z-10">
                  {shareMessage}
                </div>
              )}
            </div>
          </div>

          {/* Featured Image - Only if it exists and is different from inline images */}
          {blog.image_url && (
            <div className="mb-12">
              <img 
                src={blog.image_url} 
                alt={blog.title}
                className="w-full max-w-[600px] h-auto object-cover rounded-xl shadow-sm mx-auto"
                onError={(e) => {
                  console.error('Featured image failed to load:', blog.image_url);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </header>

        {/* Article Content - FIXED: Now properly renders HTML with inline images */}
        <article className="mb-16">
          <div className="max-w-[680px] mx-auto">
            <div 
              className="
                prose prose-xl max-w-none
                prose-p:text-[20px] prose-p:leading-[1.7] prose-p:text-gray-900 prose-p:mb-8
                prose-p:font-normal prose-p:tracking-normal
                prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
                prose-h1:text-4xl prose-h1:leading-tight prose-h1:mb-6 prose-h1:mt-10
                prose-h2:text-3xl prose-h2:leading-tight prose-h2:mb-5 prose-h2:mt-10 
                prose-h3:text-2xl prose-h3:leading-tight prose-h3:mb-4 prose-h3:mt-8
                prose-a:text-gray-900 prose-a:underline prose-a:decoration-1 prose-a:underline-offset-2
                hover:prose-a:text-gray-700 prose-a:transition-colors
                prose-ul:text-gray-900 prose-ol:text-gray-900 prose-li:text-[20px] prose-li:leading-[1.7]
                prose-ul:mb-8 prose-ol:mb-8 prose-li:mb-3
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-em:text-gray-900 prose-em:italic
                prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-6 
                prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:text-[20px]
                prose-blockquote:my-8 prose-blockquote:py-3 prose-blockquote:leading-[1.7]
                prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded 
                prose-code:text-base prose-code:font-mono prose-code:text-gray-800
                prose-table:text-gray-900 prose-th:font-semibold prose-th:text-gray-900
                prose-td:py-3 prose-th:py-3 prose-td:text-[20px] prose-th:text-[20px]
                prose-img:rounded-lg prose-img:shadow-sm prose-img:my-8 prose-img:max-w-[600px]
                prose-img:h-auto prose-img:mx-auto
                prose-hr:border-gray-200 prose-hr:my-12
              "
              dangerouslySetInnerHTML={{ 
                __html: blog.content // ✅ FIXED: Direct HTML rendering - no more breaking image tags!
              }}
            />
          </div>
        </article>

        {/* Resource Links */}
        {blog.resource_links && blog.resource_links.length > 0 && (
          <section className="mb-16">
            <div className="max-w-[680px] mx-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Additional Resources
                </h3>
                <div className="space-y-3">
                  {blog.resource_links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all group"
                    >
                      <span className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                        {link.title}
                      </span>
                      <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="border-t border-gray-200 pt-16">
          <div className="max-w-[680px] mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Enjoyed this article?</h3>
            <p className="text-gray-600 mb-8 text-[20px] leading-[1.7]">
              Discover more investment insights and market analysis from our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/blog')}
                className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                More Articles
              </button>
              <button
                onClick={() => navigate('/events')}
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Upcoming Events
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogDetailPage;