import React, { useEffect, useState } from "react";
import { showToast } from "../others/ToastUtil";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { CreateUserExperience, GetUserExperience } from "../../feature/auth/authActions";

interface UserExperience {
  category: string;
  place: string;
  message_description: string;
  stars: number;
}
const experience: UserExperience[] = []; // Example initialization

const UserExperience: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { experience, loading, error } = useSelector((state: RootState) => state.auth);

  const [Uexperience, setExperience] = useState<UserExperience>({
    category: "",
    place: "",
    message_description: "",
    stars: 1,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setExperience({
      ...Uexperience,
      [name]: name === "stars" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const experiencePayload = { ...Uexperience };
      console.log("Submitting experience payload: ", experiencePayload);

      const resultAction = await dispatch(CreateUserExperience(experiencePayload));
      if (CreateUserExperience.fulfilled.match(resultAction)) {
        showToast("success", "Experience created successfully!");
      } else {
        showToast("error", "Failed to create experience. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting experience: ", error);
      showToast("error", "Unexpected error occurred.");
    }
  };

  useEffect(() => {
    if (!loading) {
      dispatch(GetUserExperience());
      console.log("Fetching user experience data...");
    }
  }, [dispatch, loading]); // Only re-run when `dispatch` or `loading` changes

  useEffect(() => {
    if (experience) {
      console.log("Fetched experience: ", experience);
    }
    if (error) {
      console.log("Error fetching experience: ", error);
    }
  }, [experience, error]); // Log updates separately when `experience` or `error` changes

  return (
    <div className=" justify-center items-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">



{Array.isArray(experience) && experience.map((exp: UserExperience, index: number) => (
  <div key={index} className="p-4 border rounded-md shadow-md mb-4">
    <h3 className="text-xl font-semibold">{exp.category}</h3>
    <p><strong>Place:</strong> {exp.place}</p>
    <p><strong>Description:</strong> {exp.message_description}</p>
   

    <div className="flex space-x-1">
              {Array.from({ length: 5 }, (_, index) => (
                <span
                  key={index}
                  className={`text-2xl  ${index < exp.stars ? 'text-yellow-500 scale-110' : 'text-gray-500'} `}
                  onClick={() => setExperience({ ...exp, stars: index + 1 })}
                >
                  {index < exp.stars ? '★' : '☆'}
                </span>
              ))}
            </div>




  </div>
))}

{!Array.isArray(experience) && (
  <p className="text-center text-gray-700">
    No experiences available. Please create one to get started.
  </p>
)}



      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Create Your Experience
        </h2>

        {/* Category Input */}
        <div className="mb-4 relative w-full">
          <label className="absolute -top-2 left-2 text-sm bg-white px-1 text-gray-600" htmlFor="category">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={Uexperience.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter category"
            required
          />
        </div>

        {/* Place Input */}
        <div className="mb-4 relative w-full">
          <label className="absolute -top-2 left-2 text-sm bg-white px-1 text-gray-600" htmlFor="place">
            Place
          </label>
          <input
            type="text"
            id="place"
            name="place"
            value={Uexperience.place}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter place"
            required
          />
        </div>

        {/* Description Input */}
        <div className="mb-4 relative w-full">
          <label className="absolute -top-2 left-2 text-sm bg-white px-1 text-gray-600 font-normal" htmlFor="message_description">
            Description
          </label>
          <textarea
            id="message_description"
            name="message_description"
            value={Uexperience.message_description}
            onChange={handleChange}
            className="w-full p-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your message description"
            required
          />
        </div>

        {/* Stars Rating Input */}
        <div className="flex flex-col items-center space-y-1 mb-5">
          <div className="border-2 border-gray-500 rounded-lg p-2 flex items-center justify-between space-x-4">
            {/* Decrement Button */}
            <button
              type="button"
              className="text-2xl text-gray-700 font-bold hover:text-blue-500 transition-all duration-300 p-2 rounded-full border-2 border-gray-300 hover:border-blue-500"
              onClick={() =>
                Uexperience.stars > 1 && setExperience({ ...Uexperience, stars: Uexperience.stars - 1 })
              }
            >
              −
            </button>

            {/* Stars Display */}
            <div className="flex space-x-1">
              {Array.from({ length: 5 }, (_, index) => (
                <span
                  key={index}
                  className={`text-4xl cursor-pointer transition-all duration-300 transform ${index < Uexperience.stars ? 'text-yellow-400 scale-110' : 'text-gray-500'} hover:text-yellow-500 hover:scale-125`}
                  onClick={() => setExperience({ ...Uexperience, stars: index + 1 })}
                >
                  {index < Uexperience.stars ? '★' : '☆'}
                </span>
              ))}
            </div>

            {/* Increment Button */}
            <button
              type="button"
              className="text-2xl text-gray-700 font-bold hover:text-blue-500 transition-all duration-300 p-2 rounded-full border-2 border-gray-300 hover:border-blue-500"
              onClick={() =>
                Uexperience.stars < 5 && setExperience({ ...Uexperience, stars: Uexperience.stars + 1 })
              }
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
