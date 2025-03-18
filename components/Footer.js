import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";

const FooterWrapper = styled.footer`
  background-color: #111;
  color: white;
  margin-top: 220px;
  padding: 40px 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  text-align: left;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
`;

const Section = styled.div`
  flex: 1;
  min-width: 250px;
  margin-bottom: 20px;
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  margin-bottom: 15px;
`;

const ContactInfo = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
`;

const QuickLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 8px;
  }

  a {
    color: #ddd;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s ease;

    &:hover {
      color: #ff9900;
    }
  }
`;

const PaymentMethods = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;

  img {
    width: 50px;
    height: auto;
  }
`;

const Countries = styled.div`
  margin-top: 15px;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: auto;
    height: auto;
  }
`;

export default function Footer() {
    return (
        <FooterWrapper>
            {/* Left Section - Contact */}
            <Section>
                <Logo>Shahzad Arshad</Logo>
                <ContactInfo>
                    Shahzad Arshad Elect tr<br />
                    Shop 216, Second Floor<br />
                    Rolla Mall <br />
                    Al Rolla, Sharjah<br />
                    📞 566-130-458 <br />
                    📧 <a href="mailto:Shahzad.qadri26@gmail.com" style={{ color: "#ff9900" }}>
                    Shahzad.qadri26@gmail.com
                </a>
                </ContactInfo>
            </Section>

            {/* Center Section - Links & Payment */}
            <Section>
                <h4>QUICK LINKS</h4>
                <QuickLinks>
                    <li><Link href="/about">About Us</Link></li>
                    <li><Link href="/terms">Terms & Conditions</Link></li>
                    <li><Link href="/shop">Shop</Link></li>
                    <li><Link href="/support">Support</Link></li>
                </QuickLinks>
            </Section>

            {/* Right Section - Countries & Live Chat */}
            <Section>
                <h4>COUNTRIES WE SHIP TO</h4>
                <Countries>
                    <Image src="/uae-flag-2.png" width={200} height={160} alt="UAE" />
                </Countries>
            </Section>
        </FooterWrapper>
    );
}
