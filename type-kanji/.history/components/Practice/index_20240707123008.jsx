import React from "react";
impor

export default function Practice() {
  return (
    <section>
      <div className="w-[80%] bg-[#453F3F] border-[#D54B40] text-white rounded-2xl border-2 ml-36 my-10 text-2xl p-24">
        <div className="w-full  flex justify-end ">
          <p>
            Sentence:{" "}
            <span className="bg-[#D54B40] text-black p-2 px-5 rounded-full font-bold">
              223
            </span>
          </p>
        </div>
        <div className=" ">
          <p className="text-3xl font-black ">
            自分自身について知らないことがある。
          </p>
          <p className="font-light mt-2">
            There is something about yourself that you don't know
          </p>
        </div>
        <div>
          <input type="text" />
        </div>
        <div>
          <p className="text-xl font-normal">jibun jishin ni tsuite shiranai koto ga aru</p>
        </div>
      </div>
    </section>
  );
}
