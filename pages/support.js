import styled from "styled-components";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Center from "@/components/Center";

const SupportSection = styled.section`
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

const Intro = styled.p`
  font-size: 1.18rem;
  margin: 0 0 10px 0;
  line-height: 1.7;
  color: #222;
`;

const Content = styled.div`
  padding: 36px 32px 32px 32px;
  @media (max-width: 600px) {
    padding: 18px 6px 18px 6px;
  }
`;

const ContactBox = styled.div`
  background: #f8fafc;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(44,62,80,0.07);
  padding: 22px 18px 18px 18px;
  margin-bottom: 24px;
  font-size: 1.08rem;
  color: #333;
`;

const ContactRow = styled.div`
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SectionHeading = styled.h2`
  color: #ff9900;
  font-size: 1.18rem;
  font-weight: 800;
  margin: 0 0 18px 0;
  letter-spacing: 0.5px;
`;

const FAQ = styled.div`
  margin-top: 18px;
`;

const Question = styled.div`
  font-weight: 700;
  margin-bottom: 4px;
  color: #222;
`;

const Answer = styled.div`
  margin-bottom: 16px;
  color: #444;
`;

const Hours = styled.div`
  margin-top: 18px;
  font-size: 1.05rem;
  color: #555;
`;

export default function SupportPage() {
  return (
    <>
      <Header />
      <Center>
        <SupportSection>
          <Banner>
            <Title>Support & Help Center</Title>
            <Intro>
              We're here to help! If you have any questions, issues, or need assistance with your order, our support team is ready to assist you.
            </Intro>
          </Banner>
          <Content>
            <SectionHeading>Contact</SectionHeading>
            <ContactBox>
              <ContactRow>
                <span role="img" aria-label="whatsapp">💬</span>
                WhatsApp: <a href="https://wa.me/971566130458" style={{color:'#25d366',fontWeight:700}}>+971-56-6130458</a>
              </ContactRow>
              <ContactRow>
                <span role="img" aria-label="phone">📞</span>
                Phone: <a href="tel:566130458" style={{color:'#ff9900'}}>+971-56-6130458</a>
              </ContactRow>
              <ContactRow>
                <span role="img" aria-label="email">✉️</span>
                Email: <a href="mailto:sa@shahzadmobile.com" style={{color:'#ff9900'}}>sa@shahzadmobile.com</a>
              </ContactRow>
            </ContactBox>
            <SectionHeading>Frequently Asked Questions</SectionHeading>
            <FAQ>
              <Question>How can I check my order status?</Question>
              <Answer>You will receive an email with tracking information once your order is shipped. You can also contact us via WhatsApp for updates.</Answer>
              <Question>What is your return policy?</Question>
              <Answer>We accept returns within 7 days of delivery for unused products in original packaging. Please contact support to initiate a return.</Answer>
              <Question>How long does shipping take?</Question>
              <Answer>Orders are usually delivered within 2-4 business days within the UAE. International shipping times may vary.</Answer>
              <Question>What payment methods do you accept?</Question>
              <Answer>We accept Cash on Delivery, major credit/debit cards, and secure online payments.</Answer>
            </FAQ>
            <SectionHeading>Business Hours</SectionHeading>
            <Hours>
              Monday - Sunday : 10:00 hrs – 23:00 hrs<br />
            </Hours>
          </Content>
        </SupportSection>
      </Center>
      <Footer />
    </>
  );
}
