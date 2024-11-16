import React, { useState } from 'react';

interface KanjiData {
    kanji: string;
    on_readings: string[];
    kun_readings: string[];
    meanings: string[];
}


const StarIcon: React.FC<{ filled: boolean; onClick: (e: React.MouseEvent) => void }> = ({ filled, onClick }) => (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill={filled ? "#D54B40" : "#000000"}
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="cursor-pointer"
        onClick={onClick}
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

export default function KanjiCard({ kanjidata }: { kanjidata: KanjiData }) {
    const [expanded, setExpanded] = useState(false);
    const [rating, setRating] = useState(4);

    const handleStarClick = (starIndex: number) => {
        setRating(starIndex + 1);
    };

    return (
        <div
            className="kanji-card bg-black text-white m-2 rounded-2xl h-fit items-center cursor-pointer"
            onClick={() => setExpanded(!expanded)}
        >
            <div className="flex flex-row m-2 items-center w-64">
                {/* Kanji */}
                <div className="w-1/4 items-center p-1">
                    <p className="kanji font-bold text-4xl text-center py-1 pl-1">{kanjidata.kanji}</p>
                </div>

                {/* Stars */}
                <div className="w-3/4 flex justify-evenly">
                    <span className="rating" data-rating={rating} style={{ display: 'none' }}>{rating}</span>
                    {[...Array(4)].map((_, index) => (
                        <StarIcon
                            key={index}
                            filled={index < rating}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleStarClick(index);
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Expanded Information */}
            {expanded && (
                <div className="flex flex-col text-xs p-2">
                    <p className="py-1"><span className="font-bold mr-1">Onyomi: </span>{kanjidata.on_readings.join(", ")}</p>
                    <p className="py-1"><span className="font-bold mr-1">Kunyomi: </span>{kanjidata.kun_readings.join(", ")}</p>
                    <p className="py-1"><span className="font-bold mr-1">Meanings: </span>{kanjidata.meanings.join(", ")}</p>
                </div>
            )}
        </div>
    );
}