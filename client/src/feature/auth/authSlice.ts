import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreateProfile,saveUserData } from './authActions';
import { UserPreferencesInterface } from "./types";
interface User {
    id: string;
    username: string;
    email: string;
    
}




interface UserProfile {
    email: string;
    first_name: string;
    last_name: string;
    gender: string;
    dob: string;
    contact: string;
    address: string;
    about: string;
}


interface AuthState {
    access: string | null;
    refresh: string | null;
    isAuthenticated: boolean | null;
    user: User | null;
    profile: UserProfile | null; 
    preferences:UserPreferencesInterface |null,
    loading: boolean;
    error: string | null;
    success:boolean
}

const initialState: AuthState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: null,
    user: null,
    profile: null,
    preferences:null,
    loading: false,
    error: null,
    success:false
}


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
          },
        LOGIN_SUCCESS: (state, action: PayloadAction<{ access: string; refresh: string; }>) => {
            const { access, refresh } = action.payload;

            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh);
          
            
            state.access = access;
            state.refresh = refresh;
            state.isAuthenticated = true;
        },

        USER_LOADED_SUCCESS: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },

        USER_LOADED_FAILED: (state) => {
            state.user = null;
        },

        profileLoadedSuccess(state, action: PayloadAction<UserProfile>) {
            state.profile = action.payload;
        },
        profileLoadedFailed(state) {
            state.profile = null;
        },
        preferencesLoadedFailed(state){
            state.preferences =null;
        },

        preferencesLoadedSuccess(state,action:PayloadAction<UserPreferencesInterface>){
            state.preferences =action.payload;
        },
        


        LOGIN_FAIL: (state) => {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');

            state.access = null;
            state.refresh = null;
            state.isAuthenticated = false;
            state.user = null

        },

        SIGNUP_SUCCESS:(state) => {
             state.isAuthenticated= false;
        },

        SIGNUP_FAIL:(state) => {

        },

        AUTHENTICATED_SUCCESS: (state) => {
            state.isAuthenticated = true;
            
        },

        AUTHENTICATED_FAILED: (state) => {
            state.isAuthenticated = false;
        },

        PASSWORD_RESET_SUCCESS: (state) => {

        },

        PASSWORD_RESET_FAIL: (state) => {

        },
        
        PASSWORD_RESET_CONFIRM_SUCCESS: (state)=> {

        },

        PASSWORD_RESET_CONFIRM_FAIL: (state) => {

        },

        ACTIVATION_SUCCESS: (state)=> {

        },

        ACTIVATION_FAIL: (state) => {

        },
        

        LOGOUT: (state) => {

            localStorage.removeItem('access');
            localStorage.removeItem('refresh');

            state.access = null;
            state.refresh = null;
            state.user = null;
            state.isAuthenticated = false;
        },
        PROFILE_SUCCESS: (state, action) => {
            state.profile = action.payload;
            state.loading = false;
            state.error = null;
        },
        PROFILE_FAIL: (state, action) => {
            state.profile = null;
            state.loading = false;
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(CreateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(CreateProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(CreateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create profile';
            })
            .addCase(saveUserData.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
              })
              .addCase(saveUserData.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
              })
              .addCase(saveUserData.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || 'An unknown error occurred';
              });
          
    },
})

export const { LOGIN_SUCCESS, LOGIN_FAIL,     profileLoadedSuccess,
    resetState, profileLoadedFailed,SIGNUP_SUCCESS,preferencesLoadedFailed,preferencesLoadedSuccess, SIGNUP_FAIL,PROFILE_SUCCESS, PROFILE_FAIL, ACTIVATION_SUCCESS, ACTIVATION_FAIL, USER_LOADED_FAILED, USER_LOADED_SUCCESS, AUTHENTICATED_SUCCESS, AUTHENTICATED_FAILED, PASSWORD_RESET_FAIL, PASSWORD_RESET_SUCCESS, PASSWORD_RESET_CONFIRM_FAIL, PASSWORD_RESET_CONFIRM_SUCCESS,LOGOUT } = authSlice.actions;
export default authSlice.reducer;