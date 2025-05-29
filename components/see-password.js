
import { useState } from "react";
import styled from "styled-components";
import { primary } from "@/lib/colors";

/** Container contains the input and eye icon with safe padding */
const PasswordFieldWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
`;

/** Password input perfectly contained, with room for icon, no overflow */
const StyledPasswordInput = styled.input`
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  padding: 12px 44px 12px 14px;     /* right padding for icon, left for text */
  border-radius: 8px;
  border: 1.5px solid #e0e3e8;
  background: #fafbfc;
  font-size: 1rem;
  color: #222;
  outline: none;
  transition: border 0.22s, box-shadow 0.18s, background 0.16s;
  box-shadow: 0 1px 2px rgba(180,185,190,0.04);

  &:focus {
    border-color: ${primary};
    background: #fff;
    box-shadow: 0 2px 8px rgba(116,13,194,0.08);
  }

  &:hover:not(:focus) {
    border-color: #bfc2c7;
    background: #f5f6fa;
  }

  &[disabled] {
    background: #f3f3f3;
    cursor: not-allowed;
  }
`;

/** The toggle button is always inside the right edge, never overflows */
const ToggleButton = styled.button`
  position: absolute;
  right: 13px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 2px;
  margin: 0;
  height: 26px;
  width: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #888;
  z-index: 2;

  &:hover, &:focus {
    color: ${primary};
    background: #f5f6fa;
    border-radius: 50%;
    outline: none;
  }

  svg {
    display: block;
    width: 22px;
    height: 22px;
  }
`;

export default function SeePassword({
  value,
  onChange,
  name,
  id,
  placeholder = "",
  disabled = false,
  autoComplete = "off",
}) {
  const [visible, setVisible] = useState(false);

  return (
    <PasswordFieldWrapper>
      <StyledPasswordInput
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
      />
      <ToggleButton
        type="button"
        tabIndex={-1}
        title={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((vis) => !vis)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? (
          // Eye Open SVG
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        ) : (
          // Eye Closed SVG
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17.94 17.94A10.85 10.85 0 0112 19c-7 0-11-7-11-7a20.13 20.13 0 015.06-6.36m3.19-1.77A10.85 10.85 0 0112 5c7 0 11 7 11 7a20.13 20.13 0 01-4.35 5.94M1 1l22 22"/>
            <path d="M9.53 9.53a3 3 0 014.24 4.24"/>
          </svg>
        )}
      </ToggleButton>
    </PasswordFieldWrapper>
  );
}
