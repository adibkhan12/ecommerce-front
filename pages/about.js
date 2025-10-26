import styled from "styled-components";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Center from "@/components/Center";
import Button from "@/components/Button";
import Link from "next/link";

const AboutSection = styled.section`
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(44,62,80,0.13);
  padding: 0;
  margin: 56px 0 48px 0;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
  @media (max-width: 600px) {
    margin: 24px 0 18px 0;
    border-radius: 12px;
  }
`;

const Banner = styled.div`
  background: linear-gradient(90deg, #e0e0e0 60%, #bdbdbd 100%);
  color: #222;
  padding: 38px 32px 24px 32px;
  text-align: left;
  @media (max-width: 600px) {
    padding: 24px 10px 16px 10px;
  }
`;

const Title = styled.h1`
  font-size: 2.3rem;
  font-weight: 900;
  margin: 0 0 10px 0;
  letter-spacing: 1px;
`;

const Info = styled.div`
  font-size: 1.15rem;
  color: #fff;
  margin-bottom: 0;
  line-height: 1.7;
`;

const Content = styled.div`
  padding: 36px 32px 32px 32px;
  @media (max-width: 600px) {
    padding: 18px 6px 18px 6px;
  }
`;

const ProfileCard = styled.div`
  background: #f8fafc;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(44,62,80,0.07);
  padding: 28px 18px 18px 18px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const Name = styled.h2`
  color: #ff9900;
  font-size: 1.45rem;
  font-weight: 800;
  margin: 0 0 6px 0;
`;

const ContactBox = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 14px 16px;
  margin-top: 8px;
  box-shadow: 0 2px 8px rgba(44,62,80,0.07);
  font-size: 1.08rem;
  color: #333;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, #ff9900 0%, #fff 100%);
  opacity: 0.18;
  margin: 32px 0 24px 0;
`;

export default function AboutPage() {
  return (
    <>
      <Header />
      <Center>
        <AboutSection>
          <Banner>
            <Title>About Shahzad Arshad</Title>
            <Info>
              Shahzad Arshad is the founder and driving force behind this ecommerce platform. With a passion for technology, innovation, and customer satisfaction, Shahzad has built a reputation for delivering quality products and exceptional service.<br /><br />
              Shahzad believes in making online shopping easy, secure, and accessible for everyone. His vision is to create a seamless experience for customers, from browsing to checkout and beyond.
            </Info>
          </Banner>
          <Content>
            <ProfileCard>
              <Name>Shahzad Arshad</Name>
              <div style={{fontWeight:600, color:'#444'}}>Founder & CEO</div>
              <ContactBox>
                <div>
                <b>Phone: </b><a href="tel:566130458" style={{color:'#ff9900'}}>+971-56-6130458</a>
                </div>
                <div>
                  <b>Email:</b> <a href="mailto:sa@shahzadmobile.com" style={{color:'#ff9900'}}>sa@shahzadmobile.com</a></div>
                <div style={{marginTop:'8px'}}>
                  <b>WhatsApp:</b> <a href="https://wa.me/971566130458" style={{color:'#25d366',fontWeight:700}}>+971-56-6130458</a>
                </div>
                <div style={{marginTop:'6px'}}>
                  <b>LandLine:</b> <a href="tel:067317652" style={{color:'#ff9900'}}>067317652</a>
                </div>
              </ContactBox>
            </ProfileCard>
            <Divider />
            <div style={{marginTop:'18px',textAlign:'center'}}>
              <Link href="/">
                <Button primary>Back to Home</Button>
              </Link>
            </div>
          </Content>
        </AboutSection>
      </Center>
      <Footer />
    </>
  );
}
