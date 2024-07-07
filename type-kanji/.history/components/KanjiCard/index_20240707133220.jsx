import React from 'react'

export default function KanjiCard() {
  return (
    <div className='w-80 h-32 flex  overflow-hidden bg-black rounded-3xl'>
        <div className='flex justify-center items-center w-1/3 h-full bg-yellow-500'>
            <p className=''>漢字</p>
        </div>
        <div className='w-2/3 h-full bg-pink-400'>

        </div>
    </div>
  )
}
