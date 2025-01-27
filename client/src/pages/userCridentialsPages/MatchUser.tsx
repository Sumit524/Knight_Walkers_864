import React, { useState } from "react";
import { showToast } from "../others/ToastUtil"; // Make sure the ToastUtil is implemented properly

interface UserExperience {
  category: string;
  place: string;
  message_description: string;
  stars: number;
}

const UserExperience: React.FC = () => {
  // Initialize the state for the experience object
  const [experience, setExperience] = useState<UserExperience>({
    category: "",
    place: "",
    message_description: "",
    stars: 5,
  });

  // Handle input changes and update the corresponding field in the state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExperience({
      ...experience,
      [name]: name === "stars" ? Number(value) : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const experiencePayload = { ...experience };
    console.log("Sending profile payload: -> ", experiencePayload);

    // Dispatch the action to add experience (assuming you have a Redux action called AddExperience)
    // dispatch(AddExperience(experience));

    showToast("success", "Experience Created successfully");
    // Uncomment the next line if you want to reload the page after submission.
    // window.location.reload(); 
    // navigate("/profile"); // If you want to redirect to the profile page
  };

  // Star Rating Icons
  const starIcons = Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      className={`text-xl cursor-pointer ${index < experience.stars ? 'text-yellow-500' : 'text-gray-300'}`}
      onClick={() => setExperience({ ...experience, stars: index + 1 })}
    >
      {index < experience.stars ? '★' : '☆'}
    </span>
  ));

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Create Your Experience</h2>

        {/* Category Input */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={experience.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter category"
            required
          />
        </div>

        {/* Place Input */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="place">Place</label>
          <input
            type="text"
            id="place"
            name="place"
            value={experience.place}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter place"
            required
          />
        </div>

        {/* Description Input */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="message_description">Description</label>
          <textarea
            id="message_description"
            name="message_description"
            value={experience.message_description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your message description"
            required
          />
        </div>

        <div className="mb-4">
  <label className="block text-gray-700 mb-2" htmlFor="stars">Rating</label>
  <div className="flex items-center space-x-4 mb-4">
    <button
      type="button"
      className="text-2xl text-gray-800 hover:text-blue-500 transition-all duration-300 p-2 rounded-full border-2 border-gray-300 hover:border-blue-500"
      onClick={() => experience.stars > 1 && setExperience({ ...experience, stars: experience.stars - 1 })}
    >
      −
    </button>
    <div className="flex space-x-1">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={`text-4xl cursor-pointer transition-all duration-300 transform ${
            index < experience.stars ? 'text-yellow-400 scale-110' : 'text-gray-500'
          } hover:text-yellow-500 hover:scale-125`}
          onClick={() => setExperience({ ...experience, stars: index + 1 })}
        >
          {index < experience.stars ? '★' : '☆'}
        </span>
      ))}
    </div>
    <button
      type="button"
      className="text-2xl text-gray-700 text-bold hover:text-blue-500 transition-all duration-300 p-2 rounded-full border-2 border-gray-300 hover:border-blue-500"
      onClick={() => experience.stars < 5 && setExperience({ ...experience, stars: experience.stars + 1 })}
    >
      +
    </button>
  </div>
</div>


        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded-md w-full hover:bg-blue-600 transition duration-300"
          >
            Submit Experience
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserExperience;
