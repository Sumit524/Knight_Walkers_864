

import React, { Fragment, useState, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../feature/auth/authActions";

const Navbar: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const logout_user = (): void => {
        dispatch(logout());
        navigate('/login');
    };

    const guestLinks = (): ReactNode => (
        <Fragment>
            <li className="text-white hover:text-gray-300">
                <Link to="/login">Login</Link>
            </li>
            <li className="text-white hover:text-gray-300">
                <Link to="/signup">Sign Up</Link>
            </li>
        </Fragment>
    );

    const authLinks = (): ReactNode => (
        <Fragment>
            <li className="text-white hover:text-gray-300">
                <Link to="/chatroom">Chat Room</Link>
            </li>
           
            <li className="text-white hover:text-gray-300">
                <Link to="/createprofile">Create Profile</Link>
            </li>
            <li>
                <button
                    onClick={(event) => {
                        event.preventDefault();
                        logout_user();
                    }}
                    className="text-white hover:text-gray-300"
                >
                    Logout
                </button>
            </li>
        </Fragment>
    );

    return (
        <nav className="bg-blue-600 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-lg font-semibold">
                    Find The Meet
                </Link>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle navigation"
                    className="text-white focus:outline-none lg:hidden"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
                <div className={`${isOpen ? "right-0 top-8 mt-2 w-full flex justify-end bg-blue-600 p-4" : "hidden"} lg:flex lg:items-center lg:static lg:w-auto`}>
                    <ul className="flex flex-col lg:flex-row lg:space-x-4 mt-4 lg:mt-0 space-y-2 lg:space-y-0">
                        <li className="text-white hover:text-gray-300">
                            <Link to="/">Home</Link>
                        </li>
                        {isAuthenticated ? authLinks() : guestLinks()}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

