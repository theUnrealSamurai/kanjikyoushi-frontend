import React from "react";

export default function Input({value}) {
  return (
    <div className="bg-yellow-600">
      <input className="w-ful" type="text" value={value} />
    </div>
  );
}
