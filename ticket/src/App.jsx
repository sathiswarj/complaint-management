import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from "./User/Register";
import Login from "./User/Login";
import Home from "./User/Home";
import Complaints from './User/Complaints';
import AdminPage from "./Admin/AdminPage";
import Navbar from "./User/Navbar";
import AdminLogin from "./Admin/AdminLogin";
import ViewComplaint from "./Admin/ViewComplaint";
import AdminNavbar from './Admin/AdminNavbar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="home" element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="my-complaints" element={<Complaints />} />
        </Route>
        <Route path="/admin/*" element={
          <>
            <AdminNavbar />
            <Routes>
              <Route path="/" element={<AdminLogin />} />
              <Route path="panel" element={<AdminPage />} />
              <Route path="view-complaint/:id" element={<ViewComplaint />} />
            </Routes>
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
