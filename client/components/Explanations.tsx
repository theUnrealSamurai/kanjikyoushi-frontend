interface ExplanationsProps {
    explanations: string | undefined;
}

export default function Explanations({ explanations }: ExplanationsProps) {
    if (typeof explanations !== 'string' || explanations.trim() === '') {
        return <div/>;
    }
    const lines = explanations.split('\n');
    const title = lines[0];
    const description = lines.slice(1);


    return(
        <div className="flex flex-col bg-black w-[90%] h-fit m-2 text-white rounded-2xl">
            <div className="m-2 flex flex-col ">
                {/* Word Header */}
                <p className="font-bold ml-2">{title}</p>
                <hr className="bg-white m-1"/>
                <div className="ml-4">
                    {description.map((line, index) => (
                        <p key={index}>{line}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}