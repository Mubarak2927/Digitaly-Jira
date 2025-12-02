import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WhiteBoard from "./AdminDashboard/WhiteBoard";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ForgetPassword from "./Pages/ForgetPassword";
import ResetPassword from "./Pages/ResetPassword";
import CompleteSprints from "./AdminDashboard/ProductBacklog/completeSprint";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<WhiteBoard/>}/>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/ForgetPassword" element={<ForgetPassword/>}/>
        <Route path="/ResetPassword" element={<ResetPassword/>}/>
        <Route path="/completeSprint" element={<CompleteSprints/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
