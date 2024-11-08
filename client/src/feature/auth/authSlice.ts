import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: string;
    username: string;
    email: string;
}

interface AuthState {
    access: string | null;
    refresh: string | null;
    isAuthenticated: boolean | null;
    user: User | null;
}

const initialState: AuthState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: null,
    user: null,
}


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
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
        }
    }
})

export const { LOGIN_SUCCESS, LOGIN_FAIL, SIGNUP_SUCCESS, SIGNUP_FAIL, ACTIVATION_SUCCESS, ACTIVATION_FAIL, USER_LOADED_FAILED, USER_LOADED_SUCCESS, AUTHENTICATED_SUCCESS, AUTHENTICATED_FAILED, PASSWORD_RESET_FAIL, PASSWORD_RESET_SUCCESS, PASSWORD_RESET_CONFIRM_FAIL, PASSWORD_RESET_CONFIRM_SUCCESS,LOGOUT } = authSlice.actions;
export default authSlice.reducer;