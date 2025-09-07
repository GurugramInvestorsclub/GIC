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
        className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-100 flex flex-col h-full ${className}`}
        onClick={handleClick}
      >
        {/* Blog Image - Fixed aspect ratio container */}
        {item.image_url && (
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
            <img 
              src={item.image_url} 
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.style.display = 'none';
              }}
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
          </div>
        )}
        
        {/* Blog Content - Flex grow to fill remaining space */}
        <div className="p-6 flex flex-col flex-grow">
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

          {/* Content Preview - Flex grow to fill space */}
          <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
            {truncateContent(item.content, 120)}
          </p>

          {/* Author and Read More - Always at bottom */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
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

  // Demo with sample data
  const sampleBlog = {
    id: 1,
    title: "Understanding Investment Fundamentals",
    content: "This comprehensive guide covers the essential principles of investment strategy, risk management, and portfolio diversification. Learn how to make informed decisions in today's dynamic market environment.",
    image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
    author: "John Smith",
    published_date: "2024-01-15",
    tags: ["#investing", "#fundamentals"]
  };

  const sampleEvent = {
    id: 1,
    title: "Annual Investment Conference 2024",
    description: "Join us for our biggest event of the year featuring keynote speakers, networking opportunities, and expert panel discussions on market trends.",
    event_date: "2024-02-20",
    event_time: "09:00 AM",
    location: "Convention Center, Downtown",
    booking_end_date: "2024-02-15",
    registration_link: "https://example.com/register"
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Card Component Examples</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Blog Card Example */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Blog Card</h2>
            <Card item={sampleBlog} type="blog" onClick={(item) => console.log('Blog clicked:', item)} />
          </div>
          
          {/* Event Card Example */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Event Card</h2>
            <Card item={sampleEvent} type="event" onClick={(item) => console.log('Event clicked:', item)} />
          </div>
        </div>

        {/* Grid Layout Example */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Grid Layout Example</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card item={sampleBlog} type="blog" />
            <Card item={{...sampleBlog, image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop"}} type="blog" />
            <Card item={{...sampleBlog, image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop"}} type="blog" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;