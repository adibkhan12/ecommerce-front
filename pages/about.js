import styled from "styled-components";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Center from "@/components/Center";
import Button from "@/components/Button";
import Link from "next/link";

// Container
const AboutSection = styled.section`
  --primary: #ff9900;
  --text: #1f2937;
  --muted: #6b7280;
  --card: #f8fafc;
  --ring: rgba(255, 153, 0, 0.25);

  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.08);
  margin: 56px auto 48px auto;
  max-width: 860px;
  overflow: hidden;
  border: 1px solid rgba(2, 6, 23, 0.06);

  @media (max-width: 600px) {
    margin: 24px auto 18px auto;
    border-radius: 16px;
  }
`;

// Banner/Header
const Banner = styled.div`
  position: relative;
  background: radial-gradient(1200px 400px at -10% -10%, #ffe8cc 0%, transparent 60%),
              linear-gradient(90deg, #fff6e8 0%, #fff 100%);
  color: var(--text);
  padding: 42px 40px 28px 40px;
  border-bottom: 1px solid rgba(2, 6, 23, 0.06);

  @media (max-width: 600px) {
    padding: 28px 14px 18px 14px;
  }
`;

const Title = styled.h1`
  font-size: clamp(1.8rem, 2.5vw, 2.4rem);
  font-weight: 900;
  letter-spacing: 0.4px;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: clamp(0.98rem, 1.1vw, 1.08rem);
  color: var(--muted);
  margin: 0;
  max-width: 56ch;
  line-height: 1.7;
`;

// Content
const Content = styled.div`
  padding: 32px 28px 36px 28px;
  @media (max-width: 600px) {
    padding: 18px 12px 22px 12px;
  }
`;

const ProfileCard = styled.article`
  background: var(--card);
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(2, 6, 23, 0.06);
  padding: 22px 22px 18px 22px;
  border: 1px solid rgba(2, 6, 23, 0.06);
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
`;

const Name = styled.h2`
  color: var(--text);
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
`;

const Role = styled.div`
  font-weight: 600;
  color: #374151;
`;

const ContactBox = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 14px 16px;
  margin-top: 6px;
  box-shadow: 0 4px 14px rgba(2, 6, 23, 0.06);
  font-size: 1.02rem;
  color: #374151;
  border: 1px solid rgba(2, 6, 23, 0.06);
`;

const ContactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;

  &:first-child {
    margin-top: 0;
  }

  a {
    color: var(--primary);
    text-decoration: none;
  }
`;

const AccentLink = styled.a`
  color: var(--primary);
  font-weight: 700;
  text-decoration: none;
`;

const WhatsappLink = styled.a`
  color: #25d366;
  font-weight: 700;
  text-decoration: none;
`;

const LandlineLink = styled.a`
  color: #f03e03;
  font-weight: 700;
  text-decoration: none;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: linear-gradient(90deg, var(--primary) 0%, rgba(255, 153, 0, 0) 60%);
  opacity: 0.22;
  margin: 28px 0 20px 0;
`;

const Actions = styled.div`
  margin-top: 20px;
  text-align: center;
`;

export default function AboutPage() {
  return (
    <>
      <Header />
      <Center>
        <AboutSection>
          <Banner>
            <Title>About Shahzad Arshad</Title>
            <Subtitle>
              Shahzad Arshad is the founder and driving force behind this ecommerce platform. With a passion for technology, innovation, and customer satisfaction, Shahzad has built a reputation for delivering quality products and exceptional service.
              <br />
              <br />
              Shahzad believes in making online shopping easy, secure, and accessible for everyone. His vision is to create a seamless experience for customers, from browsing to checkout and beyond.
            </Subtitle>
          </Banner>
          <Content>
            <ProfileCard>
              <Name>Shahzad Arshad</Name>
              <Role>Founder & CEO</Role>
              <ContactBox>
                <ContactRow>
                  <b>Phone:</b> <AccentLink href="tel:566130458">+971-56-6130458</AccentLink>
                </ContactRow>
                <ContactRow>
                  <b>Email:</b> <AccentLink href="mailto:sa@shahzadmobile.com">sa@shahzadmobile.com</AccentLink>
                </ContactRow>
                <ContactRow>
                  <b>WhatsApp:</b> <WhatsappLink href="https://wa.me/971566130458">+971-56-6130458</WhatsappLink>
                </ContactRow>
                <ContactRow>
                  <b>LandLine:</b> <LandlineLink href="tel:067317652">+971-67-317652</LandlineLink>
                </ContactRow>
              </ContactBox>
            </ProfileCard>
            <Divider />
            <Actions>
              <Link href="/">
                <Button primary>Back to Home</Button>
              </Link>
            </Actions>
          </Content>
        </AboutSection>
      </Center>
      <Footer />
    </>
  );
}
