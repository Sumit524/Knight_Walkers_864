import React, { Fragment, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../feature/auth/authActions";

const Navbar: React.FC = () => {

    const dispatch: AppDispatch = useDispatch();
    const { isAuthenticated } = useSelector((state: RootState) => (state.auth));
    const navigate= useNavigate();

    const logout_user = ():void => {
        dispatch(logout());
        navigate('/login');
    }

    const guestLinks = (): ReactNode => (
        <Fragment>
            <li className="nav-item">
                <Link className="text-gray-700 hover:text-blue-600" to="/login">
                    Login
                </Link>
            </li>
            <li className="nav-item">
                <Link className="text-gray-700 hover:text-blue-600" to="/signup">
                    Sign Up
                </Link>
            </li>
        </Fragment>

    )

    const authLinks = (): ReactNode => (
        <li className="nav-item">
            <Link
                className="text-gray-700 hover:text-blue-600 cursor-pointer mr-4"
                to = '/chatroom'
            >Chat Room</Link>
            <Link
                className="text-gray-700 hover:text-blue-600 cursor-pointer"
                to = '/logout'
                onClick={(event) => {
                    event.preventDefault();
                    logout_user();
                }}
            >Logout</Link>
        </li>

    );

    return (

        <Fragment>
            <nav className="bg-gray-100 border-b border-gray-300 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link className="text-lg font-semibold text-gray-700" to="/">
                        Auth System
                    </Link>
                    <button
                        className="block lg:hidden p-2 text-gray-700 focus:outline-none focus:ring"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4 5h16M4 12h16M4 19h16"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <div className="hidden lg:flex lg:items-center lg:w-auto" id="navbarNav">
                        <ul className="flex flex-col lg:flex-row lg:space-x-6">
                            <li className="nav-item">
                                <Link className="text-gray-700 hover:text-blue-600" to="/">
                                    Home
                                </Link>
                            </li>
                            {isAuthenticated ? authLinks() : guestLinks()}
                        </ul>
                    </div>
                </div>
            </nav>
        </Fragment>
    );
}

export default Navbar;


