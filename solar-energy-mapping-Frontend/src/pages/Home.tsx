import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Upload, BarChart3, Users } from 'lucide-react';

export default function Home() {
  const testimonials = [
    {
      text: "This tool saved me hours of manual calculations!",
      author: "Sarah Johnson",
      role: "Solar Installation Expert"
    },
    {
      text: "The most accurate solar potential assessment I've used.",
      author: "Michael Chen",
      role: "Homeowner"
    },
    {
      text: "Incredibly user-friendly and precise results.",
      author: "Emma Davis",
      role: "Energy Consultant"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 text-white pb-48 pt-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] mix-blend-overlay opacity-20 bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-8">
            <div className="relative">
              <Sun className="h-24 w-24 text-yellow-300 mx-auto mb-6 animate-spin-slow" />
              <div className="absolute -inset-1 blur-xl bg-yellow-400/30 rounded-full"></div>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-white via-orange-100 to-yellow-200 text-transparent bg-clip-text">
                Discover Your Solar
              </span>
              <br />
              <span className="bg-gradient-to-l from-white via-orange-100 to-yellow-200 text-transparent bg-clip-text">
                Potential Today
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-50 max-w-3xl mx-auto">
              Upload satellite images and get accurate solar energy assessments in minutes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/upload"
                className="group relative inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-full text-white hover:bg-white hover:text-orange-600 transition-all duration-300 transform hover:scale-105"
              >
                Get Started
                <Upload className="ml-2 h-5 w-5 group-hover:animate-bounce" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-lg font-medium rounded-full text-white hover:bg-white/20 transition-all duration-300"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg 
            viewBox="0 0 1440 200" 
            className="relative w-full h-[100px] md:h-[150px] lg:h-[200px]"
            preserveAspectRatio="none"
          >
            <path 
              fill="white" 
              d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,74.7C840,96,960,160,1080,165.3C1200,171,1320,117,1380,90.7L1440,64L1440,200L1380,200C1320,200,1200,200,1080,200C960,200,840,200,720,200C600,200,480,200,360,200C240,200,120,200,60,200L0,200Z"
            />
          </svg>
        </div>
      </section>

      {/* Rest of the components remain unchanged */}
      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-500 text-transparent bg-clip-text">Why Use Our Tool</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl hover:shadow-xl transition-all duration-300">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-orange-600">Real-time Calculation</h3>
              <p className="text-gray-600">Get instant solar potential calculations with our advanced algorithms</p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-xl transition-all duration-300">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Sun className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-orange-600">Advanced Technology</h3>
              <p className="text-gray-600">State-of-the-art image segmentation for accurate results</p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-xl transition-all duration-300">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-orange-600">User Friendly</h3>
              <p className="text-gray-600">No account required - just upload and analyze</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-500 text-transparent bg-clip-text">What Our Users Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-orange-600">{testimonial.author}</p>
                  <p className="text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}