import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './component/ProtectedRoutes';
import Register from './component/Register';
import Login from './component/Login';
import AdminUserPage from './pages/AdminUserPage';
import AdminPostPage from './pages/PostPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import Unauthorized from './component/Unauthorized';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="/admin" element={<ProtectedRoute allowedRoles='ADMIN' />}>
        <Route index element={<AdminUserPage />} />
        <Route path="events" element={<AdminPostPage postType='EVENT'/>} />
        <Route path="jobs" element={<AdminPostPage postType='JOB'/>} />
        <Route path="news" element={<AdminPostPage postType='NEWS'/>} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/user" element={<ProtectedRoute allowedRoles='USER' />}>
        <Route index element={<AdminPostPage postType='EVENT'/>} />
        <Route path="jobs" element={<AdminPostPage postType='JOB'/>} />
        <Route path="news" element={<AdminPostPage postType='NEWS'/>} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
