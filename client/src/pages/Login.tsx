import React, { useState } from "react";
import { Link} from "react-router-dom";
import { useDispatch} from "react-redux";
import { AppDispatch } from "../app/store";
import { login } from "../feature/auth/authActions";

interface FormType{
    email: string;
    password: string;
}
const Login: React.FC= ()=> {
    
    const [formData, setFormData]= useState<FormType>({
        email:'',
        password:''
    })

    const {email, password}= formData;
    const dispatch:AppDispatch= useDispatch();
    
    const onChange= (e: React.ChangeEvent<HTMLInputElement>) =>{
        setFormData({...formData, [e.target.name]:e.target.value})
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(login({email, password}));
        
    }

    const continueWithGoogle= async () => {
        //google login logic
    }

    const continueWithFacebook = async () => {
        //facebook login logic
    }
    
    
    
    return (
        <div className="container mx-auto mt-12 max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Sign In</h1>
        <p className="text-center text-gray-600 mb-6">Sign into your Account</p>
        <form onSubmit={e => onSubmit(e)} className="space-y-4">
            <div className="mb-4">
                <input
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={e => onChange(e)}
                    required
                />
            </div>
            <div className="mb-4">
                <input
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={e => onChange(e)}
                    minLength={6}
                    required
                />
            </div>
            <button
                className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
                type="submit"
            >
                Login
            </button>
        </form>
        <button
            className="w-full py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 mt-4 transition"
            onClick={continueWithGoogle}
        >
            Continue With Google
        </button>
        <button
            className="w-full py-2 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800 mt-3 transition"
            onClick={continueWithFacebook}
        >
            Continue With Facebook
        </button>
        <p className="text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
                Sign Up
            </Link>
        </p>
        <p className="text-center text-gray-600 mt-2">
            Forgot your Password?{" "}
            <Link to="/reset-password" className="text-blue-500 hover:underline">
                Reset Password
            </Link>
        </p>
    </div>
    
    );
}

export default Login;