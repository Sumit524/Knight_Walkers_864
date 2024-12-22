import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, {AxiosResponse} from 'axios';
import { LOGIN_SUCCESS,preferencesLoadedFailed,preferencesLoadedSuccess,profileLoadedSuccess,profileLoadedFailed, PROFILE_SUCCESS,PROFILE_FAIL,LOGIN_FAIL, USER_LOADED_SUCCESS, USER_LOADED_FAILED, AUTHENTICATED_SUCCESS, AUTHENTICATED_FAILED, LOGOUT, PASSWORD_RESET_SUCCESS, PASSWORD_RESET_FAIL, PASSWORD_RESET_CONFIRM_SUCCESS, PASSWORD_RESET_CONFIRM_FAIL, SIGNUP_SUCCESS, SIGNUP_FAIL, ACTIVATION_SUCCESS, ACTIVATION_FAIL,profileIamgeLoadedSuccess,profileImageLoadedFailed} from "./authSlice";
import { api_url } from "../../config/config";

interface LoginPayload {
    email: string;
    password: string;
}

interface LoginResponse {
    access: string;
    refresh: string;
}

interface SignupPayload{
    name: string;
    email: string;
    password: string;
    re_password: string;
}
interface User {
   id: string;
   email: string;
   username: string;
   
}

interface Reset_Password_Confirm_Type{
    uid: string;
    token: string;
    new_password: string;
    re_new_password: string;
}

interface VerifyType{
    uid:string;
    token: string;
}

export const check_authenticated= createAsyncThunk(
    'auth/check_authenticated',
    async (_ ,{dispatch}) => {
        if(localStorage.getItem('access')) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }; 

            const body = JSON.stringify({ token: localStorage.getItem('access') });

            try {
                const res = await axios.post(`${api_url}/auth/jwt/verify/`, body, config)
    
                if (res.data.code !== 'token_not_valid') {
                    console.log("response inside auth_authenticated", res);
                    dispatch(AUTHENTICATED_SUCCESS());
                } else {
                    dispatch(AUTHENTICATED_FAILED());
                }
            } catch (err) {
                 dispatch(AUTHENTICATED_FAILED());
            }
    
        } else {
            dispatch(AUTHENTICATED_FAILED());

        }
    }
)

export const load_user = createAsyncThunk(
    'auth/load_user',
    async (_, {dispatch}) => {
      
        if(localStorage.getItem('access')) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${localStorage.getItem('access')}`,
                    'Accept': 'application/json'
                }
            }; 

            try {
                
                const res: AxiosResponse<User>= await axios.get(`${api_url}/auth/users/me/`, config);
                dispatch(USER_LOADED_SUCCESS(res.data));
                
            } catch (error) {
                dispatch(USER_LOADED_FAILED());
            }
        }else {
            dispatch(USER_LOADED_FAILED());
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: LoginPayload, { dispatch }) => {
        try {
            console.log("API URL: ", api_url);

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const body = JSON.stringify({ email, password });

            // Making POST request
            const res: AxiosResponse<LoginResponse> = await axios.post(
                `${api_url}/auth/jwt/create/`,
                body,
                config
            );

            console.log("Login response: ", res.data);

            // Dispatch success actions
            dispatch(LOGIN_SUCCESS(res.data));
            dispatch(load_user());
        } catch (error) {
            // Enhanced error handling
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error("Server responded with an error:", error.response.data);
                    console.error("Status code:", error.response.status);
                } else if (error.request) {
                    console.error("No response received from the server:", error.request);
                } else {
                    console.error("Error setting up the request:", error.message);
                }
            } else {
                console.error("Unexpected error:", error);
            }

            dispatch(LOGIN_FAIL());
        }
    }
);

export const signup = createAsyncThunk(
    'auth/signup',
    async ({ email, password, re_password }: SignupPayload, { dispatch }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const body = JSON.stringify({
                email,  // Replace with 'username' if needed
                password,
                re_password,
            });

            const res: AxiosResponse<User> = await axios.post(
                `${api_url}/auth/users/`,
                body,
                config
            );

            console.log("Signup successful: ", res.data);
            dispatch(SIGNUP_SUCCESS());
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error response: ", error.response?.data);
            } else {
                console.error("Unexpected error: ", error);
            }
            dispatch(SIGNUP_FAIL());
        }
    }
);


export const verify= createAsyncThunk(
    'auth/verify',
    async ({uid, token}: VerifyType, {dispatch}) => {
        try {
            
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        
            const body = JSON.stringify({ uid, token });

            await axios.post(`${api_url}/auth/users/activation/`, body, config);
            dispatch(ACTIVATION_SUCCESS());
        } catch (error) {
            dispatch(ACTIVATION_FAIL());
        } 
    }

);

export const reset_password = createAsyncThunk(
     'auth/reset_password',
     async(email:string, {dispatch}) => {
          try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        
            const body = JSON.stringify({ email });

            await axios.post(`${api_url}/auth/users/reset_password/`, body, config);
            dispatch(PASSWORD_RESET_SUCCESS());

          } catch (error) {
            dispatch(PASSWORD_RESET_FAIL());
          }
     }
);


export const reset_password_confirm = createAsyncThunk(
    'auth/reset_password_confirm',
    async({uid, token, new_password, re_new_password}: Reset_Password_Confirm_Type, {dispatch}) => {
           try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        
            const body = JSON.stringify({ uid, token, new_password, re_new_password });

            await axios.post(`${api_url}/auth/users/reset_password_confirm/`, body, config);
            dispatch(PASSWORD_RESET_CONFIRM_SUCCESS());
           } catch (error) {
            dispatch(PASSWORD_RESET_CONFIRM_FAIL());
           }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, {dispatch}) => {
       dispatch(LOGOUT());
    }
)















// 14-12-24




export const load_user_profile= createAsyncThunk(
    'auth/load_user_profile',
    async (_, {dispatch}) => {
      
        if(localStorage.getItem('access')) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${localStorage.getItem('access')}`,
                    'Accept': 'application/json'
                }
            }; 

            try {
                const res = await axios.get(`${api_url}/accounts/userinfo/`, config);
                dispatch(profileLoadedSuccess(res.data));
            } catch (error) {
                console.error('Error loading user profile:', error);
                dispatch(profileLoadedFailed());
            }
        } else {
            dispatch(profileLoadedFailed());
        }
    }
);


interface CreateProfilePayload{
    email: string;
    first_name: string;
    last_name: string;
    gender: string;
    dob:string;
    contact: string;
    address: string;
    about: string;
    
}




export const CreateProfile = createAsyncThunk(
    'auth/createprofile',
    async ({ email, about, address, dob, contact, first_name, last_name, gender }: CreateProfilePayload, { dispatch }) => {
      try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('about', about);
        formData.append('address', address);
        formData.append('dob', dob);
        formData.append('contact', contact);
        formData.append('first_name', first_name);
        formData.append('last_name', last_name);
        formData.append('gender', gender);
  
        // Get token from localStorage
        const config = {
          headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${localStorage.getItem('access')}`,
                    'Accept': 'application/json'
          },
        };
  
        const res = await axios.post(`${api_url}/accounts/userinfo/`, formData, config);
  
        dispatch(PROFILE_SUCCESS(res.data));
        return res.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          dispatch(PROFILE_FAIL(error.response?.data.message || 'Failed to create profile'));
        } else {
          dispatch(PROFILE_FAIL('Unexpected error occurred'));
        }
        throw error;
      }
    }
  );

  import { AxiosError } from 'axios';


// Define the type for profile data
interface UpdateProfilePayload {
  id: number; // Profile ID (user's primary key)
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  contact: string;
  dob: string;
  about: string;
  address: string;
}

export const UpdateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: UpdateProfilePayload, { rejectWithValue }) => {
    try {
      // Ensure the access token exists before making the request
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        return rejectWithValue('Access token is missing.');
      }

      // PUT request to update the user profile using the dynamic user ID
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${accessToken}`,
          'Accept': 'application/json',
        },
      };

      const response = await axios.put(`${api_url}/accounts/userinfo/${profileData.id}/`, profileData, config);
      

      // Return the updated profile data on success
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        // Log the error response, status, and message
        console.error('Axios error response:', error.response);
        console.error('Error status:', error.response?.status);
        console.error('Error message:', error.message);

        // Provide a more descriptive error message based on the response
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data ||
          'An error occurred while updating the profile.';
        
        // Reject the promise with the error message
        return rejectWithValue(errorMessage);
      }

      // Log any unknown error
      console.error('Unknown error:', error);

      // Return a generic error message for unknown errors
      return rejectWithValue('An unexpected error occurred.');
    }
  }
);














import { UserPreferencesInterface } from './types';
interface UserData {
    [key: string]: string[]; // Example: { "Food": ["Non-Veg2356", "Veg"], "Park": ["Flower3232211111114"] }
  }


  
  // Async thunk for posting user data
  export const saveUserData = createAsyncThunk<
    void, // Return type
    UserData, // Argument type
    { rejectValue: string } // Reject value type
  >(
    'user/saveUserData',
    async (userData, { rejectWithValue }) => {
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        return rejectWithValue('Access token is missing.');
      }
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${accessToken}`,
          'Accept': 'application/json',
        },
      };
  
      // Transform the data to match the backend's expected format
      const transformedData = {
        selectedCategories: userData, // Wrap the entire userData object under "selectedCategories"
      };
  
      try {
        console.log("Transformed Data: ", transformedData);
        await axios.post(`${api_url}/accounts/preferences/`, transformedData, config);
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'An error occurred');
      }
    }
  );


  
  export const UpdateUserPreferences = createAsyncThunk(
    'auth/updateUserPreferences',
    async ({ userid, preferences }: { userid: number, preferences: UserPreferencesInterface }, { rejectWithValue }) => {
      try {
        const accessToken = localStorage.getItem('access');
        if (!accessToken) {
          return rejectWithValue('Access token is missing.');
        }
  
        // Configuring headers for the request
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${accessToken}`,
            'Accept': 'application/json',
          },
        };
  
        // Making PUT request to update user preferences
        const response = await axios.put(
          `${api_url}/accounts/preferences/${userid}/`,
          preferences, // sending preferences in the body
          config // configuring headers
        );
  
        // Returning the response data
        return response.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          // Logging error details
          console.error('Axios error response:', error.response);
          console.error('Error status:', error.response?.status);
          console.error('Error message:', error.message);
  
          // Extracting a meaningful error message
          const errorMessage =
            error.response?.data?.detail ||
            error.response?.data ||
            'An error occurred while updating preferences.';
  
          // Rejecting with the extracted error message
          return rejectWithValue(errorMessage);
        }
  
        // Logging any unknown errors
        console.error('Unknown error:', error);
  
        // Returning a generic error message for unknown errors
        return rejectWithValue('An unexpected error occurred.');
      }
    }
  );
  








export const Load_UserPreferences = createAsyncThunk(
  'auth/loadUserPreferences',
  async (userId: number, { dispatch, rejectWithValue }) => {

    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      dispatch(preferencesLoadedFailed());
      return rejectWithValue('Access token is missing.');
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${accessToken}`,
        Accept: 'application/json',
      },
    };

    try {
      const response = await axios.get(`${api_url}/accounts/preferences/${userId}/`, config);
      dispatch(preferencesLoadedSuccess(response.data)); // Dispatch success action with data
      return response.data; // Return the response data for further processing
    } catch (error: any) {
      console.error('Error loading user preferences:', error);
      dispatch(preferencesLoadedFailed()); // Dispatch failure action
      return rejectWithValue(error.response?.data || 'Failed to load preferences.'); // Provide meaningful error message
    }
  }
);
















interface UploadUserProfileImageResponse {
  profile_image: string;
}

export const uploadUserProfileImage = createAsyncThunk<
  UploadUserProfileImageResponse, // The resolved data type
  FormData,                       // The argument passed to the thunk
  { rejectValue: string }         // The type of the rejected value
>(
  'profile/uploadProfileImage',
  async (formData: FormData, { rejectWithValue }) => {
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      return rejectWithValue('Access token is missing.');
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `JWT ${accessToken}`,
      },
    };

    try {
      const response = await axios.put(`${api_url}/accounts/profileImage/`, formData, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Something went wrong!');
    }
  }
);


export const fetchUserProfileImage = createAsyncThunk(
  'profile/fetchProfileImage',
  async (_, { rejectWithValue }) => {
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      return rejectWithValue('Access token is missing.');
    }

    const config = {
      headers: {
        Authorization: `JWT ${accessToken}`,
      },
    };

    try {
      const response = await axios.get(`${api_url}/accounts/profileImage/detail/`, config);
      return response.data;  // Ensure that the response data includes the profile_image_url
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Something went wrong!');
    }
  }
);




