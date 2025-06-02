import styled, { css } from "styled-components";
import { primary } from "@/lib/colors";

export const ButtonStyle = css`
    border: none;
    padding: 10px 22px;
    border-radius: 12px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.07rem;
    box-shadow: 0 2px 12px rgba(44,62,80,0.08);
    transition: all 0.18s cubic-bezier(.4,1.3,.6,1), box-shadow 0.18s;
    outline: none;
    position: relative;
    overflow: hidden;

    svg {
        height: 18px;
        margin-right: 7px;
        transition: filter 0.18s;
    }

    &:hover {
        transform: translateY(-2px) scale(1.04);
        box-shadow: 0 6px 24px rgba(44,62,80,0.16);
        filter: brightness(1.04);
    }
    &:active {
        transform: scale(0.98);
        box-shadow: 0 2px 8px rgba(44,62,80,0.10);
    }

    /* Ensure block button behavior */
    ${({ $block }) =>
            $block &&
            css`
                display: block;
                width: 100%;
            `}

    ${({ white, outline }) =>
            white && !outline &&
            css`
                background: #fff;
                color: #222;
                border: 2px solid #eee;
            `}

    ${({ white, outline }) =>
            white && outline &&
            css`
                background: transparent;
                color: #fff;
                border: 2px solid #fff;
            `}

    ${({ black, outline }) =>
            black && !outline &&
            css`
                background: #222;
                color: #fff;
                border: 2px solid #222;
            `}

    ${({ black, outline }) =>
            black && outline &&
            css`
                background: transparent;
                color: #222;
                border: 2px solid #222;
            `}

    /* Upgraded primary color handling */
    ${({ primary: isPrimary, outline }) =>
            isPrimary && !outline &&
            css`
                background: linear-gradient(90deg, #ff9900 60%, #ffb84d 100%);
                border: 2px solid #ff9900;
                color: #fff;
                box-shadow: 0 4px 16px rgba(255,153,0,0.10);
            `}

    ${({ primary: isPrimary, outline }) =>
            isPrimary && outline &&
            css`
                background: transparent;
                border: 2px solid #ff9900;
                color: #ff9900;
            `}

    /* Large button styles */
    ${({ size }) =>
            size === "l" &&
            css`
                font-size: 1.25rem;
                padding: 14px 28px;
                svg {
                    height: 22px;
                }
            `}
`;

export const StyledButton = styled.button`
    ${ButtonStyle}
`;

export default function Button({ children, block, ...rest }) {
    return (
        <StyledButton $block={block} {...rest}>
            {children}
        </StyledButton>
    );
}
