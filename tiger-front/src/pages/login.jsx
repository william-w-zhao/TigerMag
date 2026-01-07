import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, loginWithGoogle } from "../auth";
import LoginButton from "../components/LoginButton";
import Navbar from "../components/Navbar";

const Login = () => {
    return (
    <div>
      <Navbar></Navbar>
      <h1>Login</h1>
      <LoginButton/>
    </div>
  );
}

export default Login
