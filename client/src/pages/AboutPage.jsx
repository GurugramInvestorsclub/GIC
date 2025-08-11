import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';

const AboutPage = () => {
  const navigate = useNavigate();

  const handleJoinForum = () => {
    navigate('/forum');
  };

  const values = [
    {
      title: "Transparency",
      description: "We believe in open, honest discussions about investments, including both successes and failures. Every discussion comes with detailed analysis and risk assessment."
    },
    {
      title: "Education", 
      description: "Knowledge sharing is at our core. We organize workshops, meetups, and facilitate connections to help educate our members & level up their Investing game."
    },
    {
      title: "Community",
      description: "Our strength lies in our diverse community of investors, entrepreneurs, and finance professionals from a diverse set of sectors who collaborate to achieve collective success."
    }
  ];

  const founder = {
    name: "Rahul Rao, CFA",
    role: "Founder, GIC",
    description: "Aerospace Engineer with 11 years of Investing experience in the Indian equity space.",
    initials: "RR"
  };

  const missionPoints = [
    "To attract high agency DIY investors with deep domain expertise in their respective fields and a passion for value investing.",
    "To help create lasting friendships based on a genuine love of stock picking.",
    "To help 100 members achieve a portfolio of over 100 cr over the next 10 years."
  ];

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="We are just like you !"
        subtitle="Founded in 2024, GIC is what every DIY/HNI investor wants - a passionate group of investor friends you can learn from, network & stress-test your ideas with."
        size="large"
      />

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Our Mission</h2>
          <div className="space-y-6">
            {missionPoints.map((point, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-black rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {point}
                </p>
              </div>
            ))}
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

      {/* Founder Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Founder</h2>
          <div className="flex justify-center">
            <div className="bg-white rounded-lg p-8 text-center shadow-md hover:shadow-lg transition-shadow duration-300 max-w-sm">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold text-gray-600">
                {/* {founder.initials} */}
                <img src="./image.png" alt="Rahul Rao" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">{founder.name}</h3>
              <p className="text-lg text-gray-500 mb-4">{founder.role}</p>
              <p className="text-gray-600 leading-relaxed">{founder.description}</p>
            </div>
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