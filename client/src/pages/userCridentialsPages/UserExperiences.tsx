import React, { useEffect, useState } from "react";
import { showToast } from "../others/ToastUtil";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { CreateUserExperience, GetUserExperience } from "../../feature/auth/authActions";
import bgImage from "../../images/bgc-2.gif";

interface UserExperience {
  category: string;
  place: string;
  message_description: string;
  stars: number;
}

interface UserGetExperience {
  category: string;
  place: string;
  message_description: string;
  stars: number;
  time: string;
  message_id: string;
}

const UserExperience: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { experience, loading, error } = useSelector((state: RootState) => state.auth);

  const [Uexperience, setExperience] = useState<UserExperience>({
    category: "",
    place: "",
    message_description: "",
    stars: 1,
  });

  const [showModal, setShowModal] = useState(false); // State to manage modal visibility

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
      const resultAction = await dispatch(CreateUserExperience(experiencePayload));
      if (CreateUserExperience.fulfilled.match(resultAction)) {
        showToast("success", "Experience created successfully!");
         // Show modal after successful experience creation
        setShowModal(false); // Close the modal
      } else {
        showToast("error", "Failed to create experience. Please try again.");
      }
    } catch (error) {
      showToast("error", "Unexpected error occurred.");
    }
  };

  useEffect(() => {
    if (!loading) {
      dispatch(GetUserExperience());
    }
  }, [dispatch, loading]);

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-4xl w-10/12">
        <button
          type="button"
          className="mb-2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-300"
          onClick={() => setShowModal(true)}
        >
          +Add Experience
        </button>

        {/* Experiences List */}
        <div
          className="align-center justify-center grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 rounded-xl bg-yellow-200 p-5 overflow-auto"
          style={{
            boxShadow: "0 1px 20px rgba(255, 255, 255, 0.7)",
            height: "78vh",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {Array.isArray(experience) && experience.length > 0 ? (
            experience.map((exp: UserGetExperience, index: number) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105 border-black border-2"
              >
                <p className="text-gray-600 font-semibold text-gray-800 mb-2">
                  <strong>No:</strong> {exp.message_id}
                </p>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{exp.category}</h3>
                <p className="text-gray-600">
                  <strong>Place:</strong> {exp.place}
                </p>
                <p className="text-gray-600">
                  <strong>Date:</strong> {new Date(exp.time).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <strong>Time:</strong> {new Date(exp.time).toLocaleTimeString()}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Description:</strong> {exp.message_description}
                </p>
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }, (_, idx) => (
                    <span
                      key={idx}
                      className={`text-2xl ${idx < exp.stars ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      {idx < exp.stars ? '★' : '☆'}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-black text-2xl ">
              No experiences available. Please create one to get started.
            </p>
          )}
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 bg-black">
          <div className=" p-6 rounded-lg w-1/3 text-center ">
          <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Share Your Experience
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
              className="text-2xl text-gray-700 font-bold hover:text-blue-500 transition-all duration-300  rounded-full border-2 border-gray-300 hover:border-blue-500"
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
              className="text-2xl text-gray-700 font-bold hover:text-blue-500 transition-all duration-300 rounded-full border-2 border-gray-300 hover:border-blue-500"
              onClick={() =>
                Uexperience.stars < 5 && setExperience({ ...Uexperience, stars: Uexperience.stars + 1 })
              }
            >
              +
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center gap-5 ">
        <div className="flex-1">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600 transition duration-300"
          >
            Submit 
          </button>
          </div>

          <div className="flex-1  text-right">
          <button
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            </div>
        </div>
        </form>

            
          </div>
        </div>
      )}
    </div>
  );
};

export default UserExperience;
