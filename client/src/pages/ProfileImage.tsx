import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfileImage, uploadUserProfileImage } from '../feature/auth/authActions';
import { RootState, AppDispatch } from '../app/store';
import { api_url } from "../config/config";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from "./ToastUtil"; 

const ProfileImagePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profileImage, status, error } = useSelector((state: RootState) => state.auth);

  const [isProfileModelOpen, setIsProfileModelOpen] = useState(false); // Modal visibility state
  const [imageFile, setImageFile] = useState<File | null>(null); // Selected image file state

  // Fetch profile image when the component mounts
  useEffect(() => {
    dispatch(fetchUserProfileImage())
      .unwrap()
      // .then(() => toast.info("Fetched profile image successfully!", { autoClose: 2000 }))
      .catch(() =>  showToast("error", "Failed to fetch profile image."));
             
      
  }, [dispatch]);

  // Handle image file selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
     
    } else {
      // toast.warn("No file selected.", { autoClose: 2000 });
      showToast("error", "No file selected")
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (imageFile) {
      const formData = new FormData();
      formData.append('profile_image', imageFile);
      try {
        await dispatch(uploadUserProfileImage(formData)).unwrap();
                showToast("success", "Profile image updated successfully");
        
        // toast.success("Profile image updated successfully!", { autoClose: 3000 });
        setIsProfileModelOpen(false); // Close the modal
      } catch (uploadError) {
        showToast("error", "Failed to upload profile image. Please try again.");

        // toast.error("Failed to upload profile image. Please try again.", { autoClose: 3000 });
      }
    } else {
      showToast("error", "No image selected. Please choose an image");
      
      // toast.warn("No image selected. Please choose an image.", { autoClose: 3000 });
    }
  };

  // Render loading state
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  // Render error state
  if (error) {
    toast.error(`Error: ${error}`, { autoClose: 4000 });
    return <p>Error: {error}</p>;
  }

  return (
    <div className="max-w-md mx-auto bg-yellow-200 p-6 rounded-lg shadow-md "  style={{ boxShadow: '0 10px 20px rgba(255, 255, 255, 0.7)' }}>
      <div className="text-center  bg-transparent ">
        {profileImage ? (
          <>
                    <h1 className=" text-2xl  text-center mb-4  text-red-600 ">User Profile Image</h1>

            <img
              src={`${api_url}${profileImage}`} // Concatenate the base URL with the image path
              alt="Profile"
              className="w-46 h-56 rounded-md mx-auto mb-6"
              style={{ boxShadow: '0 2px 5px rgba(12, 12, 12, 0.7)' }}
            />
            <button
              onClick={() => setIsProfileModelOpen(true)} // Open modal to update image
              className="px-1 py-2 bg-green-600 text-black rounded-md hover:bg-green-500 transition duration-200 ease-in-out"
            >
              Update Profile Image
            </button>
          </>
        ) : (
          <>
            <p className="mb-4 text-gray-700">No profile image uploaded yet.</p>
            <button
              onClick={() => setIsProfileModelOpen(true)} // Open modal to upload image
              className="px-2 py-2 bg-green-600 text-black rounded-md hover:bg-green-500 transition duration-200 ease-in-out"
            >
              Upload Profile Image
            </button>
          </>
        )}
      </div>

      {/* Modal for Image Upload */}
      {isProfileModelOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Upload a New Profile Image</h2>
            <form>
              <label htmlFor="profileImage" className="block text-gray-700 mb-2">
                Choose Image:
              </label>
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
                  className="px-4 py-2 bg-red-500 text-black rounded-md hover:bg-red-400 focus:outline-none "
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleImageUpload} // Submit the new image
                  className="px-4 py-2 bg-green-600 text-black rounded-md hover:bg-green-500 focus:outline-none"
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
