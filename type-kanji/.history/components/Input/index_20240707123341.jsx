import React from "react";

export default function Input({ value }) {
  return (
    <div className="bg-yellow-600">
      <input className="w-full rounded-lg p-5" type="text" value={value} />
    </div>
  );
}
