import React from "react";

export default function KanjiCard() {
  return (
    <div className="w-aut h-32 flex text-white overflow-hidden bg-black rounded-3xl">
      <div className="flex justify-center items-center w-1/3 h-full ">
        <p className="text-5xl font-bold ">分</p>
      </div>
      <div className="w-2/3 flex justify-center font-bold flex-col items-start h-full ">
        <h3>
          kun yomi: <span className="font-light">わける, ...</span>{" "}
        </h3>
        <h3>
          on yomi: <span className="font-light">ブン, フン</span>
        </h3>
        <h3>
          meaning: <span className="font-light">Minute</span>
        </h3>
      </div>
    </div>
  );
}
