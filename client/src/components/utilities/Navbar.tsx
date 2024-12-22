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
    const [activeLink, setActiveLink] = useState<string>("");

    const logout_user = (): void => {
        dispatch(logout());
        navigate('/login');
    };

    const handleLinkClick = (link: string): void => {
        setActiveLink(link);
    };

    const guestLinks = (): ReactNode => (
        <Fragment>
            <li>
                <Link
                    to="/login"
                    className={`px-2 py-1  text-aqua font-bold hover:text-gray-300 ${activeLink === "login" ? "bg-yellow-500 text-black rounded-lg" : ""}`}
                    onClick={() => handleLinkClick("login")}
                >
                    Login
                </Link>
            </li>
            <li>
                <Link
                    to="/signup"
                    className={`px-2 py-1  text-aqua font-bold hover:text-gray-300 ${activeLink === "signup" ? "bg-yellow-500 text-black rounded-lg" : ""}`}
                    onClick={() => handleLinkClick("signup")}
                >
                    Sign Up
                </Link>
            </li>
        </Fragment>
    );

    const authLinks = (): ReactNode => (
        <Fragment>
            <li>
                <Link
                    to="/chatroom"
                    className={`px-2 py-1  text-aqua font-bold hover:text-gray-300 ${activeLink === "chatroom" ? "bg-yellow-500 text-black rounded-lg " : ""}`}
                    onClick={() => handleLinkClick("chatroom")}
                >
                    Chat Room
                </Link>
            </li>



            <li>
                <Link
                    to="/userdetails"
                    className={`px-2 py-1 text-aqua font-bold hover:text-gray-300 ${activeLink === "userdetails" ? "bg-yellow-500 text-black rounded-lg " : ""}`}
                    onClick={() => handleLinkClick("userdetails")}
                >
                    Userdetails
                </Link>
            </li>

            <li>
                <button
                    onClick={(event) => {
                        event.preventDefault();
                        logout_user();
                        handleLinkClick("logout"); // Update active link when logging out
                    }}
                    className={`px-2 py-1  text-aqua font-bold hover:text-gray-300 ${activeLink === "logout" ? "bg-yellow-500 text-black rounded-lg" : ""}`}
                >
                    Logout
                </button>
            </li>
        </Fragment>
    );

    return (
        <nav className="bg-transparent text-cyan-400 p-4 shadow-lg ">
            <div className="container mx-auto flex justify-between items-center">
                <Link
                    to="/"
                    className={`px-2 py-1  text-white text-lg font-semibold ${activeLink === "home" ? " text-black font-bold" : "font-bold"}`}
                    onClick={() => handleLinkClick("home")}
                >
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
                        <li>
                            <Link
                                to="/"
                                className={`px-2 py-1   text-aqua font-bold hover:text-gray-300 ${activeLink === "home" ? "bg-yellow-500 text-black rounded-lg" : ""}`}
                                onClick={() => handleLinkClick("home")}
                            >
                                Home
                            </Link>
                        </li>
                        {isAuthenticated ? authLinks() : guestLinks()}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
