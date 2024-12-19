import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { load_user, load_user_profile, UpdateProfile } from "../feature/auth/authActions";
import { AppDispatch, RootState } from "../app/store";
import { CreateProfile } from "../feature/auth/authActions";

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
  const { isAuthenticated, user, profile } = useSelector((state: RootState) => state.auth);

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
    <div className="container mx-auto mt-12 max-w-lg p-6 bg-white rounded-lg shadow-md">
      {filteredProfile ? (
        <div>
          <h1 className="text-3xl font-bold text-center mb-4">User Profile</h1>
          <ul className="space-y-2">
            <li><strong>Email:</strong> {filteredProfile.email}</li>
            <li><strong>ID:</strong> {filteredProfile.id}</li>
            <li><strong>First Name:</strong> {filteredProfile.first_name}</li>
            <li><strong>Last Name:</strong> {filteredProfile.last_name}</li>
            <li><strong>Gender:</strong> {filteredProfile.gender}</li>
            <li><strong>Contact:</strong> {filteredProfile.contact}</li>
            <li><strong>Age:</strong> {filteredProfile.dob}</li>
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

        {/* Age */}
        <div className="relative">
          <input
            type="date"
            name="age"
            value={filteredProfile?.dob || 0}
            onChange={(e) => setFilteredProfile({ ...filteredProfile!, dob: (e.target.value) })}
            placeholder=" "
            className="peer w-full px-3 pt-6 pb-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <label
            htmlFor="age"
            className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-500"
          >
            Age
          </label>
        </div>

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
  );
};

export default CreateUserProfile;
