import styled, { createGlobalStyle } from "styled-components";
import { CartContextProvider } from "@/components/CartContext";
import { SessionProvider } from "next-auth/react";
import Whatsapp from "@/components/Whatsapp";
import Footer from "@/components/Footer";
import Script from "next/script"; // 💥 add this at the top with other imports

const GlobalStyles = createGlobalStyle`
    html {
        box-sizing: border-box;
        font-size: 16px;
    }
    *, *:before, *:after {
        box-sizing: inherit;
    }
    body {
        background-color: #f9f9f9;
        padding: 0;
        margin: 0;
        font-family: 'Poppins', sans-serif;
        min-height: 100vh;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    #__next {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
    main, .main-content {
        flex: 1 0 auto;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 24px 16px;
    }
    @media (max-width: 900px) {
        html {
            font-size: 15px;
        }
        main, .main-content {
            max-width: 100vw;
            padding: 18px 6px;
        }
    }
    @media (max-width: 600px) {
        html {
            font-size: 14px;
        }
        main, .main-content {
            padding: 10px 2px;
        }
    }
`;

const BorderGap= styled.div`
margin-top: 20px`;

import { useEffect } from "react";

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            window.addEventListener("load", () => {
                navigator.serviceWorker.register("/service-worker.js").catch(err => {
                    console.error("Service Worker registration failed:", err);
                });
            });
        }
    }, []);

    // Hydration error fallback: reload on hydration error
    useEffect(() => {
        if (typeof window !== "undefined") {
            const handler = (e) => {
                if (e.message && e.message.includes("Hydration failed")) {
                    window.location.reload();
                }
            };
            window.addEventListener("error", handler);
            return () => window.removeEventListener("error", handler);
        }
    }, []);

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
            <Script
            id="tawkto-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
                __html: `
                var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                (function(){
                    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                    s1.async=true;
                    s1.src='https://embed.tawk.to/684c4d3cac212a190e45f2b1/1itl0rdtm';
                    s1.charset='UTF-8';
                    s1.setAttribute('crossorigin','*');
                    s0.parentNode.insertBefore(s1,s0);
                })();
                `
            }}
            />

        </>
    );
}
