import React from 'react';
import Hero from '../components/Hero';

const AboutPage = () => {
  const handleJoinForum = () => {
    // This will navigate to forum page when router is set up
    console.log('Navigate to forum page');
  };

  const values = [
    {
      title: "Transparency",
      description: "We believe in open, honest discussions about investments, including both successes and failures. Every recommendation comes with detailed analysis and risk assessment."
    },
    {
      title: "Education", 
      description: "Knowledge sharing is at our core. We organize workshops, seminars, and discussions to continuously educate our members about market trends and investment strategies."
    },
    {
      title: "Community",
      description: "Our strength lies in our diverse community of investors, entrepreneurs, and finance professionals who collaborate to achieve collective success."
    }
  ];

  const team = [
    {
      name: "Rajesh Sharma",
      role: "Founder & President",
      description: "15+ years in equity research and portfolio management. Former VP at leading investment firm.",
      initials: "RS"
    },
    {
      name: "Priya Gupta", 
      role: "VP Research",
      description: "CFA charterholder with expertise in small and mid-cap analysis. 12 years of market experience.",
      initials: "PG"
    },
    {
      name: "Amit Kumar",
      role: "Head of Events", 
      description: "Entrepreneur and angel investor with strong networks in Gurugram's startup ecosystem.",
      initials: "AK"
    }
  ];

  const timeline = [
    {
      year: "2019",
      title: "Club Founded",
      description: "Started with 15 passionate investors meeting monthly at a local cafe in Cyber City."
    },
    {
      year: "2021", 
      title: "Digital Expansion",
      description: "Launched our online forum and virtual events, growing membership to 100+ investors during the pandemic."
    },
    {
      year: "2023",
      title: "Research Excellence", 
      description: "Published 50+ detailed company research reports, establishing reputation for quality analysis."
    },
    {
      year: "2025",
      title: "500+ Strong Community",
      description: "Now a thriving community of 500+ members with regular events and collaboration opportunities."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="About Gurugram Investors Club"
        subtitle="Founded in 2019, the Gurugram Investors Club has grown from a small group of passionate investors to one of North India's most respected investment communities."
        size="large"
      />

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Our Mission</h2>
          <div className="text-center">
            <p className="text-xl text-gray-600 leading-relaxed">
              To democratize investment knowledge and create a collaborative ecosystem where both novice and experienced investors can learn, share insights, and build wealth through informed decision-making.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50 rounded-xl">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg border-l-4 border-black">
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg p-8 text-center shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold text-gray-600">
                  {member.initials}
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">{member.name}</h3>
                <p className="text-lg text-gray-500 mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Our Journey</h2>
          <div className="space-y-8">
            {timeline.map((milestone, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-20 text-center">
                  <span className="text-2xl font-bold text-gray-500">{milestone.year}</span>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-black mb-2">{milestone.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16 bg-gray-50 rounded-xl text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl text-gray-600 mb-8">
            Ready to take your investment journey to the next level? Connect with like-minded investors and start building wealth together.
          </p>
          <button
            onClick={handleJoinForum}
            className="bg-black text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Join the Forum
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;