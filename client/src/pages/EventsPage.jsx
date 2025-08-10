import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { useEvents } from '../hooks/useApi';

const EventsPage = () => {
  const navigate = useNavigate();
  const { events, loading, error } = useEvents();
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  useEffect(() => {
    if (events.length > 0) {
      const now = new Date();
      const upcoming = [];
      const past = [];
      let featured = null;

      events.forEach(event => {
        const eventDate = new Date(event.event_date);
        
        if (eventDate >= now) {
          upcoming.push(event);
          // Set first upcoming event as featured if not already set
          if (!featured) {
            featured = event;
          }
        } else {
          past.push(event);
        }
      });

      // Sort upcoming events by date (earliest first)
      upcoming.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
      
      // Sort past events by date (most recent first)
      past.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

      setFeaturedEvent(featured);
      setUpcomingEvents(upcoming.filter(event => event.id !== featured?.id));
      setPastEvents(past.slice(0, 4)); // Show only recent 4 past events
    }
  }, [events]);

  const handleEventClick = (event) => {
    navigate(`/events/${event.slug}`);
  };

  const handleRegisterEvent = (event) => {
    if (event.registration_link) {
      window.open(event.registration_link, '_blank');
    } else if (event.external_payment_link) {
      window.open(event.external_payment_link, '_blank');
    } else {
      navigate(`/events/${event.slug}`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' })
    };
  };

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

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Upcoming Events"
        subtitle="Join our community of investors for networking, learning, and collaborative discussions. From workshops to networking dinners, there's something for every investor."
        size="large"
      />

      {/* Featured Upcoming Event */}
      {featuredEvent && (
        <section className="mb-16">
          <div className="bg-gray-50 rounded-xl p-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Date Display */}
              <div className="bg-white rounded-lg p-4 text-center min-w-[80px] border border-gray-200 shadow-sm">
                <div className="text-2xl font-bold text-black leading-none">
                  {formatEventDate(featuredEvent.event_date).day}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide mt-1">
                  {formatEventDate(featuredEvent.event_date).month}
                </div>
              </div>

              {/* Event Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getEventStatus(featuredEvent).style}`}>
                    {getEventStatus(featuredEvent).text}
                  </span>
                  <span className="text-sm text-gray-500">Featured Event</span>
                </div>

                <h2 className="text-3xl font-bold mb-4">{featuredEvent.title}</h2>
                
                {featuredEvent.description && (
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredEvent.description}
                  </p>
                )}

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {featuredEvent.event_time && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-gray-600">{featuredEvent.event_time}</span>
                    </div>
                  )}
                  {featuredEvent.location && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span className="text-sm text-gray-600">{featuredEvent.location}</span>
                    </div>
                  )}
                  {featuredEvent.venue_details && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-sm text-gray-600 truncate">{featuredEvent.venue_details}</span>
                    </div>
                  )}
                  {featuredEvent.external_payment_link && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span className="text-sm text-gray-600">Paid Event</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => handleRegisterEvent(featuredEvent)}
                    className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    {getEventStatus(featuredEvent).text === 'Registration Open' ? 'Register Now' : 'Learn More'}
                  </button>
                  <button
                    onClick={() => handleEventClick(featuredEvent)}
                    className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Upcoming Events */}
      <section className="py-16">
        <h2 className="text-4xl font-bold text-center mb-16">All Upcoming Events</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading events...</p>
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="space-y-6">
            {upcomingEvents.map((event) => (
              <Card
                key={event.id}
                item={event}
                type="event"
                onClick={handleEventClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No upcoming events scheduled at the moment.</p>
            <p className="text-gray-400 mt-2">Check back soon for new events!</p>
          </div>
        )}
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="py-16">
          <h2 className="text-4xl font-bold text-center mb-16">Recent Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pastEvents.map((event) => (
              <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                    Completed
                  </span>
                  <span className="text-sm text-gray-500">{formatDate(event.event_date)}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                
                {event.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Event completed</span>
                  <button
                    onClick={() => handleEventClick(event)}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Event Guidelines */}
      <section className="py-16 bg-gray-50 rounded-xl">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Event Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Registration Policy</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Registration closes 24 hours before events</li>
                <li>• Cancellations accepted up to 48 hours prior</li>
                <li>• Club members get priority booking</li>
                <li>• Payment required for premium events</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Code of Conduct</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Professional and respectful behavior expected</li>
                <li>• No promotional activities without permission</li>
                <li>• Investment discussions are for educational purposes</li>
                <li>• Networking encouraged but no hard selling</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;