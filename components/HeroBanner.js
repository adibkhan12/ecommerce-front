import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useRouter } from "next/router";

const BannerWrapper = styled.div`
  width: 100vw;
  margin-left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
  position: relative;
  background: #fff;
  border-bottom: 1px solid #ececec;
  box-shadow: 0 2px 12px rgba(44,62,80,0.06);
  z-index: 1;
  @media (max-width: 768px) {
    border-radius: 0;
    margin: 0;
    width: 100vw;
    transform: none;
    box-shadow: none;
    margin-top: 0;
  }
`;

const Slides = styled.div`
  display: flex;
  transition: transform 0.6s cubic-bezier(0.4,1.3,0.6,1);
  ${(props) => `transform: translateX(-${props.index * 100}%);`}
`;

const Slide = styled.div`
  min-width: 100vw;
  height: 240px;
  display: flex;
  align-items: stretch;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-radius: 0;
  border-bottom: 1px solid #ececec;
  background: ${({ $bgimg }) =>
    $bgimg
      ? `linear-gradient(90deg,rgba(0,0,0,0.45) 0%,rgba(0,0,0,0.15) 100%), url('${$bgimg}') center/cover no-repeat`
      : '#fff'};
  background-position: center center;
  background-repeat: no-repeat;
  color: #fff;
  @media (max-width: 1024px) {
    height: 180px;
  }
  @media (max-width: 768px) {
    height: 178px;
    align-items: flex-end;
    background-position: center;
    background-size: cover;
  }
  @media (max-width: 480px) {
    height: 160px;
  }
`;

const BannerContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 32px 38px;
  max-width: 520px;
  background: rgba(0,0,0,0.18);
  border-radius: 18px;
  margin: auto 0 auto 4vw;
  @media (max-width: 1024px) {
    padding: 18px 10px;
    max-width: 95vw;
    margin: 0 auto 18px auto;
  }
  @media (max-width: 768px) {
    padding: 18px 10px 14px 10px;
    max-width: 99vw;
    margin: 0 auto 10px auto;
    align-items: center;
    text-align: center;
    background: rgba(0,0,0,0.32);
  }
`;

const BannerTitle = styled.h2`
  font-size: 1.45rem;
  font-weight: 900;
  margin: 0 0 8px 0;
  color: #fff;
  letter-spacing: 0.2px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
  @media (max-width: 768px) {
    font-size: 1.08rem;
  }
`;

const BannerDesc = styled.p`
  font-size: 1.05rem;
  margin: 0 0 12px 0;
  color: #f3f3f3;
  font-weight: 500;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
  @media (max-width: 768px) {
    font-size: 0.93rem;
  }
`;

const BannerButton = styled.button`
  display: inline-block;
  background: #ff9900;
  color: #fff;
  font-weight: 700;
  padding: 10px 26px;
  border-radius: 22px;
  border: none;
  font-size: 1rem;
  margin-top: 8px;
  box-shadow: 0 2px 8px rgba(255,153,0,0.10);
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  cursor: pointer;
  letter-spacing: 0.2px;
  &:hover {
    background: #ffb84d;
    color: #222;
    box-shadow: 0 4px 12px rgba(255,153,0,0.16);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

export default function HeroBanner() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await axios.get("/api/adbanner");
        if (Array.isArray(res.data)) {
          setSlides(res.data.filter(b => b && b.image));
        } else {
          setSlides([]);
        }
      } catch (e) {
        setSlides([]);
      }
    }
    fetchBanners();
  }, []);

  const goTo = (i) => setIndex(i);
  const prev = () => setIndex(i => (i === 0 ? slides.length - 1 : i - 1));
  const next = () => setIndex(i => (i === slides.length - 1 ? 0 : i + 1));

  function handleBannerClick(link) {
    if (link) router.push(link);
  }

  if (!slides.length) return null;

  return (
    <BannerWrapper>
      <Slides index={index}>
        {slides.map((slide, i) => (
          <Slide key={i} $bgimg={slide.image}>
            <BannerContent>
              <BannerTitle>{slide.title}</BannerTitle>
              <BannerDesc>{slide.desc}</BannerDesc>
              {slide.button && (
                <BannerButton
                  onClick={() => slide.link && handleBannerClick(slide.link)}
                  disabled={!slide.link}
                  title={!slide.link ? "No link set for this banner" : ""}
                  style={!slide.link ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                >
                  {slide.button}
                </BannerButton>
              )}
            </BannerContent>
            {/* Ad label */}
            <div style={{
              position: 'absolute',
              top: 10,
              right: 18,
              background: '#ff9900',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.85rem',
              borderRadius: 8,
              padding: '2px 10px',
              letterSpacing: '0.5px',
              opacity: 0.85,
              zIndex: 10
            }}>Ad</div>
          </Slide>
        ))}
      </Slides>
      <Arrow left onClick={prev} aria-label="Previous">&#60;</Arrow>
      <Arrow right onClick={next} aria-label="Next">&#62;</Arrow>
      <Dots>
        {slides.map((_, i) => (
          <Dot key={i} active={i === index} onClick={() => goTo(i)} />
        ))}
      </Dots>
    </BannerWrapper>
  );
}
