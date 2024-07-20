import React from "react";

export default function MainPage() {
  return (
    <section className="min-h-screen w-full bg-[url('../public/Background.svg')] bg-cover bg-center bg-no-repeat">
      <div className="text-white mx-16   ">
        <h1 className="text-7xl font-black mt-16">Welcome to Type Kanji!</h1>
        <p className="w-2/3  mt-10 text-2xl font-extralight">
          Hi there! I'm a weeb who wanted to watch anime without subtitles, I
          created this site <br /> to learn kanji and get better at recognizing
          and typing Kanji. <br />
          What started as my personal project to improve my Kanji skills has
          turned <br /> into a fun tool that I hope you'll find useful too.
          <br /> Give it a try and let's make learning Kanji fun and easy
          together!
        </p>
        <div className="mt-10 flex    items-center">
          <h3 className="mr-10 text-4xl font-bold">Learn it while typing!</h3>
          <button className="bg-[#D54B40] rounded-2xl text-2xl px-12 py-5 font-semibold">Start Typing</button>
        </div>
      </div>
    </section>
  );
}
