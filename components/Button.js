import styled, { css } from "styled-components";
import { primary } from "@/lib/colors";

export const ButtonStyle = css`
    border: none;
    padding: 5px 15px;
    border-radius: 5px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    font-weight: 700;

    svg {
        height: 16px;
        margin-right: 5px;
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
                background-color: #fff;
                color: #000;
            `}

    ${({ white, outline }) =>
            white && outline &&
            css`
                background-color: transparent;
                color: #fff;
                border: 2px solid #fff;
            `}

    ${({ black, outline }) =>
            black && !outline &&
            css`
                background-color: #000;
                color: #fff;
            `}

    ${({ black, outline }) =>
            black && outline &&
            css`
                background-color: transparent;
                color: #000;
                border: 2px solid #000;
            `}

        /* Fixed primary color handling */
    ${({ primary: isPrimary, outline }) =>
            isPrimary && !outline &&
            css`
                background-color: ${primary};
                border: 2px solid ${primary};
                color: white;
            `}

    ${({ primary: isPrimary, outline }) =>
            isPrimary && outline &&
            css`
                background-color: transparent;
                border: 2px solid ${primary};
                color: ${primary};
            `}

        /* Large button styles */
    ${({ size }) =>
            size === "l" &&
            css`
                font-size: 1.25rem;
                padding: 10px 20px;
                svg {
                    height: 20px;
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
