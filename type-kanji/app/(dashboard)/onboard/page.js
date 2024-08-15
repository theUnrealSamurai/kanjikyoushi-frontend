"use client";
import React, { useState } from "react";
import CheckBox from "../../../components/CheckBox"; // Adjust the path as necessary
import axios from "axios";

const App = () => {
  const [selectedOptionsN5, setSelectedOptionsN5] = useState({});
  const [isAllSelectedN5, setIsAllSelectedN5] = useState(false);

  const [selectedOptionsN4, setSelectedOptionsN4] = useState({});
  const [isAllSelectedN4, setIsAllSelectedN4] = useState(false);

  const N5 = [
    { label: "山" }, // Mountain
    { label: "年" }, // Year
    { label: "村" }, // Village
    { label: "週" }, // Week
    { label: "木" }, // Tree/Wood
    { label: "気" }, // Spirit/Energy
    { label: "花" }, // Flower
    { label: "耳" }, // Ear
    { label: "日" }, // Sun/Day
    { label: "川" }, // River
    { label: "星" }, // Star
    { label: "雨" }, // Rain
    { label: "月" }, // Moon/Month
    { label: "水" }, // Water
    { label: "火" }, // Fire
    { label: "土" }, // Earth/Soil
    { label: "金" }, // Gold/Money
    { label: "風" }, // Wind
    { label: "空" }, // Sky/Empty
    { label: "音" }, // Sound
    { label: "石" }, // Stone
    { label: "海" }, // Sea
    { label: "魚" }, // Fish
    { label: "鳥" }, // Bird
    { label: "森" }, // Forest
    { label: "虎" }, // Tiger
    { label: "犬" }, // Dog
    { label: "猫" }, // Cat
    { label: "牛" }, // Cow
    { label: "馬" }, // Horse
    { label: "羊" }, // Sheep
    { label: "象" }, // Elephant
    { label: "亀" }, // Turtle
    { label: "鹿" }, // Deer
    { label: "草" }, // Grass
    { label: "虫" }, // Insect
    { label: "蛇" }, // Snake
    { label: "雲" }, // Cloud
    { label: "雪" }, // Snow
    { label: "雷" }, // Thunder
    { label: "電" }, // Electric
    { label: "夜" }, // Night
    { label: "昼" }, // Daytime
    { label: "朝" }, // Morning
    { label: "夕" }, // Evening
    { label: "虹" }, // Rainbow
    { label: "花" }, // Blossom
    { label: "山" }, // Summit
    { label: "火" }, // Blaze
    { label: "水" }, // Fluid
    { label: "木" }, // Timber
    { label: "森" }, // Grove
    { label: "海" }, // Ocean
  ];

  const N4 = [
    { label: "山" }, // Mountain
    { label: "年" }, // Year
    { label: "村" }, // Village
    { label: "週" }, // Week
    { label: "木" }, // Tree/Wood
    { label: "気" }, // Spirit/Energy
    { label: "花" }, // Flower
    { label: "耳" }, // Ear
    { label: "日" }, // Sun/Day
    { label: "川" }, // River
    { label: "星" }, // Star
    { label: "雨" }, // Rain
    { label: "月" }, // Moon/Month
    { label: "水" }, // Water
    { label: "火" }, // Fire
    { label: "土" }, // Earth/Soil
    { label: "金" }, // Gold/Money
    { label: "風" }, // Wind
    { label: "空" }, // Sky/Empty
    { label: "音" }, // Sound
    { label: "石" }, // Stone
    { label: "海" }, // Sea
    { label: "魚" }, // Fish
    { label: "鳥" }, // Bird
    { label: "森" }, // Forest
    { label: "虎" }, // Tiger
    { label: "犬" }, // Dog
    { label: "猫" }, // Cat
    { label: "牛" }, // Cow
    { label: "馬" }, // Horse
    { label: "羊" }, // Sheep
    { label: "象" }, // Elephant
    { label: "亀" }, // Turtle
    { label: "鹿" }, // Deer
    { label: "草" }, // Grass
    { label: "虫" }, // Insect
    { label: "蛇" }, // Snake
    { label: "雲" }, // Cloud
    { label: "雪" }, // Snow
  ];
  const SelectAllN5 = () => {
    return (
      <div
        className="flex items-center space-x-4 cursor-pointer"
        onClick={handleSelectAllN5}
      >
        <div
          className={`w-8 h-8 flex items-center justify-center ${
            isAllSelectedN5
              ? "border-4 border-red-500 rounded-xl"
              : "border-4 border-gray-300 rounded-xl"
          }`}
        >
          {isAllSelectedN5 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <span className="text-gray-500"></span>
          )}
        </div>
      </div>
    );
  };

  const SelectAllN4 = () => {
    return (
      <div
        className="flex items-center space-x-4 cursor-pointer"
        onClick={handleSelectAllN4}
      >
        <div
          className={`w-8 h-8 flex items-center justify-center ${
            isAllSelectedN4
              ? "border-4 border-red-500 rounded-xl"
              : "border-4 border-gray-300 rounded-xl"
          }`}
        >
          {isAllSelectedN4 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <span className="text-gray-500"></span>
          )}
        </div>
      </div>
    );
  };

  const handleCheckboxChangeN5 = (label, isChecked) => {
    setSelectedOptionsN5((prevState) => {
      const newState = { ...prevState, [label]: isChecked };
      sendDataToEndpoint(newState);
      return newState;
    });
  };

  const handleCheckboxChangeN4 = (label, isChecked) => {
    setSelectedOptionsN4((prevState) => {
      const newState = { ...prevState, [label]: isChecked };
      sendDataToEndpoint(newState);
      return newState;
    });
  };

  const handleSelectAllN5 = () => {
    const newSelectAllState = !isAllSelectedN5;
    const newState = {};

    N5.forEach((option) => {
      newState[option.label] = newSelectAllState;
    });

    setSelectedOptionsN5(newState);
    setIsAllSelectedN5(newSelectAllState);
    sendDataToEndpoint(newState);
  };

  const handleSelectAllN4 = () => {
    const newSelectAllState = !isAllSelectedN4;
    const newState = {};

    N4.forEach((option) => {
      newState[option.label] = newSelectAllState;
    });

    setSelectedOptionsN4(newState);
    setIsAllSelectedN4(newSelectAllState);
    sendDataToEndpoint(newState);
  };

  const sendDataToEndpoint = async (data) => {
    try {
      await axios.post("http://localhost:8000/knownkaji", {
        selectedOptions: data,
      });
      console.log("Data sent successfully:", data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div className="p-8 bg-[#363535] mx-10 mt-5 h-auto rounded-2xl border-8 border-[#696868]">
      <h1 className="text-5xl font-bold text-white my-10 mb-20">
        Before we Begin Let's quickly pick all the kanji that you already know
      </h1>

      {/* N5 Kanji */}
      <div>
        <div className="flex">
          <div className="text-4xl font-black text-white mr-4">
            N <span className="text-[#D54B40]">5</span>{" "}
          </div>
          <SelectAllN5 />
        </div>
        <div className="border-y-4 border-x-2 border-[#D54B40] w-full h-[520px] flex py-4 items-center justify-center rounded-2xl mt-5 ">
          <div className="w-full h-full flex flex-wrap  items-center ">
            {N5.map((option) => (
              <CheckBox
                key={option.label}
                label={option.label}
                onChange={handleCheckboxChangeN5}
                isChecked={selectedOptionsN5[option.label] || false}
              />
            ))}
          </div>
        </div>
      </div>

      {/* N4 Kanji */}
      <div className="mt-28">
        <div className="flex">
          <div className="text-4xl font-black text-white mr-4">
            N <span className="text-[#D54B40]">4</span>{" "}
          </div>
          <SelectAllN4 />
        </div>
        <div className="border-y-4 border-x-2 border-[#D54B40] w-full h-[520px] flex py-4 items-center justify-center rounded-2xl mt-5 ">
          <div className="w-full h-full flex flex-wrap  items-center ">
            {N4.map((option) => (
              <CheckBox
                key={option.label}
                label={option.label}
                onChange={handleCheckboxChangeN4}
                isChecked={selectedOptionsN4[option.label] || false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
