// import React, { Fragment, ReactNode } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AppDispatch, RootState } from "../../app/store";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../../feature/auth/authActions";

// const Navbar: React.FC = () => {

//     const dispatch: AppDispatch = useDispatch();
//     const { isAuthenticated } = useSelector((state: RootState) => (state.auth));
//     const navigate= useNavigate();

//     const logout_user = ():void => {
//         dispatch(logout());
//         navigate('/login');
//     }

//     const guestLinks = (): ReactNode => (
//         <Fragment>
//             <li className="nav-item">
//                 <Link className="text-gray-700 hover:text-blue-600" to="/login">
//                     Login
//                 </Link>
//             </li>
//             <li className="nav-item">
//                 <Link className="text-gray-700 hover:text-blue-600" to="/signup">
//                     Sign Up
//                 </Link>
//             </li>
//         </Fragment>

//     )

//     const authLinks = (): ReactNode => (
//         <li className="nav-item">
//             <Link
//                 className="text-gray-700 hover:text-blue-600 cursor-pointer mr-4"
//                 to = '/chatroom'
//             >Chat Room</Link>
//             <Link
//                 className="text-gray-700 hover:text-blue-600 cursor-pointer"
//                 to = '/logout'
//                 onClick={(event) => {
//                     event.preventDefault();
//                     logout_user();
//                 }}
//             >Logout</Link>
//         </li>

//     );

//     return (

//         <Fragment>
//             <nav className="bg-gray-100 border-b border-gray-300 p-4">
//                 <div className="container mx-auto flex justify-between items-center">
//                     <Link className="text-lg font-semibold text-gray-700" to="/">
//                         Auth System
//                     </Link>
//                     <button
//                         className="block lg:hidden p-2 text-gray-700 focus:outline-none focus:ring"
//                         type="button"
//                         data-toggle="collapse"
//                         data-target="#navbarNav"
//                         aria-controls="navbarNav"
//                         aria-expanded="false"
//                         aria-label="Toggle navigation"
//                     >
//                         <svg
//                             className="w-6 h-6"
//                             fill="currentColor"
//                             viewBox="0 0 24 24"
//                             xmlns="http://www.w3.org/2000/svg"
//                         >
//                             <path
//                                 fillRule="evenodd"
//                                 d="M4 5h16M4 12h16M4 19h16"
//                                 clipRule="evenodd"
//                             />
//                         </svg>
//                     </button>
//                     <div className="hidden lg:flex lg:items-center lg:w-auto" id="navbarNav">
//                         <ul className="flex flex-col lg:flex-row lg:space-x-6">
//                             <li className="nav-item">
//                                 <Link className="text-gray-700 hover:text-blue-600" to="/">
//                                     Home
//                                 </Link>
//                             </li>
//                             {isAuthenticated ? authLinks() : guestLinks()}
//                         </ul>
//                     </div>
//                 </div>
//             </nav>
//         </Fragment>
//     );
// }

// export default Navbar;

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
                <Link to="/findMatch">Find Match</Link>
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
                <div className={`${isOpen ? "block" : "hidden"} lg:flex lg:items-center w-full lg:w-auto`}>
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
