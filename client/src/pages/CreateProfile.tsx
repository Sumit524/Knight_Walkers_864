import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select, { MultiValue } from 'react-select';

import { useDispatch, useSelector } from "react-redux";
import { load_user, load_user_profile, UpdateProfile,saveUserData, Load_UserPreferences } from "../feature/auth/authActions";
import { AppDispatch, RootState } from "../app/store";
import { CreateProfile } from "../feature/auth/authActions";
import { UserPreferencesInterface } from '../feature/auth/types';

interface ProfileForm {
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;
  contact: string;
  address: string;
  about: string;
}

interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;
  contact: string;
  address: string;
  about: string;
}

const CreateUserProfile: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const {preferences, loading, isAuthenticated, user, profile } = useSelector((state: RootState) => state.auth);

  const [filteredProfile, setFilteredProfile] = useState<UserProfile | null>(null);
  const [uemail, setUemail] = useState<string>("");
  const [profileData, setProfileData] = useState<ProfileForm>({
    email: uemail,
    first_name: "",
    last_name: "",
    gender: "",
    dob: "",
    contact: "",
    address: "",
    about: "",
  });

      const [preferencesform, setPreferencesFormData] = useState<UserPreferencesInterface>({
         preferences: {
           music: [],
           food: [],
           vibe: [],
         },
       });


  const [editing, setEditing] = useState(false); // State to toggle between edit and view modes
  const [showpreferencesmodel, setShowPreferencesModel] = useState(false); // State to control modal visibility

// Handle change for multi-select fields
  const handlePreferenceSelectChange = (
    field: keyof UserPreferencesInterface['preferences'],
    selectedOptions: MultiValue<{ value: string; label: string }> | null
  ) => {
    setPreferencesFormData((prevData) => ({
      ...prevData,
      preferences: {
        ...prevData.preferences,
        [field]: selectedOptions ? selectedOptions.map((option) => option.value) : [],
      },
    }));
  };



   // Handle form submission
    const handlePreferencesSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      dispatch(saveUserData(preferencesform));
      setEditing(false); // Exit editing mode after saving
      setShowPreferencesModel(false); // Close the modal after saving
  
      // Show a pop-up message and refresh the page
      alert('Preferences updated successfully!');
      window.location.reload();
    };
  


    // Multi-select options
  const musicOptions = [
    { value: 'Jazz', label: 'Jazz' },
    { value: 'Rock', label: 'Rock' },
    { value: 'Pop', label: 'Pop' },
  ];

  const foodOptions = [
    { value: 'Italian', label: 'Italian' },
    { value: 'Mexican', label: 'Mexican' },
    { value: 'Indian', label: 'Indian' },
  ];

  const vibeOptions = [
    { value: 'Casual', label: 'Casual' },
    { value: 'Romantic', label: 'Romantic' },
    { value: 'Energetic', label: 'Energetic' },
  ];


  const id = user?.id;
  
    useEffect(() => {
      if (typeof id === 'number') {
        dispatch(Load_UserPreferences(id));
      }
    }, [dispatch, id]);

    const formatPreferences = (preferences: any,showUpdateButton: boolean) => {
      const { music, food, vibe } = preferences?.selected_categories?.preferences || {};
      return (
        <div className="mt-5">
          <h3 className="font-bold text-lg">Saved Preferences:</h3>
          <ul className="list-none p-0">
            <li>
              <strong>Music:</strong> {music?.length ? music.join(', ') : 'No preferences selected'}
            </li>
            <li>
              <strong>Food:</strong> {food?.length ? food.join(', ') : 'No preferences selected'}
            </li>
            <li>
              <strong>Vibe:</strong> {vibe?.length ? vibe.join(', ') : 'No preferences selected'}
            </li>
          </ul>
          {showUpdateButton && (
          <button
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => setShowPreferencesModel(true)}
          >
            Update Preferences
          </button>
        )}
        </div>
      );
    };




  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    dispatch(load_user());
    dispatch(load_user_profile());
  }, [dispatch]);

  useEffect(() => {
    if (user && Array.isArray(profile)) {
      const matchedProfile = profile.find((p: UserProfile) => p.email === user.email);
      setFilteredProfile(matchedProfile || null);
      setUemail(user?.email || "");
    }
  }, [user, profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profilePayload = { ...profileData, email: uemail };
    dispatch(CreateProfile(profilePayload));
    navigate("/profile");
  };



  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredProfile) {
      const profileUpdatePayload = { 
        id: filteredProfile.id,  
        email: uemail, 
        first_name: filteredProfile.first_name,
        last_name: filteredProfile.last_name,
        gender: filteredProfile.gender,
        contact: filteredProfile.contact,
        dob: filteredProfile.dob,
        address: filteredProfile.address,
        about: filteredProfile.about,
      };

      console.log("Sending update profile request with payload:", profileUpdatePayload);
       
      dispatch(UpdateProfile(profileUpdatePayload))
        .unwrap()
        .then((response) => {
          console.log("Profile updated successfully:", response);
          setShowUpdateModal(false);
          navigate("/profile");
        })
        .catch((error) => {
          console.error("Error updating profile:", error);
        });
    } else {
      console.error("Profile data is unavailable for update.");
    }
  };



  return (
    <div className="h-screen  flex p-8 gap-10  bg-yellow-400 grid grid-cols-2 gap-4 w-full">
    <div className=" bg-red-400 container  mx-auto  max-w-lg p-6  rounded-lg shadow-md">
      {filteredProfile ? (
        <div className="">
          <h1 className="text-3xl font-bold text-center mb-4">User Profile</h1>
          <ul className="space-y-2">
            <li><strong>Email:</strong> {filteredProfile.email}</li>
            <li><strong>ID:</strong> {filteredProfile.id}</li>
            <li><strong>First Name:</strong> {filteredProfile.first_name}</li>
            <li><strong>Last Name:</strong> {filteredProfile.last_name}</li>
            <li><strong>Gender:</strong> {filteredProfile.gender}</li>
            <li><strong>Contact:</strong> {filteredProfile.contact}</li>
            <li><strong>Date of Birth:</strong> {filteredProfile.dob}</li>
            <li><strong>Address:</strong> {filteredProfile.address}</li>
            <li><strong>About:</strong> {filteredProfile.about}</li>
          </ul>
          <button
            onClick={() => setShowUpdateModal(true)}
            className="w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition"
          >
            Update Profile
          </button>
        </div>
      ) : (
        <div className="p-4 sm:p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Create Your Profile</h1>
        <form 
          onSubmit={handleSubmit} 
          className="space-y-6 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-x-6"
        >
          {/* Email */}
          <div className="relative col-span-2">
            <input
              type="email"
              name="email"
              value={uemail}
              readOnly
              placeholder=" "
              className="peer w-full px-3 pt-6 pb-2 border rounded-md bg-gray-100 cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <label
              className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Email
            </label>
          </div>
      
          {/* First Name */}
          <div className="relative">
            <input
              type="text"
              name="first_name"
              value={profileData.first_name}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full px-3 pt-6 pb-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <label
              className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              First Name
            </label>
          </div>
      
          {/* Last Name */}
          <div className="relative">
            <input
              type="text"
              name="last_name"
              value={profileData.last_name}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full px-3 pt-6 pb-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <label
              className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Last Name
            </label>
          </div>
      
          {/* Age */}
          <div className="relative">
            <input
              type="date"
              name="dob"
              value={profileData.dob}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full px-3 pt-6 pb-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <label
              className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              dob
            </label>
          </div>
      
          {/* Gender */}
          <div className="relative">
            <select
              name="gender"
              value={profileData.gender}
              onChange={handleChange}
              className="peer w-full px-3 pt-6 pb-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="" disabled></option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <label
              className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Gender
            </label>
          </div>
      
          {/* Contact */}
          <div className="relative">
            <input
              type="tel"
              name="contact"
              value={profileData.contact}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full px-3 pt-6 pb-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <label
              className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Contact
            </label>
          </div>
      
          {/* Address */}
          <div className="relative col-span-2">
            <input
              type="text"
              name="address"
              value={profileData.address}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full px-3 pt-6 pb-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <label
              className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Address
            </label>
          </div>
      
          {/* About */}
          <div className="relative col-span-2">
            <textarea
              name="about"
              value={profileData.about}
              onChange={handleChange}
              placeholder=" "
              // rows="4"
              className="peer w-full px-3 pt-6 pb-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            ></textarea>
            <label
              className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              About Yourself
            </label>
          </div>
      
          {/* Submit */}
          <button
            type="submit"
            className="col-span-2 w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
          >
            Create Profile
          </button>
        </form>
      </div>
      
      )}

      {/* Update Profile Modal */}
      {showUpdateModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-semibold mb-6 text-center">Update Profile</h2>
      <form onSubmit={handleUpdate} className="space-y-6">
        {/* First Name */}
        <div className="flex gap-6">
        <div className="relative">
          <input
            type="text"
            name="first_name"
            value={filteredProfile?.first_name || ""}
            onChange={(e) => setFilteredProfile({ ...filteredProfile!, first_name: e.target.value })}
            placeholder=" "
            className="peer w-full px-3 pt-6 pb-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <label
            htmlFor="first_name"
            className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-500"
          >
            First Name
          </label>
        </div>

        {/* Last Name */}
        <div className="relative">
          <input
            type="text"
            name="last_name"
            value={filteredProfile?.last_name || ""}
            onChange={(e) => setFilteredProfile({ ...filteredProfile!, last_name: e.target.value })}
            placeholder=" "
            className="peer w-full px-3 pt-6 pb-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <label
            htmlFor="last_name"
            className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-500"
          >
            Last Name
          </label>
        </div>
        </div>

        {/* Age */}


        <div className="flex gap-6 ">
        
        {/* Contact */}
        <div className="relative">
          <input
            type="tel"
            name="contact"
            value={filteredProfile?.contact || ""}
            onChange={(e) => setFilteredProfile({ ...filteredProfile!, contact: e.target.value })}
            placeholder=" "
            className="peer w-full px-3 pt-6 pb-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <label
            htmlFor="contact"
            className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-500"
          >
            Contact
          </label>
        </div>

        </div>
        {/* About */}

        <div className="relative">
          <textarea
            name="address"
            value={filteredProfile?.address || ""}
            onChange={(e) => setFilteredProfile({ ...filteredProfile!, address: e.target.value })}
            placeholder=" "
            className="peer w-full px-3 pt-6 pb-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
         
          ></textarea>
          <label
            htmlFor="address"
            className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-500"
          >
            Address
          </label>
        </div>




        <div className="relative">
          <textarea
            name="about"
            value={filteredProfile?.about || ""}
            onChange={(e) => setFilteredProfile({ ...filteredProfile!, about: e.target.value })}
            placeholder=" "
            className="peer w-full px-3 pt-6 pb-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
         
          ></textarea>
          <label
            htmlFor="about"
            className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-500"
          >
            About
          </label>
        </div>

        {/* Submit and Cancel Buttons */}
        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition"
        >
          Update Profile
        </button>
        <button
          type="button"
          onClick={() => setShowUpdateModal(false)}
          className="w-full py-2 mt-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition"
        >
          Cancel
        </button>
      </form>
    </div>
  </div>
)}

    </div>


























    <div className="p-4">
      {preferences && !editing ? (
        formatPreferences(preferences,true) // Show saved preferences with Update button
      ) : (
        <form onSubmit={handlePreferencesSubmit} className="space-y-4">
          <h1 className="text-xl font-semibold">Select your preferences</h1>

          <div>
            <label htmlFor="music" className="block text-lg">Music Preferences:</label>
            <Select
              isMulti
              id="music"
              options={musicOptions}
              onChange={(selected) => handlePreferenceSelectChange('music', selected)}
              value={musicOptions.filter((option) =>
                preferencesform.preferences.music.includes(option.value)
              )}
              className="mt-2"
            />
          </div>

          <div>
            <label htmlFor="food" className="block text-lg">Food Preferences:</label>
            <Select
              isMulti
              id="food"
              options={foodOptions}
              onChange={(selected) => handlePreferenceSelectChange('food', selected)}
              value={foodOptions.filter((option) =>
                preferencesform.preferences.food.includes(option.value)
              )}
              className="mt-2"
            />
          </div>

          <div>
            <label htmlFor="vibe" className="block text-lg">Vibe Preferences:</label>
            <Select
              isMulti
              id="vibe"
              options={vibeOptions}
              onChange={(selected) => handlePreferenceSelectChange('vibe', selected)}
              value={vibeOptions.filter((option) =>
                preferencesform.preferences.vibe.includes(option.value)
              )}
              className="mt-2"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-500 text-white rounded"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Submit'}
          </button>
        </form>
      )}

      {/* Modal for updating preferences */}
      {showpreferencesmodel && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Update Your Preferences</h2>
           
            {preferences && 
        formatPreferences(preferences,false)  }
           
            <form onSubmit={handlePreferencesSubmit} className="space-y-4">
              <div>
                <label htmlFor="music" className="block text-lg">Music Preferences:</label>
                <Select
                  isMulti
                  id="music"
                  options={musicOptions}
                  onChange={(selected) => handlePreferenceSelectChange('music', selected)}
                  value={musicOptions.filter((option) =>
                    preferencesform.preferences.music.includes(option.value)
                  )}
                  className="mt-2"
                />
              </div>

              <div>
                <label htmlFor="food" className="block text-lg">Food Preferences:</label>
                <Select
                  isMulti
                  id="food"
                  options={foodOptions}
                  onChange={(selected) => handlePreferenceSelectChange('food', selected)}
                  value={foodOptions.filter((option) =>
                    preferencesform.preferences.food.includes(option.value)
                  )}
                  className="mt-2"
                />
              </div>

              <div>
                <label htmlFor="vibe" className="block text-lg">Vibe Preferences:</label>
                <Select
                  isMulti
                  id="vibe"
                  options={vibeOptions}
                  onChange={(selected) => handlePreferenceSelectChange('vibe', selected)}
                  value={vibeOptions.filter((option) =>
                    preferencesform.preferences.vibe.includes(option.value)
                  )}
                  className="mt-2"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Update Preferences'}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={() => setShowPreferencesModel(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>




























    </div>
  );
};

export default CreateUserProfile;
