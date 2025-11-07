import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WhiteBoard from "./AdminDashboard/WhiteBoard";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import EmployeeDashboard from './EmployeeDashboard/EmployeeDashboard'
// import ProtectedRoute from "./Components/ProtectedRoute";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
             <WhiteBoard/>
            </ProtectedRoute>
          }
        /> */}
        <Route path="/dashboard" element={<WhiteBoard/>}/>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/EmployeeDashboard'element={<EmployeeDashboard/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
