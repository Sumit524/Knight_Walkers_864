import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";

type PreferenceOptions = {
  venue_types: { value: string; label: string }[];
  ambiance_preferences: { value: string; label: string }[];
  favorite_music_genres: { value: string; label: string }[];
  event_interests: { value: string; label: string }[];
  pre_event_activities: { value: string; label: string }[];
  dietary_preferences: { value: string; label: string }[];
  drink_preferences: { value: string; label: string }[];
  social_vibe: { value: string; label: string }[];
  decor_preferences: { value: string; label: string }[];
};

const preferenceOptions: PreferenceOptions = {
  venue_types: [
    { value: "cafes", label: "Cafes" },
    { value: "bars", label: "Bars" },
    { value: "parks", label: "Parks" },
  ],
  ambiance_preferences: [
    { value: "music-themed", label: "Music-themed" },
    { value: "graffiti-filled", label: "Graffiti-filled" },
  ],
  favorite_music_genres: [
    { value: "rock", label: "Rock" },
    { value: "jazz", label: "Jazz" },
    { value: "indie", label: "Indie" },
  ],
  event_interests: [
    { value: "concerts", label: "Concerts" },
    { value: "festivals", label: "Festivals" },
  ],
  pre_event_activities: [
    { value: "coffee", label: "Coffee" },
    { value: "drinks", label: "Drinks" },
  ],
  dietary_preferences: [
    { value: "vegan", label: "Vegan" },
    { value: "vegetarian", label: "Vegetarian" },
  ],
  drink_preferences: [
    { value: "coffee-shops", label: "Coffee Shops" },
    { value: "cocktail-bars", label: "Cocktail Bars" },
  ],
  social_vibe: [
    { value: "chill", label: "Chill and Quiet" },
    { value: "vibrant", label: "Vibrant and Social" },
  ],
  decor_preferences: [
    { value: "graffiti", label: "Graffiti Art" },
    { value: "vintage", label: "Vintage Decor" },
  ],
};

const PreferenceForm: React.FC = () => {
  const [formValues, setFormValues] = useState({
    venue_types: [] as string[],
    ambiance_preferences: [] as string[],
    favorite_music_genres: [] as string[],
    event_interests: [] as string[],
    pre_event_activities: [] as string[],
    dietary_preferences: [] as string[],
    drink_preferences: [] as string[],
    social_vibe: [] as string[],
    decor_preferences: [] as string[],
    availability: "",
    meetup_frequency: "",
  });
  
  const handleSelectChange = (
    field: keyof PreferenceOptions,
    selectedOptions: any
  ) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: selectedOptions
        ? selectedOptions.map((option: any) => option.value)
        : [],
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/userprofiledata/userpreferences/", formValues);
      alert("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6">
      {Object.keys(preferenceOptions).map((field) => {
        const fieldName = field as keyof PreferenceOptions;
        return (
          <div key={field} className="form-group">
            <label className="block text-gray-700 font-medium mb-2">
              {field.replace(/_/g, " ").toUpperCase()}
            </label>
            <Select
  isMulti // Allows multiple selections
  isSearchable={false} // Disables typing/searching within the dropdown
  options={preferenceOptions[fieldName]} // Options for the select dropdown
  value={formValues[fieldName].map((value) => ({
    value,
    label: preferenceOptions[fieldName].find((option) => option.value === value)?.label,
  }))} // Maps current form values to the select value format
  onChange={(selectedOptions) =>
    handleSelectChange(fieldName, selectedOptions) // Handles select changes
  }
  placeholder={`Select your ${field.replace(/_/g, " ").toLowerCase()}...`} // Placeholder text
  className="w-full" // Full width
  classNamePrefix="react-select" // Prefix for custom styling
/>
          </div>
        );
      })}

      <div className="form-group">
        <label className="block text-gray-700 font-medium mb-2">Availability</label>
        <input
          type="text"
          name="availability"
          value={formValues.availability}
          onChange={handleInputChange}
          placeholder="e.g., Weekends Only"
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="form-group">
        <label className="block text-gray-700 font-medium mb-2">Meetup Frequency</label>
        <input
          type="text"
          name="meetup_frequency"
          value={formValues.meetup_frequency}
          onChange={handleInputChange}
          placeholder="e.g., Weekly"
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Save Preferences
      </button>
    </form>
  );
};

export default PreferenceForm;
