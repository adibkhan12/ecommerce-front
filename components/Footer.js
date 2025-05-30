import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";

const FooterWrapper = styled.footer`
   background: linear-gradient(135deg, #181818 0%, #232526 100%);
  color: #fff;
  margin-top: 220px;
  padding: 48px 24px 24px 24px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  border-radius: 24px 24px 0 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
  font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
  position: relative;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 24px;
    border-radius: 0;
  }
`;

const Section = styled.div`
  flex: 1 1 260px;
  min-width: 220px;
  margin-bottom: 12px;
  padding: 0 12px;

  @media (max-width: 900px) {
    padding: 0;
  }
`;

const Logo = styled.div`
  font-size: 2.1rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #ff9900;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  user-select: none;
`;

const ContactInfo = styled.div`
  font-size: 1rem;
  line-height: 1.7;
  color: #e0e0e0;

  a {
    color: #ff9900;
    text-decoration: underline;
    transition: color 0.2s;
    &:hover {
      color: #ffd580;
    }
  }
`;

const ContactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
  svg, span.emoji {
    font-size: 1.1em;
    color: #ff9900;
    min-width: 22px;
  }
`;

const SectionTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffd580;
  margin-bottom: 18px;
  letter-spacing: 1px;
`;

const QuickLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  a {
    color: #e0e0e0;
    text-decoration: none;
    font-size: 1rem;
    transition: color 0.2s;
    position: relative;
    padding-left: 2px;

    &:hover {
      color: #ff9900;
      text-decoration: underline;
    }
  }
`;

const SocialIconsContainer = styled.div`
  display: flex;
  gap: 16px; /* Adjust as needed */
  margin-top: 12px; /* Reduce this value to decrease the gap after 'Follow us' */
`;

// Example: Update the logo box style
const SocialIconBox = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: #f5f5f5;
  border-radius: 12px; /* Rounded rectangle instead of circle */
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: box-shadow 0.2s;
  svg {
    transition: color 0.2s, fill 0.2s;
    color: #232526;
    fill: currentColor;
  }
  &:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  }
  &.twitter:hover svg {
    color: #1da1f2;
  }
  &.instagram:hover svg {
    color: #e1306c;
  }
  &.facebook:hover svg {
    color: #1877f3;
  }
  &.tiktok:hover svg {
    color: #FE2C55;
  }
`;

const Countries = styled.div`
margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    width: 250px;
    height: 150px;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.10);
    background: #fff;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, #232526 0%, #ff9900 50%, #232526 100%);
  // margin: 32px 0 16px 0;
  opacity: 0.3;
`;

const Copyright = styled.div`
  width: 100%;
  text-align: center;
  color: #b0b0b0;
  font-size: 0.95rem;
  margin-top: 8px;
  letter-spacing: 0.5px;
`;

export default function Footer() {
  return (
    <FooterWrapper id="contactinfo">
            <Section>
        <h4>COUNTRIES WE SHIP TO</h4>
        <Countries>
          <Image src="/uae-flag-2.png" width={200} height={160} alt="UAE" />
        </Countries>
      </Section>
      <Divider />
      <Copyright>
        &copy; {new Date().getFullYear()} Shahzad Arshad. All rights reserved.
      </Copyright>
    </FooterWrapper>
  );
}
