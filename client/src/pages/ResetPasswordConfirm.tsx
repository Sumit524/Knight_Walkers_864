import React, { useState, useEffect } from "react";
import { useNavigate, useParams} from "react-router-dom";
import { useDispatch} from "react-redux";
import { AppDispatch } from "../app/store";
import { reset_password_confirm } from "../feature/auth/authActions";

interface FormType{
    new_password: string;
    re_new_password: string;
}
const ResetPasswordConfirm: React.FC= ()=> {
    const [requestSent, setRequestSent]= useState<boolean>(false);
    const [formData, setFormData]= useState<FormType>({
        new_password:'',
        re_new_password: ''
    })
    const {uid, token}= useParams<{uid: string; token: string}>();
    const navigate= useNavigate();
    const {new_password, re_new_password}= formData;
    const dispatch:AppDispatch= useDispatch();
    
    const onChange= (e: React.ChangeEvent<HTMLInputElement>):void =>{
        setFormData({...formData, [e.target.name]:e.target.value})
    };

    const onSubmit = (e: React.FormEvent):void => {
        e.preventDefault();
        if (uid && token) {
            dispatch(reset_password_confirm({ uid, token, new_password, re_new_password }));
            setRequestSent(true);
        }
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
                    type="password"
                    placeholder="New Password"
                    name="new_password"
                    value={new_password}
                    onChange={e => onChange(e)}
                    minLength={6}
                    required
                />
            </div>
            <div className="mb-4">
                <input
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    placeholder="Confirm New Password"
                    name="re_new_password"
                    value={re_new_password}
                    onChange={e => onChange(e)}
                    minLength={6}
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

export default ResetPasswordConfirm;