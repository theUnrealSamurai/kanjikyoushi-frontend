import React from "react";

export default function Input({ value }) {
  return (
    <div className="bg-black overflow-hidden rounded-xl">
      <input
        className="w-5/6  p-2 bg-black outline-none"
        type="text"
        value={value}
      />
      <button className="bg-[#D54B40] w-1/6 text-white p-2 m- ">Submit</button>
    </div>
  );
}
