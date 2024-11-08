

// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { GOOGLE_ACCESS_TOKEN } from "../../components/auth/token";

// function RedirectGoogleAuth() {
//     const navigate = useNavigate();

//     useEffect(() => {
//         console.log("RedirectHandler mounted successfully");

//         const queryParams = new URLSearchParams(window.location.search);
//         const accessToken = queryParams.get('access_token');
//         console.log("QueryParams: ", window.location.search);

//         if (accessToken) {
//             console.log("AccessToken found: ", accessToken);
//             localStorage.setItem(GOOGLE_ACCESS_TOKEN, accessToken);

//             // Set the Authorization header with the access token
//             axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

//             // Verify the token with the backend
//             axios.get('http://localhost:8000/authentication/auth/user/')
//                 .then((response) => {
//                     console.log('User data:', response.data);
//                     navigate('/');
//                 })
//                 .catch((error) => {
//                     console.error('Error verifying token:', error.response ? error.response.data : error.message);
//                     navigate('/login');
//                 });
//         } else {
//             console.log('No token found in URL');
//             navigate('/login');
//         }
//     }, [navigate]);

//     return <div>Logging In.........</div>;
// }

// export default RedirectGoogleAuth;



// // http://localhost:8000/authentication/auth/user/

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GOOGLE_ACCESS_TOKEN } from "../../components/auth/token";

function RedirectGoogleAuth() {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("RedirectHandler mounted successfully");

        // Check both query string and hash for access_token
        const queryParams = new URLSearchParams(window.location.search || window.location.hash.replace('#', '?'));
        const accessToken = queryParams.get('access_token');
        console.log("QueryParams: ", window.location.search || window.location.hash);

        if (accessToken) {
            console.log("AccessToken found: ", accessToken);

            // Store the token in localStorage
            localStorage.setItem(GOOGLE_ACCESS_TOKEN, accessToken);

            // Set the Authorization header with the access token for subsequent requests
            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

            // Verify the token with the backend
            axios.get('http://localhost:8000/authentication/auth/user/')
                .then((response) => {
                    console.log('User data:', response.data);
                    navigate('/'); // Redirect to home or dashboard page
                })
                .catch((error) => {
                    // Handle error from token verification
                    console.error('Error verifying token:', error.response ? error.response.data : error.message);
                    // Redirect to login page on error
                    navigate('/login');
                });
        } else {
            console.log('No token found in URL');
            navigate('/login');  // Redirect to login if no token is found
        }
    }, [navigate]);

    return <div>Logging In.........</div>;
}

export default RedirectGoogleAuth;
