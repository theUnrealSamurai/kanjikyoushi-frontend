"use client";
import React, { useState, useEffect } from "react";
import Input from "../../../components/InputTest";
import Cookies from "js-cookie";

export default function test() {
  const [sentence, setSentence] = useState("");
  const [translation, setTranslation] = useState("");

  const [count, setCount] = useState(0);

  const authkey = Cookies.get("authToken");

  const [inputValue, setInputValue] = useState("");

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

  const HandleOnSkip = async () => {
    const re

  return (
    <section className="min-h-screen">
      {/* Test Button and the test counter */}
      <div className="font-extrabold text-2xl pl-20 text-white pt-10">
        <p>
          Test:{" "}
          <span className="bg-[#D54B40] text-white p-2 px-5 rounded-full font-bold">
            20
          </span>
        </p>
      </div>

      {/* Typing Zone */}
      <div className="w-[80%] pt-10 pb-7 px-14  bg-[#453F3F] border-[#D54B40] text-white rounded-2xl border-4 ml-36 my-10 text-2xl ">
        {/* Japanese Sentence */}
        <div className=" mb-3 ">
          <p className="text-3xl font-black pl-10">{sentence}</p>
        </div>

        {/* Input Text Box */}
        <div className="mb-4">
          <Input
            expected={sentence}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
      </div>

      {/* Completed and Skipped Counter */}
      <div className="flex justify-center text-2xl font-extrabold text-white">
        {/* Completed Counter */}
        <span>
          Completed:{" "}
          <span className="bg-[#D54B40] text-white p-2 px-5 rounded-full font-bold">
            10
          </span>
        </span>

        {/* Skipped Counter */}
        <span className="pl-10">
          Skipped:{" "}
          <span className="bg-[#D54B40] text-white p-2 px-5 rounded-full font-bold">
            5
          </span>
        </span>
      </div>
    </section>
  );
}
