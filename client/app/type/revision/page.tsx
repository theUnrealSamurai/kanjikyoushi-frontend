"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Explanations from "@/components/Explanations";
import KanjiStarCard from "@/components/KanjiStarCard";
import Link from "next/link";

interface KanjiData {
    kanji: string;
    on_readings: string[];
    kun_readings: string[];
    meanings: string[];
}

export default function Revision() {
    const [jpSentence, setJpSentence] = useState("");
    const [romaji, setRomaji] = useState("");
    const [engSentence, setEngSentence] = useState("");
    const [isEnRomajiVisible, setIsEnRomajiVisible] = useState(false);
    const [dueKanjis, setDueKanjis] = useState([]);
    const [explanations, setExplanations] = useState<string[]>([]);
    const [isExplanationsVisible, setIsExplanationsVisible] = useState(false);
    const [kanji, setKanji] = useState<KanjiData[]>([]);

    const fetchRevision = async () => {
        const authkey = Cookies.get("accessToken");
        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_HOST + "/type/render_revision",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + authkey
                    },
                }
            );
            const data = await response.json();

            if (response.ok) {
                if (data.message === "No cards to revise") {
                    return <RevisionNotAvailable />
                }
                setJpSentence(data.japanese);
                setRomaji(data.romaji);
                setEngSentence(data.english);
                setExplanations(data["definitions"]);
                setDueKanjis(data.due_kanji || []);
                setKanji(data["kanji_data"]);
            } else {
                alert("Something went wrong.");
            }
        } catch (error) {
            console.error("Error fetching revision:", error);
        }
    };

    const submitRating = async () => {
        const authkey = Cookies.get("accessToken");

        // Get a dict of all the kanji and their ratings from the front end
        let ratings: { [key: string]: string } = {};
        let kanjiCards = document.getElementsByClassName("kanji-card");
        console.log(kanjiCards);
        for (let i = 0; i < kanjiCards.length; i++) {
            let kanji = kanjiCards[i].querySelector(".kanji")?.textContent;
            let ratingElement = kanjiCards[i].querySelector(".rating");
            let rating = ratingElement ? parseInt(ratingElement.textContent || '0', 10) : 0;
            if (kanji) {
                if (rating  === 1)
                    ratings[kanji] = "again";
                else if (rating === 2)
                    ratings[kanji] = "hard";
                else if (rating === 3)
                    ratings[kanji] = "good";
                else if (rating === 4)
                    ratings[kanji] = "easy";
            }
        }

        console.log(ratings);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_HOST}/type/update_revision`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authkey}`
                    },
                    body: JSON.stringify({
                        "kanji_rating_dict": ratings
                    }),
                }
            );
            if (response.ok) {
                await fetchRevision();
            } else {
                console.error("Failed to update revision:", await response.text());
            }
        } catch (error) {
            console.error("Error updating revision:", error);
        }
    }


    useEffect(() => {
        fetchRevision();
    }, []);

    const handleEnglishVisibility = () => {
        setIsEnRomajiVisible(!isEnRomajiVisible);
    };

    const handleExplanationsVisibility = () => {
        setIsExplanationsVisible(!isExplanationsVisible);
    };

    return (
        <div className="h-full flex flex-col overflow-hidden items-center">
            {/* First box container */}
            <div className="w-3/4 max-w-4xl ml-5 mt-6">
                {/* Title for the first box */}
                <h2 className="text-white font-bold text-left mb-2">Read the sentence and rate the kanji based on how well you remember it</h2>
                {/* First box */}
                <div className="bg-[#453F3F] flex flex-col text-white box-border w-full rounded-3xl border-2 border-main-red drop-shadow-2xl shadow-white">
                    <div className="m-2 flex flex-col">
                        <p className="font-bold mx-1 ml-4 mt-2 text-2xl">{jpSentence}</p>
                        {!isEnRomajiVisible ? (
                            <button
                                onClick={handleEnglishVisibility}
                                className="m-2 ml-4 bg-main-red rounded-lg font-bold px-2 py-1 w-40">
                                Show Translation
                            </button>
                        ) : (
                            <div>
                                <p className="mx-1 ml-4 mt-4">{engSentence}</p>
                                <p className="mx-1 ml-4">{romaji}</p>
                            </div>
                        )}
                        <div className="flex my-1 mr-4 justify-end">
                            <button
                                className="bg-main-red rounded-lg font-bold px-2 py-1 w-32"
                                onClick={submitRating}>
                                Next Sentence
                            </button>
                        </div>

                    </div>
                </div>
            </div>


            {/* Kanji Cards with stars */}
            <div className="w-[80%] ml-5 mt-5">
                <h3 className="text-2xl font-bold text-white">Kanji</h3>
                <div className="flex flex-col text-white box-border w-full rounded-3xl">
                    <div className="flex overflow-x-auto p-4 scrollbar-thin scrollbar-thumb-main-red scrollbar-track-gray-700">
                        <div className="flex flex-nowrap">
                            {kanji.map((item, index) => (
                                <KanjiStarCard key={item.kanji} kanjidata={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            

            {/* Third box container */}
            <div className="w-[80%] ml-5 mt-2">
                {/* Title for the second box */}
                <h3 className="text-white font-bold text-left mb-2 text-2xl">Upcoming Kanjis for Revision: <span className="p-1 bg-main-red rounded-xl m-1">{dueKanjis.length}</span></h3>
                {/* Upcoming Kanjis */}
                <div className="flex flex-col text-white box-border w-full rounded-3xl">
                    {/* Due Kanji list */}
                    <div className="flex overflow-x-auto p-4 scrollbar-thin scrollbar-thumb-main-red scrollbar-track-gray-700">
                        <div className="flex flex-nowrap">
                            {dueKanjis.map((kanji) => dueKanji(kanji))}
                        </div>
                    </div>
                </div>


                {/* Explanations container */}
                <div className=" flex flex-col w-full mt-3">
                    {/* Title and button for the explanations */}
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-white font-bold text-left text-2xl">Words and Explanations</h2>
                        <button
                            onClick={handleExplanationsVisibility}
                            className="bg-main-red rounded-lg font-bold px-2 py-1 w-40 text-white"
                        >
                            {isExplanationsVisible ? "Hide Explanations" : "Show Explanations"}
                        </button>
                    </div>

                    {/* Explanations box */}
                    {isExplanationsVisible && (
                        <div className="flex flex-col text-white box-border rounded-3xl ">
                            <div className="p-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-main-red scrollbar-track-gray-700">
                                {explanations.map((item, index) => (
                                    <Explanations key={index} explanations={item} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}


 function RevisionNotAvailable() {
    return (
        <div className="min-h-screen overflow-hidden flex flex-col bg-main-gray">
            <div className="flex flex-grow flex-col justify-center items-center py-8">
                <div className="-mt-24 flex flex-col items-center text-white">
                    <h1 className="font-bold text-3xl md:text-4xl px-5 pb-2 text-center">No Cards to Revise</h1>
                    <p className="px-7 py-2 text-center max-w-[80%]">
                        You've completed all your revisions for now. Great job! Learn more in the Practice page or come back later to continue improving your skills.
                    </p>
                    <Link href="type/practice" className="py-2 px-4 m-3 font-bold text-xl md:text-2xl text-center text-white rounded-xl bg-main-red">
                        <h2>Keep learning and practicing!</h2>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function dueKanji(kanji: string) {
    return (
        <div key={kanji} className="bg-black w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-xl m-2">
            <p className="font-bold text-2xl">{kanji}</p>
        </div>
    );
}
