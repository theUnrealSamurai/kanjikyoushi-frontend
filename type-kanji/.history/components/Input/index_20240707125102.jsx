import React from "react";

export default function Input({ value, onClick }) {
  return (
    <div className="bg-black overflow-hidden flex rounded-4xl">
      <input
        className="w-5/6 ml-10 p-1 placeholder:font-light placeholder:text-lg bg-black outline-none"
        type="text"
        // value={value}
        placeholder="Type the above sentence here"
      />
      <button
        onClick={onClick}
        className="bg-[#D54B40] w-1/6 hover:bg-[#e66e65] p-2 m-2 rounded-3xl font-bold text-black"
      >
        Submit
      </button>
    </div>
  );
}
