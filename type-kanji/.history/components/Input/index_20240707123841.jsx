import React from "react";

export default function Input({ value, onClick }) {
  return (
    <div className="bg-black overflow-hidden flex rounded-3xl">
      <input
        className="w-5/6 ml-3 p-1 bg-black outline-none"
        type="text"
        value={value}
      />
      <button  className="bg-[#D54B40] w-1/6  p-2 m-2 rounded-2xl font-bold text-black">Submit</button>
    </div>
  );
}
