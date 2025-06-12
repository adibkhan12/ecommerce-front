import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const greenMain = "#4caf50";
const greenDark = "#388e3c";
const greenLight = "#a5d6a7";

const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 180px;
  min-width: 120px;
  font-size: 1rem;
  z-index: 20;
`;

const SelectedBox = styled.button`
  width: 100%;
  padding: 10px 38px 10px 14px;
  border-radius: 8px;
  border: 1.5px solid ${greenMain};
  background: #fff;
  color: #333;
  font-size: 1rem;
  font-weight: 500;
  text-align: left;
  appearance: none;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(76,175,80,0.04);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover, &:focus {
    border-color: ${greenDark};
    box-shadow: 0 4px 16px rgba(76,175,80,0.10);
  }
`;

const Chevron = styled.span`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  svg {
    width: 1.2em;
    height: 1.2em;
    display: block;
    color: ${greenMain};
  }
`;

const Dropdown = styled.ul`
  position: absolute;
  left: 0;
  top: 110%;
  width: 100%;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(44,62,80,0.13);
  margin: 0;
  padding: 6px 0;
  list-style: none;
  z-index: 100;
  border: 1.5px solid ${greenMain};
  max-height: 260px;
  overflow-y: auto;
  animation: fadeIn 0.18s;
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Option = styled.li`
  padding: 10px 18px;
  font-size: 1rem;
  color: ${({ selected }) => (selected ? '#fff' : '#333')};
  background: ${({ selected }) => (selected ? `linear-gradient(90deg,${greenMain},${greenDark})` : 'transparent')};
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  border: none;
  outline: none;
  font-weight: ${({ selected }) => (selected ? 700 : 500)};
  &:hover, &:focus {
    background: linear-gradient(90deg,${greenLight},${greenMain});
    color: #fff;
  }
`;

export default function CustomSelect({ value, onChange, children, ...props }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef();
  const options = React.Children.toArray(children);
  const selectedOption = options.find(opt => opt.props.value === value);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(val) {
    setOpen(false);
    // Create a synthetic event to match native select onChange
    onChange && onChange({ target: { value: val } });
  }

  return (
    <SelectWrapper ref={wrapperRef} tabIndex={0}>
      <SelectedBox type="button" onClick={() => setOpen(v => !v)} aria-haspopup="listbox" aria-expanded={open}>
        {selectedOption ? selectedOption.props.children : options[0]?.props.children}
        <Chevron>
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Chevron>
      </SelectedBox>
      {open && (
        <Dropdown role="listbox">
          {options.map(opt => (
            <Option
              key={opt.props.value}
              selected={opt.props.value === value}
              tabIndex={0}
              onClick={() => handleSelect(opt.props.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') handleSelect(opt.props.value);
              }}
            >
              {opt.props.children}
            </Option>
          ))}
        </Dropdown>
      )}
    </SelectWrapper>
  );
}
