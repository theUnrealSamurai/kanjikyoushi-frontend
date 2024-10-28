"use client";

import KanjiCard from "@/components/KanjiCard";
import Explanations from "@/components/Explanations";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";

interface KanjiData {
    kun_readings: string[];
    on_readings: string[];
    meanings: string[];
    kanji: string;
}


export default function Practice() {
    const authkey = Cookies.get("accessToken");
    const [jpSentence, setJpSentence] = useState("");
    const [romaji, setRomaji] = useState("");
    const [engSentence, setEngSentence] = useState("");
    const [kanji, setKanji] = useState<KanjiData[]>([]);
    const [explanations, setExplanations] = useState<string[]>([]);
    const [learnedKanji, setLearnedKanji] = useState<string[]>([]);


    const [userInput, setUserInput] = useState("");

    const handleSubmit = () => {
        if (userInput.trim() === jpSentence.trim()) {
            updatePractice();
            fetchSentence();
        } else {
            alert("Please correct your sentence and try again.");
        }
    };

    const updatePractice = async () => {
        const response = await fetch(
            process.env.NEXT_PUBLIC_HOST + "/type/update_practice",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + authkey,
                },
                body: JSON.stringify({
                    "sentence": userInput,
                }),
            }
        );
        const data = response.json();

        if (response.ok) {
            setUserInput("");
        }
        else {
            alert("Something didn't go right.");
        }
    };


    const fetchSentence = async () => {
        const response = await fetch(
            process.env.NEXT_PUBLIC_HOST + "/type/render_practice",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + authkey
                },
            }
        );
        const data = await response.json();
        console.log(data);
        setJpSentence(data["japanese"]);
        setRomaji(data["romaji"]);
        setEngSentence(data["english"]);
        setKanji(data["kanji_data"]);
        setExplanations(data["definitions"]);  
        setLearnedKanji(data["learned_kanji"]);

    };

    useEffect(() => {
        fetchSentence();
    }, []);


    return (
        <div className="h-full flex flex-col overflow-hidden items-center">
            {/* The Box */}
            <div className="bg-[#453F3F] m-6 flex flex-col text-white box-border w-3/4 max-w-4xl ml-10 rounded-3xl border-2 border-main-red drop-shadow-2xl shadow-white">
                <div className="m-2 flex flex-col">
                    {/* Row 1 Kanji Count and the counter*/}
                    <div className="flex justify-end mt-1">
                        <p className="font-bold">Kanjis Learned: </p>
                        <p className="px-1 mx-2 bg-main-red rounded-lg font-bold">{learnedKanji}</p>
                    </div>

                    {/* Row 2  Japanese Sentence*/}
                    <p className="font-bold mx-1 ml-4 mt-2 text-2xl">{jpSentence}</p>

                    {/* Row 3 English Translation*/}
                    <p className="font-bold m-1 ml-4">{engSentence}</p>

                    {/* Row 4  Input box and the Submit Button*/}
                    <div className="flex flex-row">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="m-2 px-2 pl-2 w-full bg-black border-2 border-white rounded-lg
                        text-sm placeholder:font-light outline-none type=text placeholder:text-sm"
                            placeholder=" Enter the Japanese Sentence here"
                        />
                        <button 
                            onClick={handleSubmit}
                            className="m-2 p-2 px-4 bg-main-red rounded-2xl font-semibold">Submit</button>
                    </div>

                    {/* Row 5  romaji text*/}
                    <p className="m-1 ml-4">{romaji}</p>
                </div>
            </div>

            {/* Kanji Cards and Explanations */}
            <div className="flex flex-col text-white ml-8 w-[80%]">
                {/* kanji cards */}
                <div className="flex flex-col mb-4">
                    <h2 className="mx-2 mt-2 text-2xl font-bold text-left">Kanji Cards</h2>
                    <div className="ml-4 pb-2 flex flex-row overflow-x-auto">
                        {/* Kanji Cards go here */}
                        {kanji.map((item, index) => (
                            <KanjiCard
                                key={`${item.kanji}-${index}`}
                                kanji={item.kanji}
                                onyomi={item.on_readings.join(", ")}
                                kunyomi={item.kun_readings.join(", ")}
                                meaning={item.meanings.join(", ")}
                            />
                        ))}
                    </div>
                </div>
            </div>


            {/* Explanations */}
            <div className="flex flex-col overflow-auto mb-8 ml-8 w-[80%] text-white">
                <h2 className="mx-2 mb-4 text-2xl font-bold text-left">Words and Explanations</h2>
                <div className="ml-4 overflow-y-auto flex-grow overflow-auto">
                    {explanations.map((item, index) => (
                        <Explanations key={index} explanations={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}
