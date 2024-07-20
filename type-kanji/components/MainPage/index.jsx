import React from "react";
import Image from "next/image";
import RedCircle from "../../public/red_circle.svg";

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
          <div className="mt-10 flex    items-center">
            <h3 className="mr-10 text-4xl font-bold">Learn it while typing!</h3>
            <button className="bg-[#D54B40] rounded-2xl text-2xl px-12 py-5 font-semibold">
              Start Typing
            </button>
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

        </div>
      </div>


      <div className="h-screen relative">

      </div>
    </section>
  );
}
