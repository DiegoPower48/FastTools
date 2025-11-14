"use client";

import React, { useState } from "react";
import Login from "./login";
import Register from "./register";
import { Button } from "./ui/button";
import { loginWithGoogle } from "@/firebase/auth";
import toast from "react-hot-toast";
import { IconBrandGoogle } from "@tabler/icons-react";

export default function AuthenticateForm({ theme, textTheme }) {
  const [modo, setModo] = useState("login");

  const handleGoogleLogin = () => {
    loginWithGoogle((res) => {
      if (res.success) {
        toast.success("Sesión iniciada con Google");
      } else {
        toast.error(res.error.message);
      }
    });
  };

  return (
    <>
      <div className="w-full items-center justify-center flex gap-2">
        <Button
          variant="ghost"
          className="font-bold p-2 rounded"
          style={{
            color: modo === "login" ? textTheme : theme,
            border: modo === "login" ? "2px solid white" : "",
            backgroundColor: modo === "login" ? theme : `${theme}40`,
          }}
          onClick={() => setModo("login")}
        >
          LOGIN
        </Button>
        <Button
          variant="ghost"
          style={{
            color: modo === "register" ? textTheme : theme,
            border: modo === "register" ? "2px solid white" : "",
            backgroundColor: modo === "register" ? theme : `${theme}40`,
          }}
          className="font-bold p-2 rounded"
          onClick={() => setModo("register")}
        >
          REGISTER
        </Button>
        <Button
          variant="ghost"
          style={{
            color: modo === "google" ? textTheme : theme,
            border: modo === "google" ? "2px solid white" : "",
            backgroundColor: modo === "google" ? theme : `${theme}40`,
          }}
          className="font-bold p-2 rounded flex items-center gap-2"
          onClick={() => setModo("google")}
        >
          <IconBrandGoogle /> GOOGLE
        </Button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center ">
        {modo === "login" && <Login theme={theme} textTheme={textTheme} />}
        {modo === "register" && (
          <Register theme={theme} textTheme={textTheme} />
        )}
        {modo === "google" && (
          <div>
            <button
              onClick={handleGoogleLogin}
              className="flex items-center gap-2 border p-2 rounded hover:bg-gray-100"
            >
              <img src="/google.svg" className="w-5" />
              Continuar con Google
            </button>
          </div>
        )}
      </div>
    </>
  );
}
