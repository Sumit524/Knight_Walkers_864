import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/utilities/Navbar";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import { useAuthentication } from "./components/auth/auth";
import RedirectGoogleAuth from "./components/utilities/GoogleRedirectHandler";
import ChatRoom from "./components/chatRoom/ChatRoom";
import AvailableLocations from './locations/AvailableLocations';
import FindMatch from "./locations/FindMatch";

const App: React.FC = () => {
  const { isAuthorized } = useAuthentication();

  const ProtectedLogin: React.FC = () => {
    return isAuthorized ? <Navigate to="/" /> : <AuthPage initialMethod="login" />;
  };

  const ProtectedRegister: React.FC = () => {
    return isAuthorized ? <Navigate to="/" /> : <AuthPage initialMethod="register" />;
  };

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login/callback" element={<RedirectGoogleAuth />} />
          <Route path="/login" element={<ProtectedLogin />} />
          <Route path="/register" element={<ProtectedRegister />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/chatroom" element={<ChatRoom />} />
          <Route path="/locations" element={<AvailableLocations />} />
          <Route path="/findMatch" element={<FindMatch/>}/>
        </Routes>
      </BrowserRouter>
      
    </div>
  );
};

export default App;
