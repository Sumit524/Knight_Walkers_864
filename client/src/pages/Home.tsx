import React, { useEffect } from "react";
import Header from "../components/utilities/Header";
import { useDispatch, useSelector } from "react-redux";
import { check_authenticated, load_user } from "../feature/auth/authActions";
import { AppDispatch, RootState } from "../app/store";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
    const dispatch:AppDispatch= useDispatch();
    const auth = useSelector((state:RootState) => (state.auth))

    useEffect(() => {
       
       console.log("Auth in Home: ", auth);
    }, [auth]);
    return (
        <>
        
        <div className="h-screen mt-5 px-2 py-2  bg-gray-900">
            <Header />

        </div>
       
        </>

    );
}

export default Home;