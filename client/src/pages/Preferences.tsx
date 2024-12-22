import React, { useState, useEffect } from 'react';
import Select, { MultiValue } from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { saveUserData, load_user, Load_UserPreferences } from '../feature/auth/authActions';
import { UserPreferencesInterface } from '../feature/auth/types';

const PreferencesForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, preferences, loading, error, success } = useSelector((state: RootState) => state.auth);

  // Initialize preferencesform with the correct type
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

  // Load user data on component mount
  useEffect(() => {
    dispatch(load_user());
  }, [dispatch]);

  const id = user?.id;

  useEffect(() => {
    if (typeof id === 'number') {
      dispatch(Load_UserPreferences(id));
    }
  }, [dispatch, id]);

  // Function to format preferences for display
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
          className="mt-5 px-2 py-2 bg-green-500 text-white rounded-md hover:bg-green-400 transition duration-200 ease-in-out"
          onClick={() => setShowPreferencesModel(true)}
        >
          Update Preferences
        </button>
      )}
      </div>
    );
  };

  return (
   
   
      //  <div className=" flex justify-center items-center h-full ">
       <div className="bg-yellow-200 container mx-auto max-w-lg p-6 rounded-lg shadow-md mb-20"style={{ boxShadow: '0 10px 20px rgba(255, 255, 255, 0.7)' }}>
         {preferences && !editing ? (
           formatPreferences(preferences,true) // Show saved preferences with Update button
         ) : (
           <form onSubmit={handlePreferencesSubmit} className="space-y-4">
             <h1 className="text-xl font-semibold text-red-600">Select your preferences</h1>
   
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
               className="p-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-500 transition"
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
               <h2 className="text-xl font-semibold mb-4 text-red-600">Update Your Preferences</h2>
              
               {preferences && 
           formatPreferences(preferences,false)  }
              
               <form onSubmit={handlePreferencesSubmit} className="space-y-4 mt-3 ">
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
                     className="p-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-500 transition"
                     disabled={loading}
                   >
                     {loading ? 'Saving...' : 'Update Preferences'}
                   </button>
                   <button
                     type="button"
                     className="px-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-400 transition duration-200 ease-in-out"
   
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
    // </div>
  );
};

export default PreferencesForm;
