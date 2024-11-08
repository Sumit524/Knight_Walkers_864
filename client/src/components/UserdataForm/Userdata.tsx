import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  profile_image: string | File | null; // Allow null values
  date_of_birth: string;
  gender: string;
  full_address: string;
  contact_number: string;
  bio: string;
}

function AddUserForm() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({
    id: 0,
    first_name: '',
    last_name: '',
    profile_image: '',
    date_of_birth: '',
    gender: '',
    full_address: '',
    contact_number: '',
    bio: ''
  });
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/userprofiledata/userdata/');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setErrorMessage('Failed to fetch users.');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setNewUser((prevState) => ({
      ...prevState,
      profile_image: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('first_name', newUser.first_name);
    formData.append('last_name', newUser.last_name);
    if (newUser.profile_image) formData.append('profile_image', newUser.profile_image as Blob);
    formData.append('date_of_birth', newUser.date_of_birth);
    formData.append('gender', newUser.gender);
    formData.append('full_address', newUser.full_address);
    formData.append('contact_number', newUser.contact_number);
    formData.append('bio', newUser.bio);

    const url = isUpdating
      ? `http://localhost:8000/userprofiledata/userdata/${newUser.id}/`
      : 'http://localhost:8000/userprofiledata/userdata/';

    try {
      const response = await axios({
        method: isUpdating ? 'put' : 'post',
        url: url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data' // Ensure the request is sent as multipart/form-data
        }
      });
      console.log(isUpdating ? 'User updated:' : 'User added:', response.data);
      setShowForm(false);
      setIsUpdating(false);
      resetForm();
      fetchUsers(); // Refresh user list after adding/updating
    } catch (error: any) {
      console.error('Error details:', error.response ? error.response.data : error);
      setErrorMessage('An error occurred: ' + (error.response ? JSON.stringify(error.response.data) : 'Unknown error'));
    }
  };

  const resetForm = () => {
    setNewUser({
      id: 0,
      first_name: '',
      last_name: '',
      profile_image: '',
      date_of_birth: '',
      gender: '',
      full_address: '',
      contact_number: '',
      bio: ''
    });
  };

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) setIsUpdating(false);
  };

  const loadUserForUpdate = (user: User) => {
    setNewUser(user);
    setIsUpdating(true);
    setShowForm(true);
    setImagePreview(typeof user.profile_image === 'string' ? user.profile_image : null);
  };

  const handleCancel = () => {
    resetForm();  // Reset form fields
    setShowForm(false);  // Close the form
    setIsUpdating(false); // Reset updating flag
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{isUpdating ? 'Update User' : 'Add New User'}</h1>

      <button
        onClick={toggleForm}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {showForm ? 'Cancel' : 'Add New User'}
      </button>

      {errorMessage && (
        <div className="text-red-500 mt-4">
          {errorMessage}
        </div>
      )}

      {/* Modal / Popup */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name and Last Name in the same row */}
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={newUser.first_name}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded"
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={newUser.last_name}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              {/* Date of Birth and Age in the same row */}
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={newUser.date_of_birth}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded"
                  />
                </div>
                <div>
                 
                  <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                  <input
                    type="file"
                    name="profile_image"
                    onChange={handleFileChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded"
                  />
                </div>
              </div>

              {/* Contact Number and Gender in the same row */}
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    type="text"
                    name="contact_number"
                    value={newUser.contact_number}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded"
                    placeholder="Enter contact number"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={newUser.gender}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                    <option value="N">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Full Address and Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Address</label>
                <textarea
                  name="full_address"
                  value={newUser.full_address}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  placeholder="Enter full address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  name="bio"
                  value={newUser.bio}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  placeholder="Enter bio"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {isUpdating ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold mb-4">User List</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id} className="flex justify-between items-center mb-2">
              <span>{user.first_name} {user.last_name}</span>
              <button
                onClick={() => loadUserForUpdate(user)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AddUserForm;
