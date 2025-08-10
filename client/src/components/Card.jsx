import React from 'react';

const Card = ({ item, type = 'blog', onClick = () => {}, className = '' }) => {
  // Helper function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Helper function to format event date for the date display
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' })
    };
  };

  // Helper function to get read time for blogs
  const getReadTime = (content) => {
    if (!content) return 0;
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Helper function to truncate content
  const truncateContent = (content, maxLength = 150) => {
    if (!content) return '';
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > maxLength 
      ? `${plainText.substring(0, maxLength)}...` 
      : plainText;
  };

  // Helper function to get status badge info for events
  const getEventStatus = (event) => {
    const now = new Date();
    const eventDate = new Date(event.event_date);
    const bookingEndDate = event.booking_end_date ? new Date(event.booking_end_date) : eventDate;

    if (eventDate < now) {
      return { text: 'Completed', style: 'bg-gray-100 text-gray-700' };
    } else if (bookingEndDate < now) {
      return { text: 'Registration Closed', style: 'bg-red-100 text-red-700' };
    } else if (bookingEndDate > now) {
      return { text: 'Registration Open', style: 'bg-green-100 text-green-700' };
    } else {
      return { text: 'Upcoming', style: 'bg-blue-100 text-blue-700' };
    }
  };

  const handleClick = () => {
    onClick(item);
  };

  // Blog Card Layout
  if (type === 'blog') {
    return (
      <div 
        className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-100 ${className}`}
        onClick={handleClick}
      >
        {/* Blog Image */}
        {item.image_url && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={item.image_url} 
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
          </div>
        )}
        
        {/* Blog Content */}
        <div className="p-6">
          {/* Date and Tags */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">
              {item.published_date ? formatDate(item.published_date) : formatDate(item.created_at)}
            </span>
            {item.tags && item.tags.length > 0 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                {item.tags[0].replace('#', '')}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-black transition-colors">
            {item.title}
          </h3>

          {/* Content Preview */}
          <p className="text-gray-600 mb-4 leading-relaxed">
            {truncateContent(item.content, 120)}
          </p>

          {/* Author and Read More */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              {item.author && (
                <>
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {item.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {item.author}
                  </span>
                </>
              )}
              {!item.author && (
                <span className="text-sm text-gray-500">
                  {getReadTime(item.content)} min read
                </span>
              )}
            </div>
            <span className="text-black font-semibold group-hover:underline transition-all flex items-center">
              Read More
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Event Card Layout
  if (type === 'event') {
    const eventDate = formatEventDate(item.event_date);
    const status = getEventStatus(item);

    return (
      <div 
        className={`bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer group ${className}`}
        onClick={handleClick}
      >
        <div className="p-6">
          <div className="flex items-start gap-6">
            {/* Date Display */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center min-w-[80px] group-hover:bg-gray-100 transition-colors">
              <div className="text-2xl font-bold text-black leading-none">
                {eventDate.day}
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wide mt-1">
                {eventDate.month}
              </div>
            </div>

            {/* Event Content */}
            <div className="flex-1 min-w-0">
              {/* Status and Type */}
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${status.style}`}>
                  {status.text}
                </span>
                <span className="text-sm text-gray-500">Event</span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-black transition-colors">
                {item.title}
              </h3>

              {/* Description */}
              {item.description && (
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {truncateContent(item.description, 100)}
                </p>
              )}

              {/* Event Details */}
              <div className="space-y-2 mb-4">
                {item.event_time && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{item.event_time}</span>
                  </div>
                )}
                {item.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="truncate">{item.location}</span>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  {item.registration_link || item.external_payment_link ? 'Registration Available' : 'More Details'}
                </span>
                <span className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold group-hover:bg-gray-800 transition-all flex items-center">
                  {status.text === 'Registration Open' ? 'Register' : 'View Details'}
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
};

export default Card;