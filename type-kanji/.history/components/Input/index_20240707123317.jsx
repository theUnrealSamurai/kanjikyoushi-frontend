import React from "react";

export default function Input({ value }) {
  return (
    <div className="bg-yellow-600">
      <input className="w-full" type="text" value={value} />
    </div>
  );
}
