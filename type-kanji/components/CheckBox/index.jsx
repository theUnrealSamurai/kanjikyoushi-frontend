import React from "react";

const CheckBox = ({ label, onChange, isChecked }) => {
  const toggleCheckbox = () => {
    onChange(label, !isChecked);
  };

  return (
    <div
      className="flex items-center space-x-4 ml-10 my-5 cursor-pointer "
      onClick={toggleCheckbox}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={toggleCheckbox}
          className="hidden"
        />
        <h1
          alt={label}
          className={`w-12 h-12 object-cover flex justify-center items-center bg-black p-8 text-white text-3xl font-black  ${
            isChecked ? "border-8 border-red-500 rounded-2xl" : "border-8 rounded-3xl border-gray-300"
          }`}
        >
          {label}
        </h1>
      </div>
    </div>
  );
};

export default CheckBox;
