import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">MyApp</div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <a href="#home" className="text-white hover:text-gray-200">
            Home
          </a>
          <a href="#about" className="text-white hover:text-gray-200">
            About
          </a>
          <a href="#services" className="text-white hover:text-gray-200">
            Services
          </a>
        </div>

        {/* User Dropdown */}
        <div className="relative group">
          <button className="text-white flex items-center space-x-2">
            <span>User</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <a
              href="#profile"
              className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
            >
              Profile
            </a>
            <a
              href="#settings"
              className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
            >
              Settings
            </a>
            <a
              href="#logout"
              className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
            >
              Logout
            </a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="text-white focus:outline-none focus:ring"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden mt-4 space-y-2">
        <a href="#home" className="block text-white hover:text-gray-200">
          Home
        </a>
        <a href="#about" className="block text-white hover:text-gray-200">
          About
        </a>
        <a href="#services" className="block text-white hover:text-gray-200">
          Services
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
