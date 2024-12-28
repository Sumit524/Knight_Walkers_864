import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as preferencesOptions from './preferencesOptions'; // Adjust the import as needed
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
// Global toast configuration
const toastConfig = {
  success: {
    className: "bg-green-500 text-white font-bold text-lg rounded-lg shadow-md",
    bodyClassName: "text-sm",
    closeButton: false,
    hideProgressBar: true,
    autoClose: 3000, // Time in ms
  },
  error: {
    className: "bg-red-500 text-white font-bold text-lg rounded-lg shadow-md",
    bodyClassName: "text-sm",
    closeButton: false,
    hideProgressBar: true,
    autoClose: 3000,
  },
  info: {
    className: "bg-blue-500 text-white font-bold text-lg rounded-lg shadow-md",
    bodyClassName: "text-sm",
    closeButton: false,
    hideProgressBar: true,
    autoClose: 3000,
  },
};

export const showToast = (type: "success" | "error" | "info", message: string) => {
  toast[type](message, toastConfig[type]);
};

interface Restaurant {
  name: string;
  country: string;
  country_code: string;
  state: string;
  county: string;
  city: string;
  postcode: string;
  suburb: string;
  state_code: string;
  formatted: string;
}

const ApiPage: React.FC = () => {
  const [category, setcategory] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState<string>('10000'); // Default radius set to 10000
  const [displayRadius, setDisplayRadius] = useState<string>('10000'); // Default display radius
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ [key: string]: { value: string; label: string }[] }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const formattedCategories: { [key: string]: { value: string; label: string }[] } = preferencesOptions;
        setCategories(formattedCategories);
      } catch (error) {
        showToast("error",'Failed to load categories. Please try refreshing the page.');
        
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setError(null);
        },
        (err) => {
         showToast("error",'Unable to retrieve location. Please allow location access.');
        }
      );
    } else {
       showToast("error",'Geolocation is not supported by this browser.');
    }
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setSelectedOption(''); // Reset option when category changes
    setcategory([]); // Reset restaurant list when category changes
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
    setcategory([]); // Reset restaurant list when option changes
  };

  const handleChangeRadius = (value: string) => {
    setRadius(value);
  };

  const handleSubmit = () => {
    const radiusValue = parseFloat(radius);
    if (radiusValue > 100) {
      setDisplayRadius(radius); // Update display radius only when valid radius is set
      fetchcategory(radius); // Fetch category based on new radius
    } else {
       showToast("error",'Please enter a radius greater than 100 meters.');
    }
  };

  const fetchcategory = async (radiusValue: string) => {
    if (!location || !selectedCategory || !selectedOption) {
      showToast("error",'Location, category, and option are required to fetch data.');
      return;
    }

    const apiKey = 'a05f884d242f4a65acb30b198dad8375';
    const url = `https://api.geoapify.com/v2/places?categories=${selectedCategory}.${selectedOption}&filter=circle:${location.lng},${location.lat},${radiusValue}&bias=proximity:${location.lng},${location.lat}&limit=20&apiKey=${apiKey}`;

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(url);
      const data = response.data;

      if (!data.features || data.features.length === 0) {
        showToast("error",'No results found for the selected category and option in the specified radius.');
        setcategory([]);
        return;
      }

      const formattedData = data.features.map((feature: any) => ({
        name: feature.properties.name || 'Unknown Name',
        country: feature.properties.country || 'Unknown Country',
        country_code: feature.properties.country_code || 'Unknown Code',
        state: feature.properties.state || 'Unknown State',
        county: feature.properties.county || 'Unknown County',
        city: feature.properties.city || 'Unknown City',
        postcode: feature.properties.postcode || 'Unknown Postcode',
        suburb: feature.properties.suburb || 'Unknown Suburb',
        state_code: feature.properties.state_code || 'Unknown State Code',
        formatted: feature.properties.formatted || 'Unknown Address',
      }));

      setcategory(formattedData);
      showToast("success", "Data fetched successfully!");
    } catch (err) {
       showToast("error",'Failed to fetch  data. Please check  again  with large radius value .');
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location && selectedCategory && selectedOption) {
      fetchcategory(displayRadius); // Fetch category when category, option, or location changes
    }
  }, [location, selectedCategory, selectedOption, displayRadius]);

  if (loading) return <div className="text-center text-blue-400">Loading... Please wait while we fetch the data.</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  return (
    <>
    <div className='ml-5 mr-5'>
      <div className=" p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg mb-10">
  <div className="flex flex-col gap-6 md:flex-row md:gap-8 lg:gap-10">
    {/* Category Dropdown */}
    <div className="flex-1">
      <label className="block text-base md:text-lg font-medium mb-2 text-gray-700">
        Select Category
      </label>
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
      >
        <option value="" disabled>
          Select a category
        </option>
        {Object.keys(categories).map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>

    {/* Option Dropdown */}
    <div className="flex-1">
      <label className="block text-base md:text-lg font-medium mb-2 text-gray-700">
        Select Option
      </label>
      <select
        value={selectedOption}
        onChange={handleOptionChange}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
        disabled={!selectedCategory}
      >
        <option value="" disabled>
          Select an option
        </option>
        {categories[selectedCategory]?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>

  {/* Display Selected Option */}
  {selectedOption && (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-300 rounded-md text-sm md:text-base">
      <p className="text-base md:text-lg">
        <strong>Selected:</strong> {selectedCategory} -{' '}
        {categories[selectedCategory]?.find((o) => o.value === selectedOption)?.label}
      </p>
    </div>
  )}
</div>


      <div className="bg-gray-800 p-6 max-w-6xl mx-auto text-blue-400 mb-10 rounded-lg shadow-md "
      style={{ boxShadow: '0 10px 20px rgba(255, 255, 255, 0.7)' }}>
        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-4">
              <input
                type="number"
                placeholder="Enter radius (greater than 100)"
                value={radius}
                 onChange={(e) => handleChangeRadius((e.target.value))}
                className="p-2 border border-gray-300 rounded-md w-48 text-lg"
              />
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Set Radius
              </button>
            </div>
            {displayRadius && (
              <div className="mt-4 text-lg font-semibold">
                <strong className='text-white'>Radius set to: </strong>{displayRadius} meters
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl  text-yellow-500 font-bold mb-4">Location</h1>
            <p className='text-white'>Latitude: {location?.lat}</p>
            <p className='text-white'>Longitude: {location?.lng}</p>
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-4 text-white">Nearby {selectedOption}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {category.length === 0 ? (
                <p>Please select a valid category and option. || Please choose a  valid radius  value (greater than 1000 meter) </p>
              ) : (
                category.map((restaurant, index) => (
                  <div key={index} className="p-4 border border-gray-300 rounded-md">
                    <h2 className="text-xl font-semibold">{restaurant.name}</h2>
                    <ul className="text-sm text-white">
                      <li>{restaurant.formatted}</li>
                      <li>{restaurant.city}, {restaurant.state}</li>
                      <li>{restaurant.country}</li>
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default ApiPage;
