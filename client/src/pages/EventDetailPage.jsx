import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvent } from '../hooks/useApi';

const EventDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { event, loading, error } = useEvent(slug);
  const [shareMessage, setShareMessage] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    // Handle both HH:MM and HH:MM:SS formats
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.getFullYear()
    };
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const eventDate = new Date(event.event_date);
    const bookingEndDate = event.booking_end_date ? new Date(event.booking_end_date) : eventDate;

    if (eventDate < now) {
      return { 
        text: 'Event Completed', 
        style: 'bg-gray-100 text-gray-700',
        canRegister: false
      };
    } else if (bookingEndDate < now) {
      return { 
        text: 'Registration Closed', 
        style: 'bg-red-100 text-red-700',
        canRegister: false
      };
    } else if (bookingEndDate > now) {
      return { 
        text: 'Registration Open', 
        style: 'bg-green-100 text-green-700',
        canRegister: true
      };
    } else {
      return { 
        text: 'Upcoming Event', 
        style: 'bg-blue-100 text-blue-700',
        canRegister: false
      };
    }
  };

  const handleBackClick = () => {
    navigate('/events');
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage('Event link copied to clipboard!');
      setTimeout(() => setShareMessage(''), 3000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShareMessage('Event link copied to clipboard!');
      setTimeout(() => setShareMessage(''), 3000);
    }
  };

  const handleRegister = () => {
    if (event.registration_link) {
      window.open(event.registration_link, '_blank');
    } else if (event.external_payment_link) {
      window.open(event.external_payment_link, '_blank');
    } else {
      alert('Registration information will be available soon. Please check back later.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading event details...</p>
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
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Event not found</p>
          <button 
            onClick={handleBackClick}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const status = getEventStatus(event);
  const eventDate = formatEventDate(event.event_date);

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
        Back to Events
      </button>

      {/* Event Header */}
      <header className="mb-12">
        {/* Status Badge */}
        <div className="mb-6">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide ${status.style}`}>
            {status.text}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 text-gray-900">
          {event.title}
        </h1>

        {/* Event Info and Share */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-6 mb-8">
          {/* Date and Basic Info */}
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            {/* Large Date Display */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center min-w-[80px]">
              <div className="text-2xl font-bold text-black leading-none">
                {eventDate.day}
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wide mt-1">
                {eventDate.month}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {eventDate.year}
              </div>
            </div>

            {/* Event Meta */}
            <div>
              <div className="flex items-center text-gray-600 mb-2">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-semibold">
                  {formatDate(event.event_date)}
                  {event.event_time && ` • ${formatTime(event.event_time)}`}
                </span>
              </div>
              
              {event.location && (
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>{event.location}</span>
                </div>
              )}
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
              <span>Share Event</span>
            </button>
            
            {/* Share Success Message */}
            {shareMessage && (
              <div className="absolute top-full mt-2 right-0 bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm whitespace-nowrap z-10">
                {shareMessage}
              </div>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {event.image_url && (
          <div className="mb-12">
            <img 
              src={event.image_url} 
              alt={event.title}
              className="w-full h-96 md:h-[500px] object-cover rounded-lg"
            />
          </div>
        )}
      </header>

      {/* Event Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Description */}
          {event.description && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <div className="prose prose-lg prose-gray max-w-none">
                <p className="text-gray-800 leading-relaxed text-lg">
                  {event.description}
                </p>
              </div>
            </section>
          )}

          {/* Venue Details */}
          {event.venue_details && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Venue Information</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-800 leading-relaxed">{event.venue_details}</p>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Event Details Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 sticky top-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Event Details</h3>
            
            <div className="space-y-6">
              {/* Date & Time */}
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Date & Time</p>
                  <p className="text-gray-600">{formatDate(event.event_date)}</p>
                  {event.event_time && (
                    <p className="text-gray-600">{formatTime(event.event_time)}</p>
                  )}
                </div>
              </div>

              {/* Location */}
              {event.location && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>
              )}

              {/* Registration Deadline */}
              {event.booking_end_date && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1115 0v5z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Registration Deadline</p>
                    <p className="text-gray-600">
                      {formatDate(event.booking_end_date)}
                      {event.booking_end_time && ` at ${formatTime(event.booking_end_time)}`}
                    </p>
                  </div>
                </div>
              )}

              {/* Event Type */}
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Event Type</p>
                  <p className="text-gray-600">
                    {event.external_payment_link ? 'Paid Event' : 'Free Event'}
                  </p>
                </div>
              </div>
            </div>

            {/* Registration Actions */}
            <div className="mt-8 space-y-3">
              {status.canRegister ? (
                <>
                  <button
                    onClick={handleRegister}
                    className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Register Now
                  </button>
                  {event.external_payment_link && event.registration_link && (
                    <button
                      onClick={() => window.open(event.external_payment_link, '_blank')}
                      className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Payment Portal
                    </button>
                  )}
                </>
              ) : (
                <div className="w-full bg-gray-100 text-gray-600 py-3 px-6 rounded-lg font-semibold text-center">
                  {status.text}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <section className="border-t border-gray-200 pt-12">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Investment Community</h3>
          <p className="text-gray-600 mb-8 text-lg">
            Stay updated on upcoming events and connect with fellow investors in Gurugram.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/events')}
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              View All Events
            </button>
            <button
              onClick={() => navigate('/blog')}
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Read Our Blog
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetailPage;