import React from "react";

export default function NavBar() {
  return (
    <nav className="w-screen flex justify-center ">
      <div className="w-[98%]  flex justify-between mt-4 bg-[#393838] p-5 rounded-2xl  drop-shadow-sm  ">
        <div className="w-4/5 h-full ">
          <p className="font-bold text-[#D54B40] ">
            T<span className="text-white">Y</span>PE K
            <span className="text-white">A</span>NJI
          </p>
        </div>
        <div className="flex w-1/5 justify-evenly text-white font-bold">
          <h4 className="cursor-pointer hover:text-[#D54B40] ">
            {" "}
            <a href="/">HOME</a>{" "}
          </h4>
          <h4 className="cursor-pointer hover:text-[#D54B40] ">
            <a href="/practice">TYPE</a>
          </h4>
          <h4 className="cursor-pointer hover:text-[#D54B40] ">
            <a href="/">STATS</a>
          </h4>
          <h4 className="cursor-pointer hover:text-[#D54B40] ">
            <a href="/">ABOUT</a>
          </h4>
        </div>
      </div>
    </nav>
  );
}
