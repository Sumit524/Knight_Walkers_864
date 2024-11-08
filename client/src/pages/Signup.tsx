import React, { useEffect, useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { useDispatch, useSelector} from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { signup } from "../feature/auth/authActions";

interface FormType{
    name: string;
    email: string;
    password: string;
    re_password: string;
}
const Signup: React.FC= ()=> {
    const [accountCreated, setAccountCreated]= useState<boolean>(false);
    const {isAuthenticated}= useSelector((state:RootState) => state.auth);
    const [formData, setFormData]= useState<FormType>({
        name:'',
        email:'',
        password:'',
        re_password: ''
    })

    const {name, email, password, re_password}= formData;
    const navigate= useNavigate();
    const dispatch:AppDispatch= useDispatch();
    
    const onChange= (e: React.ChangeEvent<HTMLInputElement>) =>{
        setFormData({...formData, [e.target.name]:e.target.value})
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(password==re_password){
            dispatch(signup({name, email, password,re_password}));
            setAccountCreated(true);
        }
        
    }

    const continueWithGoogle= async () => {
        //google login logic
    }

    const continueWithFacebook = async () => {
        //facebook login logic
    }

    
    useEffect(()=> {
        if(isAuthenticated){
            navigate('/');
      }
  
      if(accountCreated){
          navigate('/login');
      }
    }, [isAuthenticated, accountCreated, navigate]);
   
    
    return (
        <div className="container mx-auto mt-12 max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Sign Up</h1>
        <p className="text-center text-gray-600 mb-6">Create your Account</p>
        <form onSubmit={e => onSubmit(e)} className="space-y-4">
            <div className="mb-4">
                <input
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Name*"
                    name="name"
                    value={name}
                    onChange={e => onChange(e)}
                    required
                />
            </div>
            <div className="mb-4">
                <input
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="email"
                    placeholder="Email*"
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
                    placeholder="Password*"
                    name="password"
                    value={password}
                    onChange={e => onChange(e)}
                    minLength={6}
                    required
                />
            </div>
            <div className="mb-4">
                <input
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    placeholder="Confirm Password*"
                    name="re_password"
                    value={re_password}
                    onChange={e => onChange(e)}
                    minLength={6}
                    required
                />
            </div>
            <button
                className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
                type="submit"
            >
                Register
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
        <p className="text-center text-gray-600 mt-2">
            Already have an account?
            <Link to="/login" className="text-blue-500 hover:underline">
                Sign In
            </Link>
        </p>
    </div>
    
    );
}

export default Signup;