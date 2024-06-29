"use client"

import { useMemo, useState } from "react";
import { useSimulateContract, useWriteContract } from "wagmi";
import nftAbi from "../../public/nft.abi.json"
import { useSendTransaction } from 'wagmi'

const Buy = () => {

    const [nftAddress, setNftAddress] = useState<string>("0x")
    const { sendTransaction } = useSendTransaction()

    const { data } = useSimulateContract({
        address: nftAddress,
        abi: nftAbi,
        functionName: 'getPrice',
        args: [], // Make sure to pass any required arguments
    })
    
    const { writeContract } = useWriteContract()
    const price = useMemo(() => {
        return data?.result || null;
    }, [data?.result]);


    const buyTheAsset = () => {
        sendTransaction({
            to: nftAddress,
            value: BigInt(price!),
        })
    }



    return (
        <div className="bg-white flex-grow py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-screen-2xl px-4 mt-5 md:px-8">
                <div className="mx-auto flex max-w-screen-sm flex-col ">
                    {price == null ?
                        <>
                            <input type="text" placeholder="Please give us NFT address" value={nftAddress} onChange={(event) => setNftAddress(event.target.value)} className="input text-black bg-slate-200 mx-auto input-accent input-bordered w-full max-w-xs" />
                            <button onClick={() => writeContract(data?.request!)} className="btn btn-accent mt-10 w-full max-w-xs mx-auto">Get NFT Price</button>

                        </>
                        : <>
                            <h2 className='text-black text-xl font-bold mt-5'>The price of the asset is {String(price).replace("n","")!}</h2>
                            <button onClick={buyTheAsset} className="btn btn-accent mt-10 w-full max-w-xs mx-auto">Buy The Asset</button>
                        </>
                    }

                </div>
            </div>
        </div>

    )
}

export default Buy;