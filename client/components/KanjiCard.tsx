export default function KanjiCard() {
    return (
        <div className="bg-black text-white m-2 rounded-2xl h-fit w-71">
            <div className="flex flex-row m-2 items-center">
                {/* Kanji */}
                <p className="font-bold text-4xl w-1/4 text-center">分</p>
                
                {/* Kanji Information */}
                <div className="flex flex-col text-xs w-3/4">
                    <p className="pt-2"> <span className="font-bold">Onyomi:  </span>ブン, ブ, フン</p>
                    <p className="py-2"> <span className="font-bold">Kunyomi: </span>わ.かつ, わ.かる, わ.かれる, わ.け, わ.ける</p>
                    <p className="pb-2"> <span className="font-bold">Meaning: </span>chances, degree, duty, know, minute of time, one's lot</p>
                </div>
            </div>
        </div>
    );
}