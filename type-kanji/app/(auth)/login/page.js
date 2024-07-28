import React from "react";
import Google from "../../../public/google.svg";
import Image from "next/image";

export default function Lgoin() {
  return (
    <main className="h-screen bg-[url('../public/LoginBg.png')] bg-cover bg-center bg-no-repeat ">
      <div className="h-[10%] w-full text-4xl font-bold text-[#D54B40] pt-10 pl-10">
        T<span className="text-white">Y</span>PE K
        <span className="text-white">A</span>NJI
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
                type="email"
                className="bg-black p-4 outline-none rounded-xl"
                placeholder="type your username / email here"
              />
            </div>
            <div className="flex flex-col relative">
              <label className="mb-3 font-semibold">password</label>
              <input
                type="password"
                className="bg-black p-4 outline-none rounded-xl"
                placeholder="type your password here"
              />
              <div className=" right-0 absolute -bottom-8">
                <a href="">Forgot Password?</a>
              </div>
            </div>
          </div>

          <div className="h-1/4 w-full px-10 flex flex-col text-white">
            <button className="bg-[#D54B40] p-3 mb-5 rounded-2xl font-bold text-2xl">
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
