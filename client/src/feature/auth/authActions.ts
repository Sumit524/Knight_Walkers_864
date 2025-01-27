import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, {AxiosResponse} from 'axios';
import { LOGIN_SUCCESS,preferencesLoadedFailed,preferencesLoadedSuccess,profileLoadedSuccess,profileLoadedFailed, PROFILE_SUCCESS,PROFILE_FAIL,LOGIN_FAIL, USER_LOADED_SUCCESS, USER_LOADED_FAILED, AUTHENTICATED_SUCCESS, AUTHENTICATED_FAILED, LOGOUT, PASSWORD_RESET_SUCCESS, PASSWORD_RESET_FAIL, PASSWORD_RESET_CONFIRM_SUCCESS, PASSWORD_RESET_CONFIRM_FAIL, SIGNUP_SUCCESS, SIGNUP_FAIL, ACTIVATION_SUCCESS, ACTIVATION_FAIL,profileIamgeLoadedSuccess,profileImageLoadedFailed,USER_EXPERIENCE_FAILED,USER_EXPERIENCE_SUCCESS} from "./authSlice";
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
                    // console.log("response inside auth_authenticated", res);
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
  async ({email, password}: LoginPayload, {dispatch}) => {
      try {
          // console.log("hello authActions line 54", api_url);
          const config= {
              headers: {
                  'Content-Type': 'application/json'
              }
          };

          const body= JSON.stringify({email, password});
          
          const res: AxiosResponse<LoginResponse> = await axios.post(`${api_url}/auth/jwt/create/`, body, config);
          console.log("inside authActions line 63", res)
          dispatch(LOGIN_SUCCESS(res.data));
          dispatch(load_user());

      } catch (error) {
          console.log("error: ", error);
          dispatch(LOGIN_FAIL());
      }
  }
);
export const signup = createAsyncThunk(
  'auth/signup',
  async ({name, email, password, re_password}: SignupPayload, {dispatch}) => {
      try {
          const config= {
              headers: {
                  'Content-Type': 'application/json'
              }
          };

          const body= JSON.stringify({name, email, password, re_password});
          
          const res: AxiosResponse<User> = await axios.post(`${api_url}/auth/users/`, body, config);
          dispatch(SIGNUP_SUCCESS());

      } catch (error) {
          console.log("error: ", error);
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














export const load_user_profile_by_id = createAsyncThunk(
  'auth/load_user_profile',
  async (userId: number, { dispatch, rejectWithValue }) => {
    const accessToken = localStorage.getItem('access');

    if (!accessToken) {
      dispatch(profileLoadedFailed());
      return rejectWithValue('Access token not found');
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${accessToken}`,
        Accept: 'application/json',
      },
    };

    try {
      // Use userKey in the URL as the parameter
      const response = await axios.get(`${api_url}/accounts/userinfo/${userId}/`, config);
      console.log("response inside load_user_profile_by_id", response.data)
      dispatch(profileLoadedSuccess(response.data));
      return response.data; // Data returned to the `fulfilled` state
    } catch (error: any) {
      console.error('Error loading user profile:', error);

      // Use error.response.data if API provides detailed error messages
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }

      // Fallback error message
      return rejectWithValue('An error occurred while loading the user profile');
    }
  }
);






















interface CreateProfilePayload {
  about: string;
  address: string;
  dob: string;
  contact: string;
  first_name: string;
  last_name: string;
  gender: string;
}

interface UserExperience {
  category: string;
  place: string;
  message_description: string;
  stars: number;
}

export const CreateUserExperience = createAsyncThunk(
  'auth/experience',
  async (
    { category, place, message_description, stars }: UserExperience,
    { getState, rejectWithValue }
  ) => {
    try {
      // Retrieve the access token
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        return rejectWithValue('Access token is missing.');
      }

      // Get the user ID from the state
      const state = getState() as RootState;
      const userId = state?.auth?.user?.id;
      if (!userId) {
        return rejectWithValue('User is not logged in or user ID is missing.');
      }

      // Configuration for the request
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${accessToken}`,
          Accept: 'application/json',
        },
      };

      // Request payload
      const payload = {
        user: userId,
        category,
        place,
        message_description,
        stars,
      };

      // API call
      const response = await axios.post(`${api_url}/accounts/experience/`, payload, config);
      return response.data; // Return the response data for the `fulfilled` case
    } catch (error: any) {
      // Handle errors consistently
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || 'Failed to create user experience.'
        );
      }
      return rejectWithValue('An unexpected error occurred. Please try again later.');
    }
  }
);









export const GetUserExperience = createAsyncThunk(
  'auth/experience',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Retrieve the access token
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        return rejectWithValue('Access token is missing.');
      }

      // Configuration for the request
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${accessToken}`,
          Accept: 'application/json',
        },
      };

      // API call
      const response = await axios.get(`${api_url}/accounts/experience/`, config);

      // Dispatching success action
      dispatch(USER_EXPERIENCE_SUCCESS(response.data));

      // Returning the response data
      return response.data;
    } catch (error: any) {
      // Dispatching failure action and returning error message
      dispatch(USER_EXPERIENCE_FAILED());
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to load user experience.');
      }
      return rejectWithValue('An unexpected error occurred. Please try again later.');
    }
  }
);








// export const CreateProfile = createAsyncThunk(
//   'auth/createprofile',
//   async (
//     { about, address, dob, contact, first_name, last_name, gender }: CreateProfilePayload,
//     { dispatch, rejectWithValue }
//   ) => {
//     try {
//       const formData = new FormData();
//       formData.append('first_name', first_name);
//       formData.append('last_name', last_name);
//       formData.append('dob', dob);
//       formData.append('gender', gender);
//       formData.append('contact', contact);
//       formData.append('address', address);
//       formData.append('about', about);


     
     
//       const accessToken = localStorage.getItem('access');
//       if (!accessToken) {
//         throw new Error('Access token is missing.');
//       }

//       const config = {
//         headers: {
//           'Authorization': `JWT ${accessToken}`,
//           'Accept': 'application/json',
//         },
//       };

//       // Axios handles `Content-Type` automatically for `FormData`
//       console.log('Data sent by frontend:',formData);
//       const res = await axios.post(`${api_url}/accounts/userinfo/`, formData, config);
        
//       dispatch(PROFILE_SUCCESS(res.data)); // Dispatch success action
//       return res.data;
//     } catch (error: unknown) {
//       if (error instanceof AxiosError) {
//         const errorMessage =
//           error.response?.data?.message || 'Failed to create profile. Please try again.';
//         dispatch(PROFILE_FAIL(errorMessage)); // Dispatch fail action
//         return rejectWithValue(errorMessage);
//       } else {
//         const genericError = 'Unexpected error occurred. Please try again later.';
//         dispatch(PROFILE_FAIL(genericError)); // Dispatch fail action
//         return rejectWithValue(genericError);
//       }
//     }
//   }
// );



  

  // Define the payload type
  import { RootState } from "../../app/store";
  export const CreateProfile = createAsyncThunk(
    'auth/createprofile',
    async (
      { about, address, dob, contact, first_name, last_name, gender }: CreateProfilePayload,
      { dispatch, rejectWithValue, getState }
    ) => {
      try {
        const state = getState() as RootState; // Type-cast it to RootState
  
        if (!state || !state.auth || !state.auth.user) {
          return rejectWithValue('User is not logged in or user data is missing.');
        }
  
        const userId = state.auth.user.id;
  
        if (!userId) {
          return rejectWithValue('User ID is required.');
        }
  
        // Create the payload with the user ID and profile data
        const payload = {
          user: userId, // Add user ID to the payload
          about,
          address,
          dob,
          contact,
          first_name,
          last_name,
          gender,
        };
  
        console.log('Data sent by frontend:', payload);
  
        // Get token from localStorage (or from Redux store if it's stored there)
        const accessToken = localStorage.getItem('access');
        if (!accessToken) {
          throw new Error('Access token is missing.');
        }
  
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${accessToken}`,
            'Accept': 'application/json',
          },
        };
  
        // Send the request to the backend
        const res = await axios.post(`${api_url}/accounts/userinfo/`, payload, config);
  
        dispatch(PROFILE_SUCCESS(res.data)); // Dispatch success action
        return res.data;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          const errorMessage =
            error.response?.data?.message || 'Failed to create profile. Please try again.';
          dispatch(PROFILE_FAIL(errorMessage)); // Dispatch fail action
          return rejectWithValue(errorMessage);
        } else {
          const genericError = 'Unexpected error occurred. Please try again later.';
          dispatch(PROFILE_FAIL(genericError)); // Dispatch fail action
          return rejectWithValue(genericError);
        }
      }
    }
  );
  










  import { AxiosError } from 'axios';


// Define the type for profile data
interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
  gender: string;
  contact: string;
  dob: string;
  about: string;
  address: string;
}




export const UpdateProfile = createAsyncThunk<
  any, // Replace with the expected response type
  { userId: number; profileData: UpdateProfilePayload }, // Payload type
  { rejectValue: string } // Rejection value type
>(
  'auth/updateProfile',
  async ({ userId, profileData }, { rejectWithValue }) => {
    try {
      // Ensure the access token exists before making the request
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        return rejectWithValue('Access token is missing.');
      }

      // Configure the request headers
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${accessToken}`,
          Accept: 'application/json',
        },
      };

      // PUT request to update the user profile
      const response = await axios.put(
        `${api_url}/accounts/userinfo/${userId}/`,
        profileData,
        config
      );

      // Return the updated profile data on success
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Axios error:', error.response);

        // Extract a detailed error message if available
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data ||
          'An error occurred while updating the profile.';

        return rejectWithValue(errorMessage);
      }

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


export const fetchUserProfileImageByID = createAsyncThunk(
  'profile/fetchProfileImage',
  async (id: number, { rejectWithValue }) => {
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
      const response = await axios.get(`${api_url}/accounts/profileImage/${id}/`, config);
      return response.data;  // Ensure that the response data includes the profile image URL
    } catch (error: any) {
      // In case the error does not contain a response, handle it gracefully
      return rejectWithValue(error.response?.data || error.message || 'Something went wrong!');
    }
  }
);




