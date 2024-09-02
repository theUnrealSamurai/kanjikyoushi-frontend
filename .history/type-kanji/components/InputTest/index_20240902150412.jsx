import React, { useState, useEffect } from "react";

export default function InputTest({ value, onClick, expected, onSkip }) {
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
            ? " bg-[#ff6155] hover:bg-[#e66e65]"
            : "bg-[#D54B40] cursor-not-allowed"
        }`}
      >
        Submit
      </button>
      <button
        onClick={onSkip}
        className="bg-[#ff6155] w-1/6 hover:bg-[#e66e65] p-2 m-2 rounded-2xl font-bold text-black"
      >
        Skip
      </button>
    </div>
  );
}
