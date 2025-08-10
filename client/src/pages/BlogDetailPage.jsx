import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlog } from '../hooks/useApi';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { blog, loading, error } = useBlog(slug);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getReadTime = (content) => {
    if (!content) return 0;
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleBackClick = () => {
    navigate('/blog');
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
        className="flex items-center text-gray-600 hover:text-black transition-colors mb-8"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Blog
      </button>

      {/* Article Header */}
      <header className="mb-8">
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.map((tag, index) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          {blog.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-600 mb-8">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            {blog.author && (
              <span className="font-medium">By {blog.author}</span>
            )}
            <span>
              {blog.published_date ? formatDate(blog.published_date) : formatDate(blog.created_at)}
            </span>
            <span>{getReadTime(blog.content)} min read</span>
          </div>
        </div>

        {/* Featured Image */}
        {blog.image_url && (
          <div className="mb-8">
            <img 
              src={blog.image_url} 
              alt={blog.title}
              className="w-full h-96 object-cover rounded-xl"
            />
          </div>
        )}
      </header>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none">
        <div 
          className="text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>

      {/* Resource Links */}
      {blog.resource_links && blog.resource_links.length > 0 && (
        <section className="mt-12 p-6 bg-gray-50 rounded-xl">
          <h3 className="text-xl font-bold mb-4">Additional Resources</h3>
          <ul className="space-y-2">
            {blog.resource_links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline font-medium flex items-center"
                >
                  {link.title}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Newsletter Signup */}
      <section className="mt-16 py-12 bg-gray-50 rounded-xl text-center">
        <h3 className="text-2xl font-bold mb-4">Enjoyed this article?</h3>
        <p className="text-gray-600 mb-6">
          Subscribe to our newsletter for more investment insights and market analysis.
        </p>
        <button
          onClick={() => navigate('/blog')}
          className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors mr-4"
        >
          More Articles
        </button>
        <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Subscribe
        </button>
      </section>
    </div>
  );
};

export default BlogDetailPage;