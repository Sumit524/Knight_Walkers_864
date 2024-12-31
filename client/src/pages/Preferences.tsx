import React, { useState, useEffect } from 'react';
import Select, { MultiValue } from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { saveUserData, load_user, Load_UserPreferences } from '../feature/auth/authActions';
import { UserPreferencesInterface } from '../feature/auth/types';
import { toast, ToastContainer } from 'react-toastify';
import { showToast } from "./ToastUtil"; 

import 'react-toastify/dist/ReactToastify.css';
import {
  accommodation,
  activity,
  catering,
  commercial,
  entertainment,
  healthcare,
  public_transport,
  sport,
  tourism,
} from './preferencesOptions';

const PreferencesForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, preferences, loading } = useSelector((state: RootState) => state.auth);

  const [preferencesFormData, setPreferencesFormData] = useState<UserPreferencesInterface>({
    preferences: {
      accommodation: [],
      activity: [],
      commercial: [],
      catering: [],
      entertainment: [],
      tourism: [],
      sport: [],
      public_transport: [],
      healthcare: [],
    },
  });

  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

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

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    // showToast("success", "Preferences updated successfully");
    e.preventDefault();
    await dispatch(saveUserData(preferencesFormData));
    setShowPreferencesModal(false);
   
  };

  useEffect(() => {
    dispatch(load_user());
  }, [dispatch]);

  const id = user?.id;

  useEffect(() => {
    if (typeof id === 'number') {
      dispatch(Load_UserPreferences(id));
    }
  }, [dispatch, id]);

  // Set the initial preferences form data when preferences are loaded
  useEffect(() => {
    if (preferences) {
      setPreferencesFormData((prevData) => ({
        ...prevData,
        preferences: {
          accommodation: preferences.selected_categories.preferences.accommodation || [],
          activity: preferences.selected_categories.preferences.activity || [],
          commercial: preferences.selected_categories.preferences.commercial || [],
          catering: preferences.selected_categories.preferences.catering || [],
          entertainment: preferences.selected_categories.preferences.entertainment || [],
          tourism: preferences.selected_categories.preferences.tourism || [],
          sport: preferences.selected_categories.preferences.sport || [],
          public_transport: preferences.selected_categories.preferences.public_transport || [],
          healthcare: preferences.selected_categories.preferences.healthcare || [],
        },
      }));
    }
  }, [preferences]);

  const formatPreferences = (preferences: any, showUpdateButton: boolean) => {
    const {
      accommodation,
      activity,
      commercial,
      catering,
      entertainment,
      tourism,
      public_transport,
      healthcare,
      sport,
    } = preferences?.selected_categories?.preferences || {};
    return (
      <div className="">
                    <h1 className=" text-2xl  text-center mb-4  text-red-600 ">User Saved Preferences</h1>
        
        <ul className="list-none p-0">
          {Object.entries({
            Accommodation: accommodation,
            Activity: activity,
            Commercial: commercial,
            Catering: catering,
            Entertainment: entertainment,
            Tourism: tourism,
            'Public Transport': public_transport,
            Healthcare: healthcare,
            Sport : sport,
          }).map(([key, value]) => (
            <li key={key}>
              <strong className="text-red-700">{key}: </strong>
              {value?.length ? value.join(', ') : 'N/A'}
            </li>
          ))}
        </ul>
        {showUpdateButton && (
          <button
            className="mt-5 px-2 py-2 bg-green-600 text-black rounded-md hover:bg-green-500 transition duration-200 ease-in-out"
            onClick={() => setShowPreferencesModal(true)}
          >
            Update Preferences
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      className="bg-yellow-200 container mx-auto max-w-lg p-6 rounded-lg shadow-md "
      style={{ boxShadow: '0 10px 20px rgba(255, 255, 255, 0.7)' }}
    >
      <ToastContainer />
      {preferences && !showPreferencesModal ? (
        formatPreferences(preferences, true)
      ) : (
        <div>
          <h1>Please Choose Your Preferences. It will take just a minute.</h1>
          <button
            type="button"
            className="mt-3 p-2 bg-green-600 text-black font-semibold rounded-md hover:bg-green-500 transition"
            onClick={() => setShowPreferencesModal(true)}
          >
            Set Your Preferences
          </button>
        </div>
      )}
{showPreferencesModal && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-60 flex justify-center items-center z-50 p-2">
    <div
      className="bg-yellow-200 p-5 rounded-lg w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-3xl max-h-[80vh] overflow-y-auto"
     
    >
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-red-600 text-center sm:text-left">
        Update Your Preferences
      </h2>

      <form onSubmit={handlePreferencesSubmit} className=" gap-6 grid grid-cols-1 sm:grid-cols-2">
        {Object.entries({
          accommodation,
          activity,
          commercial,
          catering,
          entertainment,
          tourism,
          public_transport,
          healthcare,
          sport,
        }).map(([key, options]) => (
          <div key={key}>
            <label htmlFor={key} className="block text-base sm:text-lg capitalize">
              {key.replace('_', ' ')} Preferences:
            </label>
            <Select 
              isMulti
              id={key}
              options={options}
              onChange={(selected) =>
                handlePreferenceSelectChange(key as keyof UserPreferencesInterface['preferences'], selected)
              }
              value={options.filter((option) =>
                preferencesFormData.preferences[key as keyof UserPreferencesInterface['preferences']].includes(option.value)
              )}
              className="mt-2 "
            />
          </div>
        ))}
        <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row justify-between gap-2">
          <button
            type="submit"
            className="p-2 bg-green-600 text-black font-semibold rounded-md hover:bg-green-500 transition"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Update Preferences'}
          </button>
          <button
            type="button"
            className="p-2 bg-red-500 rounded-md text-black hover:bg-red-400 transition duration-200 ease-in-out"
            onClick={() => setShowPreferencesModal(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}


    </div>
  );
};

export default PreferencesForm;
