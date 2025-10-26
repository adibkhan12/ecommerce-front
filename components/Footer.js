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
            {/* Left Section - Contact */}
            <Section>
            <Logo>
            <span className="emoji" role="img" aria-label="mobile">📱</span>
            Shahzad Arshad
            </Logo>
            <ContactInfo>
            <ContactRow>
            <span className="emoji" role="img" aria-label="shop">🏬</span>
            Shahzad Arshad Elect. Devices tr
            </ContactRow>
            <ContactRow>
            <span className="emoji" role="img" aria-label="location">📍</span>
            Rolla Mall, Second Floor,
            Shop 216, Al Rolla, Sharjah
            </ContactRow>
            <ContactRow>
            <span className="emoji" role="img" aria-label="phone">📞</span>
            <a href="tel:566130458">+971-56-6130458</a>
            </ContactRow>
            <ContactRow>
            <span className="emoji" role="img" aria-label="landline">☎️</span>
            <a href="tel:67317652">+971-67-317652</a>
            </ContactRow>
            <ContactRow>
            <span className="emoji" role="img" aria-label="email">✉️</span>
            <a href="mailto:sa@shahzadmobile.com">sa@shahzadmobile.com</a>
            </ContactRow>
            </ContactInfo>
            </Section>
            <Section>
            <SectionTitle>Quick Links</SectionTitle>
            <QuickLinks>
            <li>
            <span className="emoji" role="img" aria-label="about">ℹ️</span>
            <Link href="/about">About Us</Link>
            </li>
            <li>
            <span className="emoji" role="img" aria-label="terms">📄</span>
            <Link href="/terms">Terms & Conditions</Link>
            </li>
            <li>
            <span className="emoji" role="img" aria-label="shop">🛒</span>
            <Link href="/shop">Shop</Link>
            </li>
            <li>
            <span className="emoji" role="img" aria-label="support">💬</span>
            <Link href="/support">Support</Link>
            </li>
            </QuickLinks>
            </Section>
            <Section>
            <SectionTitle>Follow Us</SectionTitle>
            <SocialIconsContainer>
            <SocialIconBox className="tiktok" href="https://tiktok.com/@shop216rollamall" target="_blank" rel="noopener noreferrer">
            <svg width={24} height={24} viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-label="TikTok">
            <path d="M41.5 16.5c-3.6 0-6.5-2.9-6.5-6.5V6h-7v28.5c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4c.5 0 1 .1 1.5.3V26.2c-.5-.1-1-.2-1.5-.2-5 0-9 4-9 9s4 9 9 9 9-4 9-9V22.7c2 1.2 4.3 1.8 6.5 1.8v-8z"/>
            </svg>
            </SocialIconBox>
            <SocialIconBox className="instagram" href="https://instagram.com/shahzadarshadelect.dev" target="_blank" rel="noopener noreferrer">
            <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-label="Instagram">
            <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.13.62a1.13 1.13 0 1 1-2.26 0 1.13 1.13 0 0 1 2.26 0z"/>
            </svg>
            </SocialIconBox>
            <SocialIconBox className="facebook" href="https://facebook.com/profile.php?id=100054487568342" target="_blank" rel="noopener noreferrer">
            <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-label="Facebook">
            <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
            </svg>
            </SocialIconBox>
            </SocialIconsContainer>
            </Section>
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
