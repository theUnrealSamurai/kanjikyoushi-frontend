import React from "react";

export default function WordCard() {
  return (
    <div className="w-80 h-32 flex flex-shrink-0 text-white  overflow-hidden bg-black rounded-3xl">
      <div className="flex justify-center items-center w-1/3 h-full ">
        <p className="text-5xl font-bold ">自分</p>
      </div>
      <div className="w-2/3 flex justify-center font-bold flex-col items-start h-full ">
        <p>oneself / myself</p>
      </div>
    </div>
  );
}
