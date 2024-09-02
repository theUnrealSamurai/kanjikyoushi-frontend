"use client";
import React, { useState } from "react";
import Google from "../../../public/google.svg";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignUp() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [Cpassword, setCpassword] = useState("");

  const HandleSignup = async () => {
    if (password !== Cpassword) {
      toast.error("Password and Confirm Password does not match");
      return;
    }
    const response = await fetch(
      "https://server-1khw.onrender.com/home/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: Cpassword,
          email: email,
        }),
      }
    );

    const data = await response.json();

    if (data.user["username"] === username) {
      console.log("Sign u Successful");
      router.push("/");
    } else {
      alert("Invalid Username or Password");
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
        <div className="border-y-4 border-x-2 border-white w-[550px] h-[870px] bg-[#363535] rounded-2xl ">
          <div className="font-bold h-1/6 text-5xl px-14 py-20 text-white text-center">
            Sign Up!
          </div>
          <div className="h-3/6 pt-10 px-10 text-white ">
            <div className="flex flex-col mb-5">
              <label className="mb-3 font-semibold">username</label>
              <input
                type="text"
                className="bg-black p-4 outline-none rounded-xl"
                placeholder="type your username here"
                value={username}
                onChange={({ target }) => {
                  setUsername(target.value);
                }}
              />
            </div>
            <div className="flex flex-col mb-5">
              <label className="mb-3 font-semibold">email</label>
              <input
                type="email"
                className="bg-black p-4 outline-none rounded-xl"
                placeholder="type your email here"
                value={email}
                onChange={({ target }) => {
                  setEmail(target.value);
                }}
              />
            </div>
            <div className="flex flex-col mb-5">
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
            </div>

            <div className="flex flex-col relative">
              <label className="mb-3 font-semibold">confirm password</label>
              <input
                type="password"
                className="bg-black p-4 outline-none rounded-xl"
                placeholder="type your confirm password here"
                value={Cpassword}
                onChange={({ target }) => {
                  setCpassword(target.value);
                }}
              />
            </div>
          </div>

          <div className="h-1/6 w-full px-10 pt-24 flex flex-col mb-5 text-white">
            <button
              onClick={HandleSignup}
              className="bg-[#D54B40] p-3 mb-5 rounded-2xl font-bold text-2xl"
            >
              Sign Up
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
