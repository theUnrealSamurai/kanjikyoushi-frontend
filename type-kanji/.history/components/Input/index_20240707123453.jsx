import React from "react";

export default function Input({ value }) {
  return (
    <div className="bg-yellow-600">
      <input className="w-full rounded-xl p-2 bg-black outline-none" type="text" value={value} />
            
    </div>
  );
}
