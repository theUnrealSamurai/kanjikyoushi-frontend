import React from "react";
import Image from "next/image";
import RedCircle from "../../public/red_circle.svg";
import Demo from "../../public/demo.svg";
import zigzag from "../../public/zigzag.svg";
import underlineKanji from "../../public/underline.svg";
import RedSplash from "../../public/redSplash.svg";
import redCircle from "../../public/redCircle.svg";
import Suggestion from "../../public/suggestion.svg";

export default function MainPage() {
  return (
    <section>
      {/* Page one */}
      <div className="h-screen  bg-[url('../public/Background.svg')] bg-cover bg-center bg-no-repeat">
        <div className="text-white mx-16 ">
          <h1 className="text-7xl font-black mt-16">Welcome to Type Kanji!</h1>
          <p className="w-2/3  mt-10 text-2xl font-extralight">
            Hi there! I'm a weeb who wanted to watch anime without subtitles, I
            created this site <br /> to learn kanji and get better at
            recognizing and typing Kanji. <br />
            What started as my personal project to improve my Kanji skills has
            turned <br /> into a fun tool that I hope you'll find useful too.
            <br /> Give it a try and let's make learning Kanji fun and easy
            together!
          </p>
          <div className="mt-10 flex items-center">
            <h3 className="mr-10 text-4xl font-bold">Learn it while typing!</h3>
            <a
              href="/practice"
              className="bg-[#D54B40] rounded-2xl text-2xl px-12 py-5 font-semibold"
            >
              Start Typing
            </a>
          </div>
        </div>
      </div>

      {/* Page Two */}
      <div className="min-h-[50vh] -mt-16  text-white w-full flex justify-end">
        <div className="w-10/12 mr-10">
          <div className="text-4xl z-40 w-full relative  mb-16 pr-44  font-bold text-right ">
            Learn{" "}
            <Image
              className="absolute -z-10 -top-10 right-1/4"
              src={RedCircle}
              width={200}
              height={100}
            />{" "}
            Kanji like never before
          </div>
          <div className="text-2xl text-center font-light ">
            Forget about tracking your progress manually - our website does it
            all for you! Just focus on typing the sentences shown <br /> and let
            us handle the rest, making your learning journey smooth and
            effortless. <br />
            Dive in and watch your skills improve effortlessly! <br /> Forget
            about learning; just type and watch the magic happen automatically.
          </div>
        </div>
      </div>

      {/* Page Three */}
      <div className="h-[180vh] w-full relative -mt-[450px] ">
        <div className=" bg-[url('../public/Background2.svg')] absolute inset-0  bg-auto bg-center  bg-no-repeat ">
          <div className="ml-16">
            <div className="mt-[500px] mb-80 text-white">
              <h2 className="text-6xl font-bold  w-2/3 relative mb-20">
                Preparing for JLPT? I got you covered{" "}
                <Image src={zigzag} className="absolute right-32" width={340} />
              </h2>
              <p className="text-center text-2xl font-light">
                The Sentences you type in this website uses the kanji based on
                your skill level and the JLPT order. <br /> As you practice,
                you'll systematically progress through each level, ensuring a
                thorough understanding and readiness for the test. <br /> Keep
                Typing and stay consistent. That's all you've got to do
              </p>
            </div>
            <div className="mt-[500px] mb-80 text-white relative">
              <h1 className="text-6xl font-bold  w-4/5 relative mb-20">
                Here's a Sneak Peek at What You'll be Doing
              </h1>
              <Image
                src={Demo}
                className="absolute -top-7 right-44"
                width={1500}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Page Four */}
      <div className="h-screen relative flex  justify-center items-end -top-24 text-white text-center">
        <div className="">
          <div className="text-6xl font-bold  ">
            What are you still scrolling the page for?
          </div>
          <div className="text-6xl font-bold flex  mt-5 justify-center">
            Go start
            <span className="text-[#D54B40] ml-4 mr-4">typing! </span>
            learn{" "}
            <span className="ml-4">
              some Kanji.
              <Image src={underlineKanji} className="mt-5" />
            </span>
            <Image src={RedSplash} />
          </div>
        </div>
      </div>

      {/* Page Five */}
      <div className="h-[50vh]">
        <div className=" h-5/6 relative mb-44">
          <h1 className="text-white text-8xl font-black flex justify-center items-center h-full ml-96">
            Good Luck <span className="text-[#D54B40] ml-2">!</span>
          </h1>

          <Image
            src={redCircle}
            className="absolute top-20  right-[630px]  "
            width={320}
          />
        </div>
        <div className="text-white h-1/6 flex text-lg w-full justify-between items-center p-10 relative">
          <Image src={Suggestion} className="absolute -top-60 left-96" />
          <div className="flex w-2/6  justify-between ">
            <h2>
              <a href="">Support</a>
            </h2>
            <h2>
              <a href="">Github</a>
            </h2>
            <h2>
              <a href="">Discord</a>
            </h2>
            <h2>
              <a href="">Contact</a>
            </h2>
          </div>
          <div>© 2024 Type Kanji. All Rights Reserved</div>
        </div>
      </div>
    </section>
  );
}
