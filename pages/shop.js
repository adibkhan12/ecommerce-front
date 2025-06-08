import styled from "styled-components";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Center from "@/components/Center";

const ShopSection = styled.section`
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(44,62,80,0.13);
  padding: 0;
  margin: 56px 0 48px 0;
  max-width: 950px;
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
  color: #ff9900;
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
  color: #fff;
`;

const Address = styled.div`
  font-size: 1.08rem;
  color: #fff;
  margin-bottom: 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Content = styled.div`
  padding: 36px 32px 32px 32px;
  @media (max-width: 600px) {
    padding: 18px 6px 18px 6px;
  }
`;

const SectionHeading = styled.h2`
  color: #ff9900;
  font-size: 1.35rem;
  font-weight: 800;
  margin: 0 0 18px 0;
  letter-spacing: 0.5px;
`;

const PhotosGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-bottom: 32px;
  justify-content: center;
`;

const PhotoCard = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(44,62,80,0.07);
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MapWrapper = styled.div`
  margin: 32px 0 0 0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(44,62,80,0.10);
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, #ff9900 0%, #fff 100%);
  opacity: 0.18;
  margin: 32px 0 24px 0;
`;

export default function ShopPage() {
  return (
    <>
      <Header />
      <Center>
        <ShopSection>
          <Banner>
            <Title>Visit Our Shop</Title>
            <Intro>
              Welcome to <b>Shahzad Arshad Elect. Devices tr</b>!<br />
              We are located in the heart of Sharjah at Rolla Mall, offering a wide range of electronic devices and exceptional customer service. Our shop is your trusted destination for the latest gadgets, accessories, and expert advice.
            </Intro>
            <Address>
              <span role="img" aria-label="location">📍</span> Rolla Mall, Second Floor, Shop 216, Al Rolla, Sharjah, UAE
            </Address>
          </Banner>
          <Content>
            <SectionHeading>Shop Photos</SectionHeading>
            <PhotosGrid>
              <PhotoCard>
                <img src="/shop1.jpg" alt="Shop Interior (public/shop1.jpg)" width="400" height="260" style={{borderRadius:'10px',objectFit:'cover',display:'block',maxWidth:'100%'}} loading="lazy" />
              </PhotoCard>
            </PhotosGrid>
            <Divider />
            <SectionHeading>Find Us on the Map</SectionHeading>
            <MapWrapper>
              <iframe
                title="Shop Location"
                src="https://www.google.com/maps?q=Rolla+Mall,+Sharjah,+UAE&output=embed"
                width="100%"
                height="340"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </MapWrapper>
          </Content>
        </ShopSection>
      </Center>
      <Footer />
    </>
  );
}
