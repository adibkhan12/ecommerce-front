import Link from "next/link";
import styled from "styled-components";
import { IoArrowBack } from "react-icons/io5";

const Button = styled.a`
  display: inline-flex;
  align-items: center;
  background: #f5f5f5;
  color: #222;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 8px;
  padding: 8px 16px;
  text-decoration: none;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  transition: background 0.2s, color 0.2s;
  cursor: pointer;
  border: none;
  outline: none;
  &:hover {
    background: #ff9900;
    color: #fff;
  }
  svg {
    margin-right: 8px;
    font-size: 1.2em;
  }
`;

export default function BackButton({ href }) {
  return (
    <Link href={href} passHref legacyBehavior>
      <Button aria-label="Back to products">
        <IoArrowBack /> Back to Shop
      </Button>
    </Link>
  );
}
