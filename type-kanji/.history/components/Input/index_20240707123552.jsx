import React from "react";

export default function Input({ value }) {
  return (
    <div className="bg-black rounded-xl">
      <input className="w-5/6  p-2  outline-none" type="text" value={value} />
      <button className="bg-[#D54B40] w-1/6 text-white p-2 ">Submit</button>
    </div>
  );
}
