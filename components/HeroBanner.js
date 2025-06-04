import React, { useState } from "react";
import styled from "styled-components";

const BannerWrapper = styled.div`
  width: 100vw;
  margin-left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
  position: relative;
  background: #f5f7fa;
  @media (max-width: 768px) {
    border-radius: 0;
    margin: 0;
    width: 100vw;
    transform: none;
  }
`;

const Slides = styled.div`
  display: flex;
  transition: transform 0.6s cubic-bezier(.4,1.3,.6,1);
  transform: translateX(${props => `-${props.index * 100}%`});
`;

const Slide = styled.div`
  min-width: 100vw;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bg || '#e0e7ef'};
  color: #222;
  position: relative;
  @media (max-width: 768px) {
    height: 180px;
  }
`;

const BannerImage = styled.img`
  max-height: 90%;
  max-width: 45vw;
  object-fit: contain;
  margin-right: 32px;
  @media (max-width: 768px) {
    max-width: 40vw;
    margin-right: 12px;
  }
`;

const BannerContent = styled.div`
  max-width: 420px;
  @media (max-width: 768px) {
    max-width: 60vw;
  }
`;

const BannerTitle = styled.h2`
  font-size: 2.1rem;
  font-weight: 800;
  margin: 0 0 12px 0;
  color: #111;
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const BannerDesc = styled.p`
  font-size: 1.1rem;
  margin: 0 0 18px 0;
  color: #444;
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const BannerButton = styled.a`
  display: inline-block;
  background: #ff9900;
  color: #fff;
  font-weight: 700;
  padding: 12px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1.1rem;
  margin-top: 8px;
  transition: background 0.2s;
  &:hover {
    background: #ffb84d;
    color: #222;
  }
`;

const Arrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.8);
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  font-size: 1.5rem;
  color: #222;
  cursor: pointer;
  z-index: 2;
  left: ${props => props.left ? '18px' : 'auto'};
  right: ${props => props.right ? '18px' : 'auto'};
  &:hover {
    background: #ff9900;
    color: #fff;
  }
`;

const Dots = styled.div`
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
`;
const Dot = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: ${props => props.active ? '#ff9900' : '#ccc'};
  cursor: pointer;
  transition: background 0.2s;
`;

const slidesData = [
  {
    image: "/ads/mobile-sale.jpg", // Use a high-quality smartphone sale image
    title: "Mega Mobile Sale!",
    desc: "Up to 40% off on latest smartphones. Limited time only.",
    button: "Shop Mobiles",
    link: "/category/mobiles",
    bg: "#f8fafc"
  },
  {
    image: "/ads/laptop-deal.jpg", // Use a modern laptop image
    title: "Laptops for Every Need",
    desc: "Find the perfect laptop for work, gaming, or school.",
    button: "Shop Laptops",
    link: "/category/laptops",
    bg: "#e0e7ef"
  },
  {
    image: "/ads/accessories-offer.jpg", // Use an image with headphones, chargers, etc.
    title: "Accessories Bonanza",
    desc: "Cables, chargers, headphones & more at best prices!",
    button: "Shop Accessories",
    link: "/category/accessories",
    bg: "#fff7e6"
  }
];

export default function HeroBanner() {
  const [index, setIndex] = useState(0);
  const goTo = (i) => setIndex(i);
  const prev = () => setIndex(i => (i === 0 ? slidesData.length - 1 : i - 1));
  const next = () => setIndex(i => (i === slidesData.length - 1 ? 0 : i + 1));

  return (
    <BannerWrapper>
      <Slides index={index}>
        {slidesData.map((slide, i) => (
          <Slide key={i} bg={slide.bg}>
            <BannerImage src={slide.image} alt={slide.title} />
            <BannerContent>
              <BannerTitle>{slide.title}</BannerTitle>
              <BannerDesc>{slide.desc}</BannerDesc>
              <BannerButton href={slide.link}>{slide.button}</BannerButton>
            </BannerContent>
          </Slide>
        ))}
      </Slides>
      <Arrow left onClick={prev} aria-label="Previous">&#60;</Arrow>
      <Arrow right onClick={next} aria-label="Next">&#62;</Arrow>
      <Dots>
        {slidesData.map((_, i) => (
          <Dot key={i} active={i === index} onClick={() => goTo(i)} />
        ))}
      </Dots>
    </BannerWrapper>
  );
}
