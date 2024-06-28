"use client"
import Lottie from 'react-lottie-player'
import animation from "../../../public/Animation.json"
import Link from 'next/link'

const Result = () => {
    return (
        <div className="h-22 overflow-hidden rounded-lg lg:h-full lg:my-16 xl:w-1/5 mx-auto">
            <h2 className='text-black text-xl font-bold mt-5'>Your sale is approved</h2>
            <p className='mt-2 mb-5'>You can check the ownership  <Link className='underline' href="/ownership">from here</Link></p>

            <Lottie
                animationData={animation}
                play
                loop
                speed={0.7}
            />
        </div>

    )
}

export default Result