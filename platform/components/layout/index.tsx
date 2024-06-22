import { projectId, config } from "@/wagmi.connector";
import { createWeb3Modal } from "@web3modal/wagmi";
import { HTMLProps } from "react";
import { WagmiProvider } from 'wagmi';
import Navbar from "./navbar";
import Footer from "./footer";
import { WagmiCustomProvider } from "@/wagmi";

// Create modal
createWeb3Modal({
    wagmiConfig: config,
    projectId,
});


export const Layout = ({ children }: Readonly<HTMLProps<HTMLDivElement>>) => {
    return (
        <WagmiCustomProvider>
            <Navbar />
            {children}
            <Footer />
        </WagmiCustomProvider>
    )
}