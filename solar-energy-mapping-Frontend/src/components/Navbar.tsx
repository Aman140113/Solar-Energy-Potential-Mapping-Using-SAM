import React from 'react';
import { Link } from 'react-router-dom';
import { Sun } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Sun className="h-8 w-8 text-yellow-500" />
              <span className="text-xl font-bold text-gray-800">SolarMap</span>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link to="/upload" className="text-gray-600 hover:text-gray-900">Upload Image</Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact Us</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}