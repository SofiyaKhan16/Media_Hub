import { Routes, Route, useLocation } from "react-router-dom";
import Login from "../Pages/Account/Login";
import Home from "../Pages/Home/Home";
import ProtectedRoute from "./ProtectedRoute";
import Upload from "../Pages/Upload/Upload";
import Profile from "../Pages/Profile/Profile";
import Details from "../Pages/Details/Details";
import Header from "./Header";
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../Store/userSlice';
import { decodeJwtToken } from '../api/cookies';
import { useEffect } from 'react';


function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const user = decodeJwtToken('jwtToken');
    if (user) {
      dispatch(setUser(user));
    } else {
      dispatch(clearUser());
    }
  }, [location]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/details"
          element={
            <ProtectedRoute>
              <Details />
            </ProtectedRoute>
          }
        />
        <Route
          path="/details/:id"
          element={
            <ProtectedRoute>
              <Details />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </>
  );
}

export default AppContent;