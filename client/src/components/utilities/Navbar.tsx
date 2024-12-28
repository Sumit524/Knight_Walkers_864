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
        navigate("/login");
    };

    const handleLinkClick = (link: string): void => {
        setActiveLink(link);
    };

    const guestLinks = (): ReactNode => (
        <Fragment>
            <li>
                <Link
                    to="/login"
                    className={`px-2 py-1 text-aqua font-bold hover:text-gray-300 ${
                        activeLink === "login" ? "bg-yellow-500 text-black rounded-lg" : ""
                    }`}
                    onClick={() => handleLinkClick("login")}
                >
                    Login
                </Link>
            </li>
            <li>
                <Link
                    to="/signup"
                    className={`px-2 py-1 text-aqua font-bold hover:text-gray-300 ${
                        activeLink === "signup" ? "bg-yellow-500 text-black rounded-lg" : ""
                    }`}
                    onClick={() => handleLinkClick("signup")}
                >
                    Sign Up
                </Link>
            </li>
        </Fragment>
    );

    const authLinks = (): ReactNode => (
        <Fragment>
            <div className="relative group ">
                <button
                    className="text-aqua  flex items-center space-x-2 focus:outline-none"
                    aria-label="User Menu"
                >
                    <span
                        className={`bg-yellow-500 rounded-lg px-2 py-1 text-black font-bold hover:text-gray-300 ${
                            activeLink === "user" ? "bg-yellow-500 text-black rounded-lg" : ""
                        }`}
                        onClick={() => handleLinkClick("user")}
                    >
                        User profile
                    </span>
                    <svg
                        className="w-10 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
                {/* Dropdown Menu */}
                <ul className="absolute mt-3 right-0  w-48 bg-gray-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"  style={{ boxShadow: '0 10px 20px rgba(188, 176, 176, 0.7)' }}>
                    <li>
                        <Link
                            to="/userdetails"
                            className={`px-2 text-aqua font-bold hover:text-gray-300 ${
                                activeLink === "userdetails" ? "bg-yellow-500 text-black rounded-lg" : ""
                            }`}
                            onClick={() => handleLinkClick("userdetails")}
                        >
                            User Details
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/apitesting"
                            className={`px-2 text-aqua font-bold hover:text-gray-300 ${
                                activeLink === "apitesting" ? "bg-yellow-500 text-black rounded-lg" : ""
                            }`}
                            onClick={() => handleLinkClick("apitesting")}
                        >
                            API Testing
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/chatroom"
                            className={`px-2  text-aqua font-bold hover:text-gray-300 ${
                                activeLink === "chatroom" ? "bg-yellow-500 text-black rounded-lg" : ""
                            }`}
                            onClick={() => handleLinkClick("chatroom")}
                        >
                            Chat Room
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={(event) => {
                                event.preventDefault();
                                logout_user();
                                handleLinkClick("logout");
                            }}
                            className={`px-2  text-aqua font-bold hover:text-gray-300 ${
                                activeLink === "logout" ? "bg-yellow-500 text-black rounded-lg" : ""
                            }`}
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </Fragment>
    );

    return (
        <nav className="bg-transparent text-cyan-400 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link
                    to="/"
                    className={`px-2  text-white text-2xl font-semibold ${
                        activeLink === "home" ? "text-black font-bold" : "font-bold"
                    }`}
                    onClick={() => handleLinkClick("home")}
                >
                    Find The <strong className="text-red-500">Meet</strong>
                </Link>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle Navigation"
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
                <div
                    className={`${
                        isOpen
                            ? "block bg-blue-600 p-4 mt-2 rounded-md shadow-lg"
                            : "hidden"
                    } lg:flex lg:items-center lg:static lg:w-auto`}
                >
                    <ul className="flex flex-col lg:flex-row lg:space-x-4 mt-4 lg:mt-0 space-y-2 lg:space-y-0">
                        <li>
                            <Link
                                to="/"
                                className={`px-2 py-1 text-aqua font-bold hover:text-gray-300 ${
                                    activeLink === "home" ? "bg-yellow-500 text-black rounded-lg" : ""
                                }`}
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
