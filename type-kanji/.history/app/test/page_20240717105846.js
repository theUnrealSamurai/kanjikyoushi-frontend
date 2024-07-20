import React from 'react'
import Input from "../../components/InputTest";


export default function test() {
  return (
    <section className='max-h-screen'>
      {/* Test Button and the test counter */}
      <div className='font-extrabold text-2xl pl-20 pt-10'>
        <p>
          Test:{" "}
          <span className="bg-[#D54B40] text-black p-2 px-5 rounded-full font-bold">
            20
          </span>
        </p>
      </div>

      {/* Typing Zone */}
      <div className="w-[80%] pt-10 pb-7 px-14  bg-[#453F3F] border-[#D54B40] text-white rounded-2xl border-4 ml-36 my-10 text-2xl ">
        {/* Japanese Sentence */}
        <div className=" mb-3 ">
          <p className="text-3xl font-black pl-10">
            自分自身について知らないことがある。
          </p>
        </div>

        {/* Input Text Box */}
        <div className="mb-4">
          <Input/>
        </div>

      </div> 

      {/* Completed and Skipped Counter */}
      <div className='flex justify-center text-2xl font-extrabold'>
        {/* Completed Counter */}
        <span>
          Completed:{" "}
          <span className="bg-[#D54B40] text-black p-2 px-5 rounded-full font-bold">
            10
          </span>
        </span>

        {/* Skipped Counter */}
        <span className="pl-10">
          Skipped:{" "}
          <span className="bg-[#D54B40] text-black p-2 px-5 rounded-full font-bold">
            5
          </span>
        </span>
      </div>
    </section> 
  )
}
