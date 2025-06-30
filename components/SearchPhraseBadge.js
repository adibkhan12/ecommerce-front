import styled from "styled-components";

const Badge = styled.span`
  display: inline-block;
  background: #ff9900;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  padding: 6px 18px;
  border-radius: 999px;
  margin: 0 0 24px 0;
  letter-spacing: 0.03em;
  box-shadow: 0 2px 8px rgba(255,153,0,0.08);
`;

export default function SearchPhraseBadge({ phrase }) {
  if (!phrase) return null;
  return <Badge>"{phrase}"</Badge>;
}
