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
        <Link to= {'/login'}>Login </Link>
        <div>
            <Header />
        </div>
        </>

    );
}

export default Home;