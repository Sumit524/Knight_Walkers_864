import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, {AxiosResponse} from 'axios';
import { LOGIN_SUCCESS, LOGIN_FAIL, USER_LOADED_SUCCESS, USER_LOADED_FAILED, AUTHENTICATED_SUCCESS, AUTHENTICATED_FAILED, LOGOUT, PASSWORD_RESET_SUCCESS, PASSWORD_RESET_FAIL, PASSWORD_RESET_CONFIRM_SUCCESS, PASSWORD_RESET_CONFIRM_FAIL, SIGNUP_SUCCESS, SIGNUP_FAIL, ACTIVATION_SUCCESS, ACTIVATION_FAIL} from "./authSlice";
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
    async ({email, password}: LoginPayload, {dispatch}) => {
        try {
            console.log("hello authActions line 54", api_url);
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