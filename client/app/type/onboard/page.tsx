"use client";

import React, { useState } from 'react';
import kanjiData from "@/json/kanjiList.json";
import Cookies from "js-cookie";


type KanjiData = {
    [level: string]: string[][];
};

const kanjiJson: KanjiData = kanjiData;

export default function Onboard() {
    const levels = ['N5', 'N4', 'N3', 'N2', 'N1', 'N1+'];
    const [selectedKanji, setSelectedKanji] = useState<Set<string>>(new Set());

    const toggleLevel = (level: string) => {
        const newSelected = new Set(selectedKanji);
        kanjiJson[level].forEach(list => {
            list.forEach(kanji => {
                if (newSelected.has(kanji)) {
                    newSelected.delete(kanji);
                } else {
                    newSelected.add(kanji);
                }
            });
        });
        setSelectedKanji(newSelected);
    };

    const toggleList = (level: string, listIndex: number) => {
        const newSelected = new Set(selectedKanji);
        kanjiJson[level][listIndex].forEach(kanji => {
            if (newSelected.has(kanji)) {
                newSelected.delete(kanji);
            } else {
                newSelected.add(kanji);
            }
        });
        setSelectedKanji(newSelected);
    };

    const toggleKanji = (kanji: string) => {
        const newSelected = new Set(selectedKanji);
        if (newSelected.has(kanji)) {
            newSelected.delete(kanji);
        } else {
            newSelected.add(kanji);
        }
        setSelectedKanji(newSelected);
    };

    const handleSubmit = async () => {
        const authkey = Cookies.get("accessToken");
        const kanjiString = Array.from(selectedKanji).join('');
        const response = await fetch(
            process.env.NEXT_PUBLIC_HOST + "/type/onboard",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + authkey
                },
                body: JSON.stringify({
                    "kanji_list": kanjiString,
                }),
            }
        );
        if (response.ok) {
            window.location.href = '/type/practice';
        } else {
            alert("Something didn't go right.");
        }
    };

    return (
        <div className='h-screen flex flex-col'>
            <div className='flex-1 overflow-y-auto'>
                <div className='flex justify-center'>
                    <h1 className='text-2xl font-bold text-white mt-10'>Hey! before we begin let&apos;s quickly pick everything that you already know</h1>
                </div>
                <div className='border-2 my-5 mx-auto mb-24 w-[70%] flex flex-col items-center bg-[#453F3F] rounded-3xl p-12'>
                    {levels.map((level, index) => (
                        <div key={`level-${index}`} className='w-full mb-6'>
                            <div className='flex flex-row items-center mb-4'>
                                <h1 className='font-bold text-2xl text-main-red'>{level}</h1>
                                <input
                                    type="checkbox"
                                    className='ml-4 w-6 h-6'
                                    id={`level-checkbox-${index}`}
                                    onChange={() => toggleLevel(level)}
                                    checked={kanjiJson[level].every(list => list.every(kanji => selectedKanji.has(kanji)))}
                                />
                            </div>
                            {kanjiJson[level].map((kanjiList, levelIndex) => (
                                <div key={`list-${level}-${levelIndex}`} className='flex flex-row'>
                                    <div className='w-6 flex-shrink-0'>
                                        <input
                                            type="checkbox"
                                            className='w-4 h-4'
                                            onChange={() => toggleList(level, levelIndex)}
                                            checked={kanjiList.every(kanji => selectedKanji.has(kanji))}
                                        />
                                    </div>
                                    <div className="flex flex-wrap text-white mb-4 ml-2 flex-grow">
                                        {kanjiList.map((kanji) => (
                                            <div
                                                key={kanji}
                                                className="m-1 text-xl font-bold"
                                                onClick={() => toggleKanji(kanji)}
                                            >
                                                <div
                                                    className={`p-2 border-2 ${selectedKanji.has(kanji) ? 'border-main-red' : 'border-white'} hover:border-main-red rounded-xl bg-black cursor-pointer`}
                                                >
                                                    {kanji}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className='flex justify-center'>
                    <button
                        type="submit"
                        className="-mt-20 mb-40 bg-main-red rounded-2xl px-4 py-2"
                        onClick={handleSubmit}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
