"use client"
import lighthouse from '@lighthouse-web3/sdk'
import { IUploadProgressCallback } from '@lighthouse-web3/sdk/dist/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
const Verify = () => {

    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const progressCallback = (progressData: IUploadProgressCallback) => {
        let percentageDone =
            100 - (progressData?.total / progressData?.uploaded)
        console.log(percentageDone)
    }

    const uploadFile = async (file: any) => {
        setLoading(true)
        const output = await lighthouse.upload(file, process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY!, false, undefined, progressCallback)
        console.log('Visit at https://gateway.lighthouse.storage/ipfs/' + output.data.Hash)
        setLoading(false)
        router.push("/verify/result")
    }

    return (
        <div className='flex flex-col px-20 text-center' >
            <h2 className='text-black text-xl font-bold mt-5'>Please Upload Your Sale Aggrement</h2>
            <p className='my-2'>After your upload the processer will run automaticly and you will receive the NFT if process verifies.</p>
            <div className="flex items-center justify-center w-full">
            {!loading && <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input id="dropzone-file" type="file" onChange={e=>uploadFile(e.target.files)} className="hidden" />
            </label>}
            {loading && <span className="loading loading-dots loading-lg"></span>}
        </div>
        </div>
        

    )
}

export default Verify;