"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { login } from "../firebase/auth";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Login({ theme, textTheme }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, async (res, msg) => {
      if (res.success) {
        toast.success("Login successful");
        router.push("/welcome");
        if (msg === "LOGGED IN") {
          await handleLoginSuccess();
        }
      } else {
        if (res.error.code === "auth/invalid-credential") {
          toast.error("Email or password invalid");
        }
      }
    });
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col items-center justify-center">
        <Image src="/icono.png" alt="Logo" width={400} height={400} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center justify-center gap-6"
      >
        <div className="w-full">
          <label className="font-bold">EMAIL</label>
          <Input
            required
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="w-full">
          <label className="font-bold">PASSWORD</label>
          <Input
            required
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div className="w-full flex justify-center items-center">
          <Button
            style={{
              color: textTheme,
              backgroundColor: theme,
            }}
            className="w-3/4 hover:opacity-60"
          >
            LOGIN
          </Button>
        </div>
      </form>
    </div>
  );
}
