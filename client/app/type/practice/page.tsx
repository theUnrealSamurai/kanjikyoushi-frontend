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
        console.log(data["definitions"]);
        console.log(typeof data["definitions"]);

    };

    useEffect(() => {
        fetchSentence();
    }, []);


    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* The Box */}
            <div className="bg-[#453F3F] m-6 flex flex-col text-white box-border w-3/4 max-w-4xl ml-10 rounded-3xl border-2 border-main-red drop-shadow-2xl shadow-white">
                <div className="m-2 flex flex-col">
                    {/* Row 1 Kanji Count and the counter*/}
                    <div className="flex justify-end">
                        <p className="font-bold">Kanji Count: </p>
                        <p className="px-1 mx-2 bg-main-red rounded-lg font-bold">3856792</p>
                    </div>

                    {/* Row 2  Japanese Sentence*/}
                    <p className="font-bold mx-1 ml-4 mt-2 text-2xl">{jpSentence}</p>

                    {/* Row 3 English Translation*/}
                    <p className="font-bold m-1 ml-4">{engSentence}</p>

                    {/* Row 4  Input box and the Submit Button*/}
                    <div className="flex flex-row">
                        <input
                            type="text"
                            className="m-2 px-2 pl-2 w-full bg-black border-2 border-white rounded-lg
                        text-sm placeholder:font-light outline-none type=text placeholder:text-sm"
                            placeholder=" Enter the Japanese Sentence here"
                        />
                        <button className="m-2 p-2 px-4 bg-main-red rounded-2xl font-semibold">Submit</button>
                    </div>

                    {/* Row 5  romaji text*/}
                    <p className="m-1 ml-4">{romaji}</p>
                </div>
            </div>

            <div className="flex flex-row text-white ml-8 flex-grow overflow-hidden ">
                {/* kanji cards */}
                <div className="flex flex-col w-1/4 overflow-hidden mb-8">
                    <h2 className="m-2 text-2xl font-bold text-left">Kanji Cards</h2>
                    <div className="ml-4 overflow-y-auto flex-grow">
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

                {/* Explanations */}
                <div className="flex flex-col w-full overflow-hidden mb-8">
                    <h2 className="m-2 text-2xl font-bold text-left">Words and Explanations</h2>
                    <div className="ml-8 overflow-y-auto flex-grow">
                        {/* Explanations go here */}
                        {explanations.map((item, index) => (
                            <Explanations key={index} explanations={item} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
