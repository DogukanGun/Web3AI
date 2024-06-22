"use client"

import { useEffect, useState } from "react";
import { useSimulateContract, useWriteContract } from "wagmi";
import marketAbi from "@/public/market.abi.json";
const SellApartment = () => {

    const [activeState, setActiveState] = useState(0)
    const [username, setUsername] = useState("")
    const [nftAddress, setNftAddress] = useState("")
    const [tokenID, setTokenID] = useState("")

    const { data } = useSimulateContract({
        address: '0x77DC09C2De47572Dd842507Cf3a19F2c560baE20',
        abi: marketAbi,
        functionName: 'register',
        args: [
            username
        ],
    })
    const { data: dataForCreateToken } = useSimulateContract({
        address: '0x77DC09C2De47572Dd842507Cf3a19F2c560baE20',
        abi: marketAbi,
        functionName: 'createTrade',
        args: [
            nftAddress,
            tokenID
        ],
    })
    const { data: dataForGetTradeContractAddress } = useSimulateContract({
        address: '0x77DC09C2De47572Dd842507Cf3a19F2c560baE20',
        abi: marketAbi,
        functionName: 'getTradeContractAddress',
        args: [
            nftAddress,
            tokenID
        ],
    })
    const { writeContract } = useWriteContract()

    const register = () => {
        writeContract(data!.request)
    }

    const createTradeContract = () => {
        writeContract(dataForCreateToken!.request)
        writeContract(dataForGetTradeContractAddress!.request)
    }

    useEffect(() => {
        if (data?.result) {
            setActiveState((prev) => prev + 1)
        }
    }, [data?.result])

    useEffect(() => {
        if (dataForCreateToken?.result) {
            setActiveState((prev) => prev + 1)
        }
    }, [dataForCreateToken?.result])

    return (
        <div className="bg-white flex-grow py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-screen-2xl px-4 mt-5 md:px-8">
                <div className="mx-auto flex max-w-screen-sm flex-col ">
                    <ul className="steps">
                        <li className={`step ${activeState > 0 ? "step-primary" : ""}`}>Register</li>
                        <li className={`step ${activeState > 1 ? "step-primary" : ""}`}>Create Trade Contract</li>
                        <li className={`step ${activeState > 2 ? "step-primary" : ""}`}>Find Your Buyer</li>
                    </ul>
                    <div className="mt-5 flex flex-col w-full">
                        {activeState == 0 &&
                            <>
                                <input type="text" placeholder="Your name" value={username} onChange={(event) => setUsername(event.target.value)} className="input bg-slate-200 mx-auto input-accent input-bordered w-full max-w-xs" />
                                <button onClick={register} className="btn btn-accent mt-10 w-full max-w-xs mx-auto">Register or Login</button>
                            </>
                        }
                        {activeState == 1 &&
                            <>
                                <input type="text" placeholder="Your nft address" value={nftAddress} onChange={(event) => setNftAddress(event.target.value)} className="input bg-slate-200 mx-auto input-accent input-bordered w-full max-w-xs" />
                                <input type="text" placeholder="Type here token id" value={tokenID} onChange={(event) => setTokenID(event.target.value)} className="input mt-5 bg-slate-200 mx-auto input-accent input-bordered w-full max-w-xs" />
                                <button onClick={createTradeContract} className="btn btn-accent mt-10 w-full max-w-xs mx-auto">Sell Now</button>
                            </>
                        }
                        {activeState == 2 &&
                            <p>
                                Now you are responsible to find a buyer
                            </p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}


export default SellApartment;