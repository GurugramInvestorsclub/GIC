import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'https://gic-server.onrender.com/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams ? `/blogs?${queryParams}` : '/blogs';
    return await apiCall(endpoint);
  };

  const fetchBlogBySlug = async (slug) => {
    return await apiCall(`/blogs/${slug}`);
  };

  const fetchEvents = async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams ? `/events?${queryParams}` : '/events';
    return await apiCall(endpoint);
  };

  const fetchEventBySlug = async (slug) => {
    return await apiCall(`/events/${slug}`);
  };

  const fetchUpcomingEvents = async () => {
    return await apiCall('/events/upcoming');
  };

  return {
    loading,
    error,
    fetchBlogs,
    fetchBlogBySlug,
    fetchEvents,
    fetchEventBySlug,
    fetchUpcomingEvents,
  };
};

// Custom hook for fetching blogs with state management
export const useBlogs = (params = {}) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const queryParams = new URLSearchParams(params).toString();
        const endpoint = queryParams ? `/blogs?${queryParams}` : '/blogs';
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const blogsData = data?.data?.blogs || [];
        setBlogs(blogsData);
      } catch (err) {
        setError(err.message);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, [JSON.stringify(params)]); // Stable dependency

  return { blogs, loading, error };
};

// Custom hook for fetching events with state management
export const useEvents = (params = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const queryParams = new URLSearchParams(params).toString();
        const endpoint = queryParams ? `/events?${queryParams}` : '/events';
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const eventsData = data?.data?.events || data?.data || [];
        setEvents(eventsData);
      } catch (err) {
        setError(err.message);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [JSON.stringify(params)]); // Stable dependency

  return { events, loading, error };
};

// Custom hook for fetching single blog
export const useBlog = (slug) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const loadBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/blogs/${slug}`, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const blogData = data?.data || data;
        setBlog(blogData);
      } catch (err) {
        setError(err.message);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [slug]); // Only depend on slug

  return { blog, loading, error };
};

// Custom hook for fetching single event
export const useEvent = (slug) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const loadEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/events/${slug}`, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Single event API response:', data);
        
        // Fix: Handle the correct nested structure
        let eventData;
        if (data?.data?.event) {
          // Response structure: {data: {event: {...}}}
          eventData = data.data.event;
        } else if (data?.data) {
          // Response structure: {data: {...}}
          eventData = data.data;
        } else if (data?.event) {
          // Response structure: {event: {...}}
          eventData = data.event;
        } else {
          // Direct event object
          eventData = data;
        }
        
        console.log('Extracted event data:', eventData);
        
        setEvent(eventData);
      } catch (err) {
        setError(err.message);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [slug]); // Only depend on slug

  return { event, loading, error };
};