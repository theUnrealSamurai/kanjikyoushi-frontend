import React from "react";
import Input from "../Input";
import KanjiCard from "../../components/KanjiCard";
import WordCard from "../../components/WordCard";

export default function Practice() {
  return (
    <section>
      <div className="w-[80%] pt-10 pb-7 px-14  bg-[#453F3F] border-[#D54B40] text-white rounded-2xl border-4 ml-36 my-10 text-2xl ">
        <div className="w-full  flex justify-end ">
          <p>
            Sentence:{" "}
            <span className="bg-[#D54B40] text-black p-2 px-5 rounded-full font-bold">
              223
            </span>
          </p>
        </div>
        <div className=" mb-4 ">
          <p className="text-3xl font-black ">
            自分自身について知らないことがある。
          </p>
          <p className="font-light mt-2">
            There is something about yourself that you don't know
          </p>
        </div>
        <div className="mb-4">
          <Input />
        </div>
        <div>
          <p className="text-xl font-normal">
            jibun jishin ni tsuite shiranai koto ga aru
          </p>
        </div>
      </div>
      <div className="ml-20 mb-10">
        <h1 className="text-4xl font-semibold text-white">Kanji</h1>
        <div className="flex gap-6 overflow-x-scroll none-scroll rounded-2xl mt-5 ml-24 relative ">
          <KanjiCard />
          <KanjiCard />
          <KanjiCard />
          <KanjiCard />
          <KanjiCard />
          <KanjiCard />
        </div>
      </div>
      <div className="ml-20 ">
        <h1 className="text-4xl font-semibold text-white">Words</h1>
        <div className="flex gap-6 overflow-x-scroll none-scroll rounded-3xl mt-5 ml-24 relative ">
          <WordCard />
          <WordCard />
          <WordCard />
          <WordCard />
          <WordCard />
        </div>
      </div>
    </section>
  );
}
