import Center from "@/components/Center";
import styled from "styled-components";
import ButtonLink from "@/components/ButtonLink";
import CartIcon from "@/components/icons/CartIcon";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import {useContext, useRef, useState, useEffect} from "react";
import {CartContext} from "@/components/CartContext";

const Bg = styled.div`
    background-color: #1a1a1a;
    color: #f5f5f5;
    padding: 30px 15px;
`;

const Title = styled.h1`
    margin: 0;
    font-weight: bold;
    font-size: 2rem;
    color: #ffffff;
    text-transform: capitalize;
    @media screen and (min-width: 768px) {
        font-size: 3.5rem;
    }
`;

const Desc = styled.p`
    color: #cccccc;
    font-size: 1rem;
    margin-top: 10px;
    line-height: 1.5;
`;

const ButtonWrapper = styled.div`
    display: flex;
    gap: 15px;
    margin-top: 30px;
    flex-wrap: wrap;
`;

const ColumnWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 50px;
    margin-top: 20px;
    img {
        max-width: 100%;
        max-height: 250px;
        object-fit: cover;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    div:nth-child(1) {
        order: 2;
        margin-left: auto;
        margin-right: auto;
    }
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.2fr 0.8fr;
        align-items: center;
        div:nth-child(1) {
            order: 0;
        }
        img {
            max-height: 400px;
            margin: 0;
        }
    }
`;

const ImgColumn = styled.div`
    align-items: center;
    text-align: center;
    & > div{
        width: 100%;
    }
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    @media screen and (min-width: 768px) {
        align-items: flex-start;
        text-align: left;
    }
`;

const SliderDots = styled.div`
    margin-top: 1.5rem;
    text-align: center;
`;
const Dot = styled.span`
    font-size: 1.5rem;
    color: #bbb;
    margin: 0 4px;
    cursor: pointer;
    &.active {
        color: #fff;
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

export default function Featured({ products = [] }) {
    const { addProduct } = useContext(CartContext);
    const imgRef = useRef();
    const [current, setCurrent] = useState(0);
    const slideCount = products.length;

    useEffect(() => {
        if (slideCount === 0) return;
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slideCount);
        }, 3000);
        return () => clearInterval(interval);
    }, [slideCount]);

    if (!products || products.length === 0) {
        return (
            <Bg>
                <Center>
                    <Title>Sorry, no featured products at the moment.</Title>
                </Center>
            </Bg>
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
        <Bg>
            <Center>
                <ColumnWrapper>
                    <Column>
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7 }}
                            >
                                <Title>{product.title}</Title>
                                <Desc>
                                    <TruncatedDesc text={product.description} maxWords={30} productId={product._id} />
                                </Desc>
                                <ButtonWrapper>
                                    <ButtonLink href={'/product/' + product._id} outline={1} white={1}>Read More</ButtonLink>
                                    <Button primary={1} onClick={addFeaturedToCart}>
                                        <CartIcon />
                                        Add to Cart
                                    </Button>
                                </ButtonWrapper>
                            </motion.div>
                        </div>
                    </Column>
                    <ImgColumn>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <img ref={imgRef} src={product.images?.[0]} alt={product.title} />
                        </motion.div>
                    </ImgColumn>
                </ColumnWrapper>
                <SliderDots>
                    {products.map((_, idx) => (
                        <Dot
                            key={idx}
                            className={idx === current ? "active" : ""}
                            onClick={() => setCurrent(idx)}
                        >
                            ●
                        </Dot>
                    ))}
                </SliderDots>
            </Center>
        </Bg>
    );
}
