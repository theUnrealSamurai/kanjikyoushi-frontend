import React, { useState, useEffect } from "react";

export default function Input({ value, onClick, expected }) {
  const [inputValue, setInputValue] = useState(value || "");

  // Check if the inputValue matches the expected value
  const isMatching = inputValue === expected;

  useEffect(() => {
    // Update the input value if the prop `value` changes
    setInputValue(value || "");
  }, [value]);

  return (
    <div className="bg-black overflow-hidden flex rounded-3xl">
      <input
        className="w-5/6 ml-10 p-1 placeholder:font-light placeholder:text-lg bg-black outline-none"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type the above sentence here"
      />
      <button
        onClick={onClick}
        disabled={!isMatching} // Disable the button if `isMatching` is false
        className={`w-1/6 p-2 m-2 rounded-2xl font-bold text-black ${
          isMatching
            ? "bg-[#D54B40] hover:bg-[#e66e65]"
            : "bg-red- cursor-not-allowed"
        }`}
      >
        Submit
      </button>
    </div>
  );
}
