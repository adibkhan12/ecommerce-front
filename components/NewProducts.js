import styled from "styled-components";
import Center from "@/components/Center";
import ProductsGrid from "@/components/ProductsGrid";
import NewArrivalsSlider from "@/components/NewArrivalsSlider";
import { useState, useEffect } from "react";

const Section = styled.section`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 32px rgba(44,62,80,0.10);
  padding: 48px 0 36px 0;
  margin: 48px 0 36px 0;
  @media (max-width: 600px) {
    padding: 24px 0 18px 0;
    margin: 24px 0 18px 0;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const ArrowButton = styled.button`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #222;
  box-shadow: 0 2px 8px rgba(44,62,80,0.10);
  cursor: pointer;
  margin-left: 8px;
  margin-right: 0;
  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;
const ArrowsGroup = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 2.4rem;
  font-weight: 800;
  color: #222;
  margin: 0;
  letter-spacing: 0.5px;
`;

export default function NewProducts({ products, wishedProducts }) {
  const [isMobile, setIsMobile] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Ensure sliderIndex is valid if products change
  useEffect(() => {
    if (sliderIndex > Math.max(0, (products?.length || 0) - 2)) {
      setSliderIndex(0);
    }
  }, [products, sliderIndex]);

  const maxIndex = Math.max(0, (products?.length || 0) - 2);
  const handlePrev = () => setSliderIndex(i => Math.max(0, i - 2));
  const handleNext = () => setSliderIndex(i => Math.min(maxIndex, i + 2));

  return (
    <Section>
      <Center>
        <TitleRow>
          <Title>New Arrivals</Title>
          {isMobile && (products && products.length > 2) && (
            <ArrowsGroup>
              <ArrowButton onClick={handlePrev} disabled={sliderIndex === 0} aria-label="Previous">&#60;</ArrowButton>
              <ArrowButton onClick={handleNext} disabled={sliderIndex >= maxIndex} aria-label="Next">&#62;</ArrowButton>
            </ArrowsGroup>
          )}
        </TitleRow>
        {products && products.length > 0 ? (
          isMobile ? (
            <NewArrivalsSlider products={products} wishedProducts={wishedProducts} index={sliderIndex} />
          ) : (
            <ProductsGrid products={products} wishedProducts={wishedProducts} />
          )
        ) : (
          <div style={{ color: '#888', fontSize: '1.1rem' }}>No new arrivals at the moment.</div>
        )}
      </Center>
    </Section>
  );
}