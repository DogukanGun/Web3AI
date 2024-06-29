"use client"

import { useMemo, useState } from "react";
import { useAccount, useSimulateContract, useWriteContract } from "wagmi";
import nftAbi from "../../public/nft.abi.json";
import { useSendTransaction } from 'wagmi';
import sadFace from '../../public/sadface.json';
import happyFace from '../../public/happyFace.json';
import Lottie from "react-lottie-player";

const Ownership = () => {

    const [nftAddress, setNftAddress] = useState<string>("0x")
    const [fetchOwnership, setFetchOwnership] = useState(false)
    const { sendTransaction } = useSendTransaction()
    const { address } = useAccount()
    const { writeContract } = useWriteContract()

    const { data } = useSimulateContract({
        address: nftAddress,
        abi: nftAbi,
        functionName: 'getTokenID',
        args: [],
    })

    const tokenID = useMemo(() => {
        return data?.result || null;
    }, [data?.result]);

    const { data: dataForOwnership } = useSimulateContract({
        address: nftAddress,
        abi: nftAbi,
        functionName: 'ownerOf',
        args: [tokenID],
    })

    const ownership = useMemo(() => {
        if (data?.result && !fetchOwnership && dataForOwnership!.request) {
            writeContract(dataForOwnership!.request)
            setFetchOwnership(true)
        }
        return data?.result == address;
    }, [data?.result, dataForOwnership?.request]);




    return (
        <div className="bg-white flex-grow py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-screen-2xl px-4 mt-5 md:px-8">
                <div className="mx-auto flex max-w-screen-sm flex-col ">
                    {tokenID == null ?
                        <>
                            <input type="text" placeholder="Please give us NFT address" value={nftAddress} onChange={(event) => setNftAddress(event.target.value)} className="input text-black bg-slate-200 mx-auto input-accent input-bordered w-full max-w-xs" />
                            <button onClick={() => writeContract(data?.request!)} className="btn btn-accent mt-10 w-full max-w-xs mx-auto">Get NFT Price</button>
                        </>
                        : ownership ?
                            <Lottie
                                animationData={happyFace}
                                play
                                loop
                                speed={0.7}/>
                        :
                            <Lottie
                                animationData={sadFace}
                                play
                                loop
                                speed={0.7}
                            />
                    }

                </div>
            </div>
        </div>

    )
}

export default Ownership;