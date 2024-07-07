import React from 'react'

export default function KanjiCard() {
  return (
    <div className='w-80 h-32 flex  overflow-hidden bg-black rounded-3xl'>
        <div className='flex justify-center items-center w-1/3 h-full bg-yellow-500'>
            <p className='text-5xl font-bold text-white'>分</p>
        </div>
        <div className='w-2/3 h-full bg-pink-400'>
            <h3></h3>
        </div>
    </div>
  )
}
