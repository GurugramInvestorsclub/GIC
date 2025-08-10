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

  // Helper function to get status badge info
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
        className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer group ${className}`}
        onClick={handleClick}
      >
        {/* Blog Image */}
        {item.image_url && (
          <div className="h-48 overflow-hidden">
            <img 
              src={item.image_url} 
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        {/* Blog Content */}
        <div className="p-6">
          {/* Date and Tags */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">
              {item.published_date ? formatDate(item.published_date) : formatDate(item.created_at)}
            </span>
            {item.tags && item.tags.length > 0 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                {item.tags[0]}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-black transition-colors">
            {item.title}
          </h3>

          {/* Content Preview */}
          {item.content && (
            <p className="text-gray-600 mb-4 line-clamp-3">
              {item.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
            </p>
          )}

          {/* Author and Read More */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {item.author && `By ${item.author}`}
            </span>
            <span className="text-black font-semibold group-hover:underline transition-all">
              Read More →
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
        className={`bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer ${className}`}
        onClick={handleClick}
      >
        <div className="flex items-start gap-6">
          {/* Date Display */}
          <div className="bg-gray-50 rounded-lg p-4 text-center min-w-[80px] border border-gray-200">
            <div className="text-2xl font-bold text-black leading-none">
              {eventDate.day}
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-wide mt-1">
              {eventDate.month}
            </div>
          </div>

          {/* Event Content */}
          <div className="flex-1">
            {/* Status and Type */}
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${status.style}`}>
                {status.text}
              </span>
              <span className="text-sm text-gray-500">Event</span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {item.title}
            </h3>

            {/* Description */}
            {item.description && (
              <p className="text-gray-600 mb-4 line-clamp-2">
                {item.description}
              </p>
            )}

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
              {item.event_time && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{item.event_time}</span>
                </div>
              )}
              {item.location && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="truncate">{item.location}</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {item.registration_link ? 'Registration Available' : 'More Details'}
              </span>
              <span className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
                {status.text === 'Registration Open' ? 'Register' : 'View Details'}
              </span>
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