"use client";
import React, { useState } from "react";
import Google from "../../../public/google.svg";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cookies } from "next/headers";

export default function Lgoin() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const HandleLogin = async () => {
    toast.loading("Logging in...");
    const response = await fetch(
      "https://server-1khw.onrender.com/home/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      }
    );

    const data = await response.json();
    console.log(data);

    if (data.user) {
      if (data.user["username"] === username) {
        toast.dismiss();
        console.log("Login Successful");
        toast.success("Login Successful");
        cookies.set("authToken", data.access);
        router.push("/");
      }
    } else {
      toast.dismiss();

      toast.error("Invalid Username or Password");
    }

    Cookies.set("access-token", data.access);
  };

  return (
    <main className="h-screen bg-[url('../public/LoginBg.png')] bg-no-repeat bg-cover bg-center ">
      <div className="h-[10%] w-full text-4xl font-bold text-[#D54B40] pt-10 pl-10">
        <a href="/">
          {" "}
          T<span className="text-white">Y</span>PE K
          <span className="text-white">A</span>NJI
        </a>
      </div>
      <div className="h-[90%] w-full flex justify-center items-center">
        <div className="border-y-4 border-x-2 border-white w-[550px] h-[670px] bg-[#363535] rounded-2xl ">
          <div className="font-bold h-1/4 text-5xl px-14 py-20 text-white text-center">
            Welcome Back!
          </div>
          <div className="h-2/4 p-10 text-white ">
            <div className="flex flex-col mb-5">
              <label className="mb-3 font-semibold">username / email</label>
              <input
                type="text"
                className="bg-black p-4 outline-none rounded-xl"
                placeholder="type your username / email here"
                value={username}
                onChange={({ target }) => {
                  setUsername(target.value);
                }}
              />
            </div>
            <div className="flex flex-col relative">
              <label className="mb-3 font-semibold">password</label>
              <input
                type="password"
                className="bg-black p-4 outline-none rounded-xl"
                placeholder="type your password here"
                value={password}
                onChange={({ target }) => {
                  setPassword(target.value);
                }}
              />
              <div className=" right-0 absolute -bottom-8">
                <a href="">Forgot Password?</a>
              </div>
            </div>
          </div>

          <div className="h-1/4 w-full px-10 flex flex-col mb-5 text-white">
            <button
              onClick={HandleLogin}
              className="bg-[#D54B40] p-3 mb-5 rounded-2xl font-bold text-2xl"
            >
              Login
            </button>
            <button className="bg-white border-2 border-[#D54B40] p-3 text-black rounded-2xl">
              <div className="flex  justify-center items-center">
                <span className="mr-3 font-semibold text-xl">
                  Continue with Google
                </span>
                <Image src={Google} width={30} height={30} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
