import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/utilities/Navbar";
import Select from './components/UserdataForm/Select'
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import { useAuthentication } from "./components/auth/auth";
import RedirectGoogleAuth from "./components/utilities/GoogleRedirectHandler";
import Userdata from "./components/UserdataForm/Userdata";
import ChatRoom from "./components/chatRoom/ChatRoom";
import AvailableLocations from './locations/AvailableLocations';
// import axios from "axios";

const App: React.FC = () => {
  const { isAuthorized } = useAuthentication();

  const ProtectedLogin: React.FC = () => {
    return isAuthorized ? <Navigate to="/" /> : <AuthPage initialMethod="login" />;
  };

  const ProtectedRegister: React.FC = () => {
    return isAuthorized ? <Navigate to="/" /> : <AuthPage initialMethod="register" />;
  };

  // useEffect(()=>{
  //       axios.post('http://127.0.0.1:8000/authentication/token/hello/', {'email':'test@123gmail.com'})
  //       .then((response)=>{
  //           console.log("response: ", response)
  //       })
  //       .catch((error)=>{
  //         console.log('error', error)
  //       })
        
  // }, [])

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login/callback" element={<RedirectGoogleAuth />} />
         
          <Route path="/userdata" element={<Userdata/>} />

          <Route path="/login" element={<ProtectedLogin />} />
          <Route path="/register" element={<ProtectedRegister />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Select/>} />
          <Route path="/chatroom" element={<ChatRoom />} />
        </Routes>
      </BrowserRouter>
      <AvailableLocations />
    </div>
  );
};

export default App;
