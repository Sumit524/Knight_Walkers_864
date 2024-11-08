import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate, } from "react-router-dom";
import Navbar from "./components/utilities/Navbar";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import ChatRoom from "./components/chatRoom/ChatRoom";
import AvailableLocations from './locations/AvailableLocations';
import TodoHome from "./components/todo/TodoHome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import Activate from "./pages/Activate";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./app/store";
import { check_authenticated, load_user } from "./feature/auth/authActions";
import FindMatch from "./locations/FindMatch";

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
        <Navbar />
        <Routes>
          <Route path="/login" element={auth.isAuthenticated? <Navigate to={'/'}/> : <Login />} />
          <Route path="/signup" element={<Signup />}/>
          <Route path="/" element={auth.isAuthenticated ? <Home />: <Navigate to={'/login'} />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/chatroom" element={<ChatRoom />} />
          <Route path="/reset-password" element={<ResetPassword />}/>
          <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirm />}/>
          <Route path="/activate/:uid/:token" element={<Activate />}/>
          <Route path="/locations" element={<AvailableLocations />} />
          <Route path="/findMatch" element={<FindMatch/>}/>
        </Routes>
      </BrowserRouter>
      
    </div>
  );
};

export default App;
