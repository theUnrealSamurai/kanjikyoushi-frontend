import React from "react";

export default function Input({ value }) {
  return (
    <div className="bg-black overflow-hidden flex rounded-2xl">
      <input
        className="w-5/6  p-1 bg-black outline-none"
        type="text"
        value={value}
      />
      <button className="bg-[#D54B40] w-1/6 text-white p-2 m-2 rounded-xl ">Submit</button>
    </div>
  );
}
