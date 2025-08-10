import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlog } from '../hooks/useApi';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { blog, loading, error } = useBlog(slug);
  const [shareMessage, setShareMessage] = useState('');

  // Just one debug log to see final result
  console.log('BlogDetailPage final blog object:', blog);

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    
    // Handle different date formats from API
    let date;
    if (dateString.includes('T')) {
      // ISO format: "2025-08-08T18:52:30.509"
      date = new Date(dateString);
    } else {
      // Date only format: "2025-08-08"
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
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(word => word.length > 0);
    return Math.ceil(words.length / wordsPerMinute);
  };

  const handleBackClick = () => {
    navigate('/blog');
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage('Link copied to clipboard!');
      setTimeout(() => setShareMessage(''), 3000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button 
            onClick={handleBackClick}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Article not found</p>
          <button 
            onClick={handleBackClick}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="flex items-center text-gray-600 hover:text-black transition-colors mb-8 group"
      >
        <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Blog
      </button>

      {/* Article Header */}
      <header className="mb-12">
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag, index) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {tag.replace('#', '')}
              </span>
            ))}
          </div>
        )}

        {/* Title - Medium Style */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 text-gray-900">
          {blog.title}
        </h1>

        {/* Author and Meta Info - Medium Style */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
          <div className="flex items-center space-x-4">
            {/* Author Avatar */}
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold">
                {blog.author ? blog.author.charAt(0).toUpperCase() : 'A'}
              </span>
            </div>
            
            {/* Author Info */}
            <div>
              <p className="font-semibold text-gray-900">
                {blog.author || 'Anonymous'}
              </p>
              <div className="flex items-center text-sm text-gray-500 space-x-2">
                <span>
                  {blog.published_date ? formatDate(blog.published_date) : formatDate(blog.created_at)}
                </span>
                <span>•</span>
                <span>{getReadTime(blog.content)} min read</span>
              </div>
            </div>
          </div>

          {/* Share Button */}
          <div className="relative">
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span>Share</span>
            </button>
            
            {/* Share Success Message */}
            {shareMessage && (
              <div className="absolute top-full mt-2 right-0 bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm whitespace-nowrap">
                {shareMessage}
              </div>
            )}
          </div>
        </div>

        {/* Featured Image - Medium Style */}
        {blog.image_url && (
          <div className="mb-12">
            <img 
              src={blog.image_url} 
              alt={blog.title}
              className="w-full h-96 md:h-[500px] object-cover rounded-lg"
            />
          </div>
        )}
      </header>

      {/* Article Content - Medium Style Typography */}
      <article className="mb-12">
        <div 
          className="prose prose-lg prose-gray max-w-none
                     prose-headings:text-gray-900 prose-headings:font-bold
                     prose-p:text-gray-800 prose-p:leading-relaxed prose-p:text-lg
                     prose-a:text-black prose-a:underline hover:prose-a:no-underline
                     prose-strong:text-gray-900 prose-strong:font-semibold
                     prose-ul:text-gray-800 prose-ol:text-gray-800
                     prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-6 prose-blockquote:italic
                     prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>

      {/* Resource Links - Clean Card Style */}
      {blog.resource_links && blog.resource_links.length > 0 && (
        <section className="mb-12">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group"
                >
                  <span className="font-medium text-gray-900 group-hover:text-black">
                    {link.title}
                  </span>
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-black group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Articles CTA */}
      <section className="border-t border-gray-200 pt-12">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Enjoyed this article?</h3>
          <p className="text-gray-600 mb-8 text-lg">
            Discover more investment insights and market analysis from our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/blog')}
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              More Articles
            </button>
            <button
              onClick={() => navigate('/events')}
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Upcoming Events
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetailPage;