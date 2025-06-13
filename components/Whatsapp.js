import React from "react";
import styled from "styled-components";
import Image from "next/image";

const FloatingButton = styled.a`
    position: fixed;
    bottom: 18px;
    left: 20px;
    width: 54px;
    height: 54px;
    background-color: #25d366; /* WhatsApp Green */
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    text-decoration: none;
    font-size: 24px;
    z-index: 1200;
    transition: transform 0.3s ease-in-out;

    &:hover {
        transform: scale(1.1);
    }

    img {
        width: 30px;
        height: 30px;
    }

    @media (max-width: 600px) {
        width: 40px;
        height: 40px;
        bottom: 8px;
        left: 10px;
        img {
            width: 22px;
            height: 22px;
        }
    }
    @media (max-width: 900px) and (min-width: 601px) {
        width: 46px;
        height: 46px;
        bottom: 12px;
        left: 12px;
        img {
            width: 28px;
            height: 28px;
        }
    }
`;

const Message = styled.div`
    position: fixed;
    bottom: 28px;
    left: 84px;
    background: #fff;
    color: #222;
    padding: 10px 18px;
    border-radius: 22px;
    box-shadow: 0 2px 8px rgba(44,62,80,0.10);
    font-size: 1.08rem;
    font-weight: 500;
    z-index: 1200;
    display: flex;
    align-items: center;
    gap: 8px;
    @media (max-width: 600px) {
        left: 58px;
        font-size: 0.98rem;
        padding: 7px 12px;
    }
`;

export default function Whatsapp() {
    const phoneNumber = "+971566130458";
    const message = encodeURIComponent("Hello, I'm interested in your products!");

    return (
        <>
            <FloatingButton
                href={`https://wa.me/${phoneNumber}?text=${message}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
            >
                <Image src="/whatsapp-icon.png" alt="WhatsApp" width={30} height={30} />
            </FloatingButton>
            <Message>
                Prefer WhatsApp? Chat with us instantly!
            </Message>
        </>
    );
}