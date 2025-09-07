import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlog } from '../hooks/useApi';
import useGoogleAnalytics from '../hooks/useGoogleAnalytics';
const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { blog, loading, error } = useBlog(slug);
  const [shareMessage, setShareMessage] = useState('');
  const [showFloatingShare, setShowFloatingShare] = useState(false);

  // Show floating share button after user scrolls past the header
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 400;
      setShowFloatingShare(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // COMPLETELY REWRITTEN: Pre-process HTML to create responsive tables
  const makeContentResponsive = (htmlContent) => {
    if (!htmlContent) return '';
    
    // Fix images first (keep existing logic)
    let content = htmlContent
      .replace(/style="[^"]*max-width:\s*\d+px[^"]*!important[^"]*"/g, 'style="max-width: 100%; height: auto; margin: 1rem auto; display: block; border-radius: 8px;"')
      .replace(/style="[^"]*max-width:\s*\d+px[^"]*"/g, 'style="max-width: 100%; height: auto; margin: 1rem auto; display: block; border-radius: 8px;"')
      .replace(/width="\d+"/g, '')
      .replace(/height="\d+"/g, '');

    // FIXED: Pre-process tables during HTML string manipulation
    content = content.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (match) => {
      return convertTableToResponsiveHTML(match);
    });
    
    return content;
  };

  // NEW: Convert table HTML to responsive structure during string processing
  const convertTableToResponsiveHTML = (tableHTML) => {
    try {
      // Create a temporary DOM element to parse the table
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = tableHTML;
      const table = tempDiv.querySelector('table');
      
      if (!table) return tableHTML; // Return original if parsing fails

      const rows = Array.from(table.querySelectorAll('tr'));
      if (rows.length === 0) return tableHTML;

      // Extract headers
      const headerRow = rows[0];
      const headers = Array.from(headerRow.querySelectorAll('th, td')).map(cell => 
        cell.textContent.trim() || `Column ${Array.from(headerRow.children).indexOf(cell) + 1}`
      );
      
      // Extract data rows
      const dataRows = rows.slice(1);
      
      // Determine if table is complex (more than 3 columns)
      const isComplexTable = headers.length > 3;
      
      if (isComplexTable) {
        // Convert to mobile cards with desktop table fallback
        return createHybridTableHTML(headers, dataRows, tableHTML);
      } else {
        // Simple responsive table with scroll
        return createSimpleResponsiveTable(tableHTML);
      }
    } catch (error) {
      console.warn('Table conversion failed, using original:', error);
      return createSimpleResponsiveTable(tableHTML);
    }
  };

  // NEW: Create hybrid table (cards on mobile, table on desktop)
  const createHybridTableHTML = (headers, dataRows, originalTable) => {
    // Generate mobile cards HTML
    const cardsHTML = dataRows.map((row, rowIndex) => {
      const cells = Array.from(row.querySelectorAll('td, th'));
      const cardItems = cells.map((cell, cellIndex) => {
        const header = headers[cellIndex] || `Column ${cellIndex + 1}`;
        const content = cell.innerHTML.trim() || '-';
        return `
          <div class="mobile-card-row">
            <div class="mobile-card-label">${header}</div>
            <div class="mobile-card-value">${content}</div>
          </div>
        `;
      }).join('');

      return `<div class="mobile-table-card" data-row="${rowIndex}">${cardItems}</div>`;
    }).join('');

    // Create complete responsive structure
    return `
      <div class="responsive-table-wrapper">
        <!-- Mobile Card Layout -->
        <div class="mobile-cards-container">
          <div class="mobile-cards-header">
            <svg class="mobile-cards-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            Table Data (${dataRows.length} ${dataRows.length === 1 ? 'entry' : 'entries'})
          </div>
          <div class="mobile-cards-grid">
            ${cardsHTML}
          </div>
        </div>
        
        <!-- Desktop Table Layout -->
        <div class="desktop-table-container">
          ${originalTable}
        </div>
      </div>
    `;
  };

  // NEW: Create simple responsive table with horizontal scroll
  const createSimpleResponsiveTable = (tableHTML) => {
    return `
      <div class="simple-responsive-table">
        ${tableHTML}
      </div>
    `;
  };

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
      {/* Floating Share Button */}
      <div className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-300 hidden md:block ${showFloatingShare ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}>
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => handleShare('floating')}
            className="w-12 h-12 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200 hover:scale-110 flex items-center justify-center group"
            title="Share this article"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
          
          {shareMessage && (
            <div className="absolute right-16 top-0 bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
              {shareMessage}
            </div>
          )}

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

      {/* Container */}
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

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight text-gray-900 mb-8 tracking-tight">
            {blog.title}
          </h1>

          {/* Author and Meta Info */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-8 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-700 font-semibold text-lg">
                  {blog.author ? blog.author.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
              
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
              
              {shareMessage && (
                <div className="absolute top-full mt-2 right-0 bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg z-10">
                  {shareMessage}
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          {blog.image_url && (
            <div className="mb-12">
              <img 
                src={blog.image_url} 
                alt={blog.title}
                className="w-full max-w-full sm:max-w-lg md:max-w-2xl h-auto object-cover rounded-xl shadow-sm mx-auto"
                onError={(e) => {
                  console.error('Featured image failed to load:', blog.image_url);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </header>

        {/* Article Content */}
        <article className="mb-16">
          <div className="w-full max-w-full">
            <div 
              className="blog-content"
              dangerouslySetInnerHTML={{ 
                __html: makeContentResponsive(blog.content)
              }}
            />
          </div>
        </article>

        {/* Resource Links */}
        {blog.resource_links && blog.resource_links.length > 0 && (
          <section className="mb-16">
            <div className="w-full max-w-full">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center">
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
          <div className="w-full max-w-full text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Enjoyed this article?</h3>
            <p className="text-gray-600 mb-8 text-base md:text-lg leading-relaxed">
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

      {/* FIXED: Stable, Pure CSS Responsive Table Styles */}
      <style jsx global>{`
        /* Prevent horizontal page scroll */
        html, body {
          overflow-x: hidden !important;
          max-width: 100vw !important;
        }
        
        /* Base blog content styles */
        .blog-content {
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          max-width: 100% !important;
          overflow-x: hidden !important;
        }
        
        .blog-content * {
          max-width: 100% !important;
          box-sizing: border-box !important;
        }

        .blog-content p {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 1rem;
          color: #111827;
        }

        .blog-content h1 {
          font-size: 1.75rem;
          font-weight: bold;
          line-height: 1.2;
          margin: 1.5rem 0 1rem 0;
          color: #111827;
        }

        .blog-content h2 {
          font-size: 1.5rem;
          font-weight: bold;
          line-height: 1.3;
          margin: 1.25rem 0 0.75rem 0;
          color: #111827;
        }

        .blog-content h3 {
          font-size: 1.25rem;
          font-weight: bold;
          line-height: 1.4;
          margin: 1rem 0 0.5rem 0;
          color: #111827;
        }

        .blog-content img {
          max-width: 95%;
          width: auto;
          height: auto;
          margin: 1rem auto;
          display: block;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .blog-content ul, .blog-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .blog-content li {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 0.5rem;
          color: #111827;
        }

        .blog-content blockquote {
          font-size: 16px;
          line-height: 1.6;
          margin: 1rem 0;
          padding-left: 1rem;
          border-left: 4px solid #d1d5db;
          font-style: italic;
          color: #6b7280;
        }

        .blog-content a {
          color: #111827;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .blog-content strong {
          font-weight: 600;
          color: #111827;
        }

        /* RESPONSIVE TABLE SYSTEM */
        
        /* Base wrapper for all responsive tables */
        .responsive-table-wrapper {
          margin: 1.5rem 0;
          width: 80%;
          max-width: 100%;
          margin-left:22%;
        }

        /* Mobile Cards Layout (default - hidden on desktop) */
        .mobile-cards-container {
          display: block;
          margin: 0 auto;
          // margin-left:10%;
          // padding-left:20px;
          max-width: 90%;
          width: fit-content;
        }

        .mobile-cards-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px 8px 0 0;
          font-weight: 600;
          color: #111827;
          font-size: 14px;
        }

        .mobile-cards-icon {
          width: 16px;
          height: 16px;
        }

        .mobile-cards-grid {
          border: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 8px 8px;
          overflow: hidden;
          text-align: left;
        }

        .mobile-table-card {
          padding: 16px;
          background: white;
          border-bottom: 1px solid #f3f4f6;
          margin: 0 auto;
          max-width: 100%;
        }

        .mobile-table-card:last-child {
          border-bottom: none;
        }

        .mobile-card-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 6px 0;
          border-bottom: 1px solid #f9fafb;
        }

        .mobile-card-row:last-child {
          border-bottom: none;
        }

        .mobile-card-label {
          font-weight: 600;
          color: #374151;
          font-size: 13px;
          margin-right: 16px;
          min-width: 100px;
          flex-shrink: 0;
        }

        .mobile-card-value {
          color: #111827;
          font-size: 14px;
          text-align: right;
          word-break: break-word;
          flex: 1;
        }

        /* Desktop Table Layout (hidden on mobile) */
        .desktop-table-container {
          display: none;
        }

        /* Simple responsive table (for tables with <= 3 columns) */
        .simple-responsive-table {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin: 1.5rem 0;
        }

        .simple-responsive-table table {
          width: 100%;
          border-collapse: collapse;
          margin: 0;
          min-width: 100%;
        }

        .simple-responsive-table th,
        .simple-responsive-table td {
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          font-size: 14px;
          text-align: left;
          white-space: nowrap;
        }

        .simple-responsive-table th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #111827;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .simple-responsive-table td {
          color: #374151;
        }

        /* TABLET RESPONSIVE (640px+) */
        @media (min-width: 640px) {
          .mobile-card-label {
            font-size: 14px;
          }

          .mobile-card-value {
            font-size: 15px;
          }

          .simple-responsive-table th,
          .simple-responsive-table td {
            font-size: 16px;
            padding: 10px 14px;
          }

          .blog-content p { font-size: 18px; }
          .blog-content h1 { font-size: 2.25rem; }
          .blog-content h2 { font-size: 1.875rem; }
          .blog-content h3 { font-size: 1.5rem; }
          .blog-content img { max-width: 90%; }
          .blog-content li { font-size: 18px; }
        }

        /* DESKTOP RESPONSIVE (768px+) */
        @media (min-width: 768px) {
          /* Hide mobile cards, show desktop table */
          .mobile-cards-container {
            display: none;
          }

          .desktop-table-container {
            display: block;
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
          }

          .desktop-table-container table {
            width: 100%;
            border-collapse: collapse;
            margin: 0;
          }

          .desktop-table-container th,
          .desktop-table-container td {
            padding: 12px 16px;
            border: 1px solid #e5e7eb;
            font-size: 16px;
            text-align: left;
          }

          .desktop-table-container th {
            background-color: #f9fafb;
            font-weight: 600;
            color: #111827;
          }

          .desktop-table-container td {
            color: #374151;
          }

          .simple-responsive-table th,
          .simple-responsive-table td {
            font-size: 16px;
            padding: 12px 16px;
            white-space: normal;
          }

          .blog-content p { font-size: 20px; }
          .blog-content h1 { font-size: 2.5rem; }
          .blog-content h2 { font-size: 2rem; }
          .blog-content h3 { font-size: 1.75rem; }
          .blog-content img { max-width: 600px; }
          .blog-content li { font-size: 20px; }
        }

        /* LARGE DESKTOP (1024px+) */
        @media (min-width: 1024px) {
          .desktop-table-container th,
          .desktop-table-container td {
            font-size: 18px;
            padding: 14px 18px;
          }

          .simple-responsive-table th,
          .simple-responsive-table td {
            font-size: 18px;
            padding: 14px 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogDetailPage;