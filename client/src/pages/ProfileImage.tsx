import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchUserProfileImage, uploadUserProfileImage } from '../feature/auth/authActions';
import { RootState, AppDispatch } from '../app/store';
import { useDispatch } from 'react-redux';
import { api_url } from "../config/config";

const ProfileImagePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profileImage, status, error } = useSelector((state: RootState) => state.auth);
  
  const [isProfileModelOpen, setIsProfileModelOpen] = useState(false); // State to handle modal visibility
  const [imageFile, setImageFile] = useState<File | null>(null); // State to hold the selected image file
//   import { api_url } from "../config/config";

 
  // Fetch profile image when the component mounts
  useEffect(() => {
    dispatch(fetchUserProfileImage());
  }, [dispatch]);

  // Handle image file change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (imageFile) {
      const formData = new FormData();
      formData.append('profile_image', imageFile);
      await dispatch(uploadUserProfileImage(formData));
      setIsProfileModelOpen(false); // Close modal after upload
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg shadow-md">
      <div className="text-center">
        {profileImage ? (
          <>
            <img
              src={`${api_url}${profileImage}`}  // Concatenate the base URL with the relative image path
              alt="Profile"
              className="w-46 h-56 rounded-md mx-auto mb-6 "  style={{ boxShadow: '0 10px 20px rgba(255, 255, 255, 0.7)' }}
            />
            <button
              onClick={() => setIsProfileModelOpen(true)} // Open modal to update image
              className="px-1 py-2 bg-green-500 text-white rounded-md hover:bg-green-400 transition duration-200 ease-in-out"
            >
              Update Profile Image
            </button>
          </>
        ) : (
          <>
            <p className="mb-4 text-gray-700">No profile image uploaded yet.</p>
            <button
              onClick={() => setIsProfileModelOpen(true)} // Open modal to upload image
              className="px-2 py-2 bg-green-500 text-white rounded-md hover:bg-green-400 transition duration-200 ease-in-out"
            >
              Upload Profile Image
            </button>
          </>
        )}
      </div>

      {/* Modal for Image Upload */}
      {isProfileModelOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Upload a New Profile Image</h2>
            <form>
              <label htmlFor="profileImage" className="block text-gray-700 mb-2">Choose Image:</label>
              <input
                type="file"
                id="profileImage"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2"
              />
              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsProfileModelOpen(false)} // Close modal without uploading
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleImageUpload} // Submit the new image
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileImagePage;
