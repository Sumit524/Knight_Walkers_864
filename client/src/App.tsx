import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate, } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Navbar from "./components/utilities/Navbar";
import NotFound from "./pages/others/NotFound";
import Home from "./pages/authentication/Home";
import ChatRoom from "./components/chatRoom/ChatRoom";
import AvailableLocations from './locations/AvailableLocations';
// import TodoHome from "./components/todo/TodoHome";
import RegisterFirst from "./pages/authentication/RegisterFirst";
import Login from "./pages/authentication/Login";
import Signup from "./pages/authentication/Signup";
import ResetPassword from "./pages/authentication/ResetPassword";
import Activate from "./pages/authentication/Activate";
import ResetPasswordConfirm from "./pages/authentication/ResetPasswordConfirm";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./app/store";
import { check_authenticated, load_user } from "./feature/auth/authActions";
import FindMatch from "./locations/FindMatch";
import CreateProfile from "./pages/userCridentialsPages/CreateProfile";
import Testcheck from './pages/userCridentialsPages/CategoryInput'
import ProfileImage from "./pages/userCridentialsPages/ProfileImage";
import UserDetailsPage from "./pages/userCridentialsPages/UserDetailsPage";
import 'react-toastify/dist/ReactToastify.css';
import Api from './pages/userCridentialsPages/ApiPage'
import UserExperiences from './pages/userCridentialsPages/UserExperiences'

const App: React.FC = () => {
  const auth = useSelector((state:RootState) => (state.auth))
  const dispatch:AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(check_authenticated());
    dispatch(load_user())
  }, [])

  return (
    <div>
      <BrowserRouter>
      
        <Navbar/>
        <Routes>
          <Route path="/login" element={auth.isAuthenticated? <Navigate to={'/'}/> : <Login />} />
          <Route path="/signup" element={<Signup />}/>
        
          <Route path="/" element={<Home/>} />
          <Route path="/apitesting" element={<Api/>} />
          <Route path="/options" element={<Testcheck/>} />

          {/* <Route path="/" element={auth.isAuthenticated ? <Home/>: <Navigate to={'/notauthenticated'} />} /> */}
          <Route path="*" element={<NotFound/>} />
          <Route path = '/notauthenticated' element={<RegisterFirst/>}/>
          <Route path="/chatroom" element={<ChatRoom />} />
          <Route path="/reset-password" element={<ResetPassword />}/>
          <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirm />}/>
          <Route path="/activate/:uid/:token" element={<Activate />}/>
          <Route path="/locations" element={<AvailableLocations />} />
          <Route path="/createprofile" element={<CreateProfile/>} />
         
          <Route path="/findMatch" element={auth.isAuthenticated ? <FindMatch />: <Navigate to={'/login'} />}/>
            <></>
           
          <Route path="/userdetails" element={< UserDetailsPage/>} />
          <Route path="/experiences" element={< UserExperiences/>} />


          <Route path="/profileImage" element={<ProfileImage/>} />
          
        </Routes>
      </BrowserRouter>
      
    </div>
  );
};

export default App;
