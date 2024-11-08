import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import { useDispatch} from "react-redux";
import { AppDispatch } from "../app/store";
import { reset_password } from "../feature/auth/authActions";

interface FormType{
    email: string;
}
const ResetPassword: React.FC= ()=> {
    const [requestSent, setRequestSent]= useState<boolean>(false);
    const [formData, setFormData]= useState<FormType>({
        email:'',
    })
    const navigate= useNavigate();
    const {email}= formData;
    const dispatch:AppDispatch= useDispatch();
    
    const onChange= (e: React.ChangeEvent<HTMLInputElement>) =>{
        setFormData({...formData, [e.target.name]:e.target.value})
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(reset_password(email));
        setRequestSent(true);
    }

    
    useEffect(() => {
        if (requestSent) {
            navigate('/');
        }
    }, [requestSent, navigate]);
    
    return (
        <div className="container mx-auto mt-12 max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Reset Password</h1>
        <p className="text-center text-gray-600 mb-6">Request To Reset Your Password</p>
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
            <button
                className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
                type="submit"
            >
                Reset Password
            </button>
        </form>
    </div>
    
    );
}

export default ResetPassword;