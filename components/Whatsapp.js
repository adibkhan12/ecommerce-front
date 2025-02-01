import React from "react";
import styled from "styled-components";

const FloatingButton = styled.a`
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background-color: #25d366; /* WhatsApp Green */
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    text-decoration: none;
    font-size: 24px;
    z-index: 1000;
    transition: transform 0.3s ease-in-out;

    &:hover {
        transform: scale(1.1);
    }

    img {
        width: 30px;
        height: 30px;
    }
`;

export default function Whatsapp() {
    const phoneNumber = "+971566130458";
    const message = encodeURIComponent("Hello, I'm interested in your products!");

    return (
        <FloatingButton
            href={`https://wa.me/${phoneNumber}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
        >
            <img src="/whatsapp-icon.png" alt="WhatsApp" />
        </FloatingButton>
    );
}