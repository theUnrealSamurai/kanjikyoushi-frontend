interface KanjiData{
    kanji: string;
    onyomi: string;
    kunyomi: string;
    meaning: string;
}


export default function KanjiCard(kanjidata: KanjiData) {
    return (
        <div className="bg-black text-white m-2 rounded-2xl h-fit w-71">
            <div className="flex flex-row m-2 items-center">
                {/* Kanji */}
                <p className="font-bold text-4xl w-1/4 text-center">{kanjidata.kanji}</p>
                
                {/* Kanji Information */}
                <div className="flex flex-col text-xs w-3/4">
                    <p className="pt-2"> <span className="font-bold">Onyomi:  </span>{kanjidata.onyomi}</p>
                    <p className="py-2"> <span className="font-bold">Kunyomi: </span>{kanjidata.kunyomi}</p>
                    <p className="pb-2"> <span className="font-bold">Meaning: </span>{kanjidata.meaning}</p>
                </div>
            </div>
        </div>
    );
}