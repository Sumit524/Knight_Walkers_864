// store.ts
import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "../feature/todo/todoSlice";
import authReducer from "../feature/auth/authSlice";

export const store = configureStore({
    reducer: {
        todo: todoReducer,
        auth: authReducer,
       
    },
});

// Export RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
