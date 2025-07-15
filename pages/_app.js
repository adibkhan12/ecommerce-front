import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { CartContextProvider } from "@/components/CartContext";
import { SessionProvider } from "next-auth/react";
import Whatsapp from "@/components/Whatsapp";
import Footer from "@/components/Footer";
import Script from "next/script"; // 💥 add this at the top with other imports

const lightTheme = {
    bodyBg: "#f9f9f9",
    textColor: "#222",
};

const darkTheme = {
    bodyBg: "#18191A",
    textColor: "#e4e6eb",
};

const GlobalStyles = createGlobalStyle`
    html {
        box-sizing: border-box;
        font-size: 16px;
    }
    *, *:before, *:after {
        box-sizing: inherit;
    }
    body {
        background-color: ${({ theme }) => theme.bodyBg};
        color: ${({ theme }) => theme.textColor};
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

import { useEffect, useState, createContext } from "react";

export const ThemeContext = createContext({
    mode: "light",
    toggleTheme: () => {},
});

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    const [mode, setMode] = useState("light");

    // On mount, check localStorage or system preference
    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("theme-mode");
            if (saved === "light" || saved === "dark") {
                setMode(saved);
            } else {
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                setMode(prefersDark ? "dark" : "light");
            }
        }
    }, []);

    // Save mode to localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("theme-mode", mode);
        }
    }, [mode]);

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

    const toggleTheme = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={mode === "dark" ? darkTheme : lightTheme}>
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
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}
