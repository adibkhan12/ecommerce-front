import styled from "styled-components";
import ButtonLink from "@/components/ButtonLink";
import CartIcon from "@/components/icons/CartIcon";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import { useContext, useRef, useState, useEffect } from "react";
import { CartContext } from "@/components/CartContext";

const SliderSection = styled.section`
  position: relative;
  width: 100vw;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  @media (max-width: 1024px) {
    width: 100%;
    left: 0;
    right: 0;
    margin-left: 0;
    margin-right: 0;
  }
  @media (max-width: 768px) {
    width: 100%;
    left: 0;
    right: 0;
    margin-left: 0;
    margin-right: 0;
  }
`;

const SlideBg = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  background: none;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,rgba(20,20,20,0.85) 0%,rgba(20,20,20,0.5) 60%,rgba(20,20,20,0.1) 100%);
  z-index: 2;
`;

const SlideRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  position: relative;
  z-index: 3;
  flex: 1 0 auto;
  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: flex-start;
    height: auto;
  }
`;

const SlideImageBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 380px;
  height: 380px;
  min-width: 220px;
  min-height: 220px;
  max-width: 420px;
  max-height: 420px;
  margin-top:15px;
  background: none;
  box-shadow: none;
  border-radius: 0;
  overflow: hidden;
  @media (max-width: 1024px) {
    margin-top:15px;
    width: 260px;
    height: 260px;
    min-width: 160px;
    min-height: 160px;
    max-width: 320px;
    max-height: 320px;
  }
  @media (max-width: 768px) {
    margin-top:35px;
    width: 100vw;
    height: 80vw;
    max-width: 100vw;
    max-height: 100vw;
    margin: 0 auto 18px auto;
  }
`;


const SlideContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  max-width: 700px;
  margin-left: 4vw;
  z-index: 3;
  @media (max-width: 1024px) {
    margin-left: 2vw;
    max-width: 90vw;
    padding-bottom: 0;
  }
  @media (max-width: 768px) {
    margin-left: 0;
    align-items: center;
    justify-content: flex-start;
    padding-bottom: 0;
    height: auto;
    max-width: 100vw;
  }
`;

const Title = styled.h1`
  margin: 15px 0 10px 0;
  font-weight: bold;
  font-size: 2.2rem;
  color: #111;
  text-shadow: none;
  background: none;
  padding: 0;
  border-radius: 0;
  display: block;
  @media (max-width: 1024px) {
    font-size: 1.4rem;
  }
  @media (max-width: 768px) {
    font-size: 1.1rem;
    text-align: center;
    margin-bottom: 6px;
  }
`;

const Desc = styled.p`
  color: #444;
  font-size: 1.1rem;
  margin-top: 0;
  margin-bottom: 18px;
  line-height: 1.5;
  text-shadow: none;
  background: none;
  padding: 0;
  border-radius: 0;
  display: block;
  @media (max-width: 1024px) {
    font-size: 0.97rem;
  }
  @media (max-width: 768px) {
    font-size: 0.89rem;
    text-align: center;
    margin-bottom: 10px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    justify-content: center;
    gap: 10px;
    button, a {
      font-size: 1.05rem !important;
      padding: 10px 18px !important;
      min-width: 120px;
    }
  }
`;

const SliderDots = styled.div`
  margin-top: 18px;
  text-align: center;
  position: static;
`;
const Dot = styled.span`
  font-size: 1.5rem;
  color: #bbb;
  margin: 0 4px;
  cursor: pointer;
  &.active {
    color: #fff;
    text-shadow: 0 2px 8px #000;
  }
`;

const TruncatedDesc = ({ text, maxWords, productId }) => {
  const words = text.split(" ");
  const truncatedText = words.slice(0, maxWords).join(" ") + (words.length > maxWords ? "..." : "");
  return (
    <>
      {truncatedText}
      {words.length > maxWords && (
        <ButtonLink href={`/product/${productId}`} style={{ marginLeft: "5px", fontWeight: "bold", color: "#fff" }}>
          Read More
        </ButtonLink>
      )}
    </>
  );
};

export default function FeaturedSlider({ products = [] }) {
  const { addProduct } = useContext(CartContext);
  const imgRef = useRef();
  const [current, setCurrent] = useState(0);
  const slideCount = products.length;
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (slideCount === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideCount);
    }, 3500);
    return () => clearInterval(interval);
  }, [slideCount]);

  function goToSlide(idx) {
    if (idx === current || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 700);
  }

  if (!products || products.length === 0) {
    return (
      <SliderSection>
        <SlideContent>
          <Title>Sorry, no featured products at the moment.</Title>
        </SlideContent>
      </SliderSection>
    );
  }
  const product = products[current];
  function animateToCart() {
    const img = imgRef.current;
    if (!img) return;
    const imgRect = img.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    const destElem = document.getElementById(isMobile ? "bars-icon" : "cart-link");
    if (!destElem) return;
    const destRect = destElem.getBoundingClientRect();
    const floatingImg = img.cloneNode(true);
    floatingImg.style.position = "fixed";
    floatingImg.style.left = imgRect.left + "px";
    floatingImg.style.top = imgRect.top + "px";
    floatingImg.style.width = imgRect.width + "px";
    floatingImg.style.height = imgRect.height + "px";
    floatingImg.style.zIndex = 9999;
    floatingImg.style.pointerEvents = "none";
    floatingImg.style.transition = "all 0.8s cubic-bezier(.4,1.3,.6,1)";
    floatingImg.style.opacity = 1;
    document.body.appendChild(floatingImg);
    void floatingImg.offsetWidth;
    floatingImg.style.left = destRect.left + destRect.width/2 - imgRect.width/4 + "px";
    floatingImg.style.top = destRect.top + destRect.height/2 - imgRect.height/4 + "px";
    floatingImg.style.width = imgRect.width/2 + "px";
    floatingImg.style.height = imgRect.height/2 + "px";
    floatingImg.style.opacity = 0;
    setTimeout(() => {
      document.body.removeChild(floatingImg);
    }, 850);
  }
  function addFeaturedToCart() {
    addProduct(product._id);
    animateToCart();
  }
  return (
    <SliderSection>
      <SlideBg />
      <SlideRow>
        <SlideImageBox>
          <SlideImage
            src={product.images?.[0]}
            alt={product.title}
            ref={imgRef}
          />
        </SlideImageBox>
        <SlideContent>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.7 }}
          >
            <Title>{product.title}</Title>
            <Desc>
              <TruncatedDesc text={product.description} maxWords={30} productId={product._id} />
            </Desc>
            <ButtonWrapper>
              <ButtonLink href={'/product/' + product._id} outline={1} black={1}>Read More</ButtonLink>
              <Button primary={1} onClick={addFeaturedToCart}>
                <CartIcon />
                Add to Cart
              </Button>
            </ButtonWrapper>
          </motion.div>
        </SlideContent>
      </SlideRow>
      <SliderDots>
        {products.map((_, idx) => (
          <Dot
            key={idx}
            className={idx === current ? "active" : ""}
            onClick={() => goToSlide(idx)}
          >
            ●
          </Dot>
        ))}
      </SliderDots>
    </SliderSection>
    
  );
}
