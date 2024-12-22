export interface Preferences {
    music: string[];
    food: string[];
    vibe: string[];
  }
  
  // export interface UserData {
  //   preferences: Preferences;
  // }
  
 // In types.ts
 export interface UserPreferencesInterface  {
  preferences: {
    music: string[];
    food: string[];
    vibe: string[];
  };
  // Add index signature for flexibility
  [key: string]: any; // This allows any string key to be present in the UserData type.
}

  
  export interface UserState {
    loading: boolean;
    error: string | null;
    success: boolean;
  }



  export interface ProfileStateInterface{
    profileImage: string | null; // URL or path to the uploaded profile image
    status: 'idle' | 'loading' | 'succeeded' | 'failed'; // Status of the current async operation
    error: string | null; // Error message, if any
  }
  