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