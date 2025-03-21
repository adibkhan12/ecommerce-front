import styled, { createGlobalStyle } from "styled-components";
import { CartContextProvider } from "@/components/CartContext";
import { SessionProvider } from "next-auth/react";
import Whatsapp from "@/components/Whatsapp";
import Footer from "@/components/Footer";

const GlobalStyles = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

    body {
        background-color: #f9f9f9;
        padding: 0;
        margin: 0;
        font-family: 'Poppins', sans-serif;
    }
`;

const BorderGap= styled.div`
margin-top: 20px`;

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <>
            <GlobalStyles />
            <SessionProvider session={session}>
                <CartContextProvider>
                    <Component {...pageProps} />
                    <Whatsapp />  {/* Floating WhatsApp button */}
                </CartContextProvider>
            </SessionProvider>
            <BorderGap>
                <Footer/>
            </BorderGap>
        </>
    );
}
