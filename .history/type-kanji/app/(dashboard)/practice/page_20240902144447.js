"use client";
import React, { useEffect, useState } from "react";
import Input from "../../../components/Input";
import KanjiCard from "../../../components/KanjiCard";
import WordCard from "../../../components/WordCard";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function Practice() {
  const [sentence, setSentence] = useState("");
  const [translation, setTranslation] = useState("");

  const authkey = Cookies.get("authToken");

  const fetchSentence = async () => {
    const response = await fetch(
      "https://server-1khw.onrender.com/type/render_sentence",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authkey,
        },
      }
    );
    const data = await response.json();
    console.log(data);
    setSentence(data.sentence["japanese"]);
    setTranslation(data.sentence["english"]);
  };

  useEffect(() => {
    fetchSentence();
  }, []);

  const HandleSubmit = async () => {
    toast.loading("Checking sentence...");

    const Update_response = await fetch(
      "https://server-1khw.onrender.com/type/update_learning_sentence",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authkey,
        },
        body: JSON.stringify({ sentence: sentence }),
      }
    );

    const data = await Update_response.json();

    if (data.message === "Sentence updated successfully.") {
      toast.dismiss();
      toast.success("Sentence updated successfully.");
      
      fetchSentence();
    } else {
      toast.dismiss();
      toast.error(data.message);
    }
  };

  return (
    <section className="min-h-[88vh]">
      <div className="w-[80%]  pt-10 pb-7 px-14 bg-[#453F3F] border-[#D54B40] text-white rounded-2xl border-4 ml-36 my-10 text-2xl ">
        <div className="w-full  flex justify-end ">
          <p>
            Sentence:{" "}
            <span className="bg-[#D54B40] text-black p-2 px-5 rounded-full font-bold">
              223
            </span>
          </p>
        </div>
        <div className=" mb-4 ml-10 ">
          <p className="text-3xl font-black select-none">{sentence}</p>
          <p className="font-light mt-2">{translation}</p>
        </div>
        <div className="mb-4">
          <Input expected={sentence} onClick={HandleSubmit} />
        </div>
        <div className="ml-10">
          <p className="text-xl font-normal">
            jibun jishin ni tsuite shiranai koto ga aru
          </p>
        </div>
      </div>
      <div className="ml-20 mb-10">
        <h1 className="text-4xl font-semibold text-white">Kanji</h1>
        <div className="flex gap-6 overflow-x-scroll none-scroll rounded-2xl mt-5 ml-16 relative ">
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
        <div className="flex gap-6 overflow-x-scroll none-scroll rounded-3xl mt-5 ml-16 relative ">
          <WordCard />
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
