import styled from "styled-components";

const IllustrationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SVG = styled.svg`
  width: 120px;
  height: 120px;
  margin-bottom: 18px;
`;

const Message = styled.div`
  font-size: 1.25rem;
  color: #c00;
  font-weight: 600;
  text-align: center;
`;

export default function NoResultsIllustration({ message }) {
  return (
    <IllustrationWrapper>
      <SVG viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" fill="#f8f8f8" stroke="#ff9900" strokeWidth="2" />
        <rect x="18" y="28" width="28" height="12" rx="6" fill="#ff9900" opacity="0.15" />
        <path d="M24 36 L40 36" stroke="#ff9900" strokeWidth="2" strokeLinecap="round" />
        <circle cx="28" cy="32" r="2" fill="#ff9900" />
        <circle cx="36" cy="32" r="2" fill="#ff9900" />
      </SVG>
      <Message>{message || "No products found."}</Message>
    </IllustrationWrapper>
  );
}
