import React from "react";

export default function NavBar() {
  return (
    <nav className="w-screen flex justify-center ">
      <div className="w-[98%]  flex justify-between mt-4 bg-[#393838] p-5 rounded-2xl shadow-md shadow-white  ">
        <div className="w-4/5 h-full ">
          <p>
            T <span>Y</span> PE K <span>A</span> NJI
          </p>
        </div>
        <div className="flex w-1/5 justify-evenly">
          <h4>HOME</h4>
          <h4>TYPE</h4>
          <h4>STATS</h4>
          <h4>ABOUT</h4>
        </div>
      </div>
    </nav>
  );
}
