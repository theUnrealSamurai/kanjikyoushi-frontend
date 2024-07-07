import React from "react";

export default function Input({ value }) {
  return (
    <div className="bg-yellow-600">
      <input className="w-5/6 rounded-xl p-2 bg-black outline-none" type="text" value={value} />
        <button className="bg-[#D54B40] text-white p-2 rounded-xl">Submit</button>
    </div>
  );
}
