"use client"
import React, { useState } from "react";

const HowItWorks = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [subscriptionEmail, setSubscriptionEmail] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [subscriptionSubmitted, setSubscriptionSubmitted] = useState(false);

  const handleContactSubmit = () => {
    if (contactForm.name && contactForm.email && contactForm.message) {
      console.log('Contact form submitted:', contactForm);
      setContactSubmitted(true);
      setTimeout(() => setContactSubmitted(false), 3000);
      setContactForm({ name: '', email: '', message: '' });
    }
  };

  const handleSubscriptionSubmit = () => {
    if (subscriptionEmail) {
      console.log('Subscription submitted:', subscriptionEmail);
      setSubscriptionSubmitted(true);
      setTimeout(() => setSubscriptionSubmitted(false), 3000);
      setSubscriptionEmail('');
    }
  };

// interface ContactForm {
//     name: string;
//     email: string;
//     message: string;
// }

const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({
        ...contactForm,
        [e.target.name]: e.target.value
    });
};

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* How It Works Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How JobConnect Works
          </h2>
          <p className="text-lg text-gray-600">
            Simple steps to connect workers and recruiters
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-orange-400">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Create Profile</h3>
            <p className="text-gray-600">
              Sign up and create your detailed profile with skills, experience,
              and preferences
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Browse & Apply</h3>
            <p className="text-gray-600">
              Browse job listings or post job requirements and connect with
              suitable matches
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Start Working</h3>
            <p className="text-gray-600">
              Get hired and manage your work assignments through our platform
            </p>
          </div>
        </div>

        {/* Contact Form and Subscription Section */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Need More Information?
            </h3>
            <p className="text-gray-600 mb-6">
              Have questions about how JobConnect works? We're here to help!
            </p>
            
            {contactSubmitted && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg "
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg "
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  rows={4}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg "
                  placeholder="Tell us how we can help you..."
                />
              </div>
              <button
                onClick={handleContactSubmit}
                className="w-full bg-orange-400 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-400 transition duration-300"
              >
                Send Message
              </button>
            </div>
          </div>

          {/* Subscription Form */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Stay Connected with Us
            </h3>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter for daily job updates, career tips, and platform news delivered straight to your inbox.
            </p>
            
            <div className="bg-white rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">What you'll get:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Daily job opportunities
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Career development tips
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Platform updates and features
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Industry insights and trends
                </li>
              </ul>
            </div>

            {subscriptionSubmitted && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Welcome aboard! You're now subscribed to our updates.
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="subscriptionEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="subscriptionEmail"
                  value={subscriptionEmail}
                  onChange={(e) => setSubscriptionEmail(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg  focus:border-transparent"
                  placeholder="Enter your email for updates"
                />
              </div>
              <button
                onClick={handleSubscriptionSubmit}
                className="w-full bg-orange-400 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-500 transition duration-300"
              >
                Subscribe for Updates
              </button>
              <p className="text-xs text-gray-500 text-center">
                No spam, unsubscribe at any time
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;