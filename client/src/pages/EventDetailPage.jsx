import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvent } from '../hooks/useApi';

const EventDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { event, loading, error } = useEvent(slug);

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
        Back to Events
      </button>

      {/* Event Header */}
      <header className="mb-8">
        {/* Status Badge */}
        <div className="mb-6">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide ${status.style}`}>
            {status.text}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          {event.title}
        </h1>

        {/* Featured Image */}
        {event.image_url && (
          <div className="mb-8">
            <img 
              src={event.image_url} 
              alt={event.title}
              className="w-full h-96 object-cover rounded-xl"
            />
          </div>
        )}
      </header>

      {/* Event Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Description */}
          {event.description && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <div className="text-gray-700 leading-relaxed">
                <p>{event.description}</p>
              </div>
            </section>
          )}

          {/* Venue Details */}
          {event.venue_details && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Venue Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed">{event.venue_details}</p>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Event Info Card */}
          <div className="bg-gray-50 p-6 rounded-xl mb-6">
            <h3 className="text-xl font-bold mb-4">Event Details</h3>
            
            <div className="space-y-4">
              {/* Date */}
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">{formatDate(event.event_date)}</p>
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

              {/* Booking Deadline */}
              {event.booking_end_date && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            </div>
          </div>

          {/* Registration/Action Button */}
          <div className="space-y-3">
            {status.canRegister ? (
              <button
                onClick={handleRegister}
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Register Now
              </button>
            ) : status.text === 'Event Completed' ? (
              <div className="w-full bg-gray-100 text-gray-600 py-3 px-6 rounded-lg font-semibold text-center">
                Event Completed
              </div>
            ) : (
              <div className="w-full bg-gray-100 text-gray-600 py-3 px-6 rounded-lg font-semibold text-center">
                Registration Closed
              </div>
            )}

            {/* Additional Links */}
            {event.external_payment_link && status.canRegister && (
              <button
                onClick={() => window.open(event.external_payment_link, '_blank')}
                className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Payment Portal
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <section className="mt-16 py-12 bg-gray-50 rounded-xl text-center">
        <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
        <p className="text-gray-600 mb-6">
          Stay updated on upcoming events and connect with fellow investors.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/events')}
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            View All Events
          </button>
          <button
            onClick={() => navigate('/blog')}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Read Our Blog
          </button>
        </div>
      </section>
    </div>
  );
};

export default EventDetailPage;