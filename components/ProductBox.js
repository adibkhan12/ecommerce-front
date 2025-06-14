import styled from "styled-components";
import Button from "@/components/Button";
import Link from "next/link";
import {useContext, useEffect, useState, memo} from "react";
import {CartContext} from "@/components/CartContext";
import HeartSolidIcon from "@/components/icons/HeartSolidIcon";
import HeartOutlineIcon from "@/components/icons/HeartOutlineIcon";
import axios from "axios";
import { useRef } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Image from "next/image";

const WhiteBox = styled(Link)`
  background: linear-gradient(135deg, #f9f9f9 60%, #f3f3f3 100%);
  border-radius: 12px;
  padding: 12px 2px 8px 2px;
  min-height: 80px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  margin-bottom: 10px;
  transition: box-shadow 0.2s;
  img {
    max-width: 100%;
    max-height: 70px;
    object-fit: contain;
    transition: transform 0.2s;
    width: 100%;
    height: auto;
    display: block;
  }
  &:hover img {
    transform: scale(1.07);
  }
`;

const ProductWrapper = styled.div`
  background: linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%);
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(44,62,80,0.10);
  padding: 14px 8px 14px 8px;
  margin: 0 auto;
  transition: box-shadow 0.2s, transform 0.2s, background 0.2s;
  position: relative;
  width: 100%;
  min-width: 0;
  max-width: 340px;
  min-height: 200px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;
  @media (max-width: 600px) {
    padding: 8px 2px 10px 2px;
    max-width: 160px;
    border-radius: 12px;
    min-height: 170px;
  }
  &:hover {
    box-shadow: 0 8px 32px rgba(44,62,80,0.18);
    transform: translateY(-4px) scale(1.03);
    background: linear-gradient(135deg, #f3f8ff 60%, #dbeafe 100%);
  }
`;

const WishListButton = styled.button`
  border: none;
  width: 38px;
  height: 38px;
  background: #fff;
  border-radius: 50%;
  position: relative;
  top: -4px;
  right: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: box-shadow 0.2s, background 0.2s;
  z-index: 2;
  color: ${({ wished }) => (wished ? 'red' : '#bbb')};
  margin-left: 8px;
  @media (max-width: 600px) {
    width: 24px;
    height: 24px;
    top: -2px;
    right: 0;
    svg {
      width: 14px;
      height: 14px;
    }
  }
  &:hover {
    background: #ffe5d0;
    box-shadow: 0 4px 16px rgba(255,153,0,0.13);
  }
  svg {
    width: 22px;
    height: 22px;
  }
`;

const ProductInfoBox = styled.div`
  margin-top: 2px;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  max-width: 320px;
  box-sizing: border-box;
  min-height: 70px;
  padding: 0 8px 4px 8px;
  @media (max-width: 600px) {
    max-width: 160px;
    min-height: 60px;
    padding: 0 6px 2px 6px;
  }
`;

const Title = styled(Link)`
  font-weight: 600;
  font-size: 1.08rem;
  color: #222;
  text-decoration: none;
  margin: 0 0 2px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  transition: color 0.2s;
  padding: 0 8px;
  min-height: 2.3em;
  line-height: 1.15em;
  @media (max-width: 600px) {
    font-size: 0.98rem;
    padding: 0 6px;
    min-height: 2.2em;
  }
  &:hover {
    color: #ff9900;
  }
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  gap: 8px;
  padding: 0 8px;
  @media (max-width: 600px) {
    padding: 0 6px;
  }
`;

const Price = styled.div`
  font-size: 1.13rem;
  font-weight: 700;
  color: #ff4500;
  letter-spacing: 0.5px;
  @media (max-width: 600px) {
    font-size: 0.95rem;
  }
`;

const StyledButton = styled(Button)`
  min-width: 90px;
  font-size: 1rem;
  padding: 10px 16px;
  border-radius: 8px;
  @media (max-width: 600px) {
    font-size: 0.85rem;
    padding: 6px 8px;
    min-width: 70px;
    border-radius: 6px;
  }
`;

const CompareCheckbox = styled.input`
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 3;
  width: 20px;
  height: 20px;
  accent-color: #ff9900;
  @media (max-width: 600px) {
    left: 2px;
    top: 2px;
    width: 14px;
    height: 14px;
  }
`;

function StarRating({ value }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1, fontSize: '1.1em', marginTop: 2 }}>
      {[1,2,3,4,5].map(star => (
        <span key={star} style={{ color: star <= value ? '#ff9900' : '#ccc' }}>&#9733;</span>
      ))}
    </span>
  );
}

const ProductWhiteBox = ({
    _id, title, price, images, colorVariants, wished: initialWished,
    stock,
    compareEnabled = false,
    compareChecked = false,
    onCompareChange = () => {},
    onRemoveFromWishlist = ()=>{},
    reviewSummary = null,
}) => {
    const {addProduct}=useContext(CartContext)
    const url = '/product/'+_id;
    const[isWished,setIsWished] = useState(initialWished);
    const imgRef = useRef();
    useEffect(() => {
        setIsWished(initialWished);
    }, [initialWished]);

    function addToWishList(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        const newWishedState = !isWished;
        setIsWished(newWishedState);

        if (!newWishedState && onRemoveFromWishlist) {
            onRemoveFromWishlist(_id);
        }

        axios.post('/api/wishlist', { product: _id }, { withCredentials: true })
            .then((res) => {
                console.log(res.data);
            })
            .catch(err => {
                console.error("Error adding/removing from wishlist:", err.response?.data || err);
                Swal.fire({
                  icon: "info",
                  title: "Login Required",
                  text: "You need to log in to modify your wishlist.",
                  confirmButtonColor: "#ff9900",
                  background: "#fff",
                  customClass: {
                    popup: 'swal2-popup-custom',
                  }
                });
                setIsWished(prev => !prev); // Revert state on error
            });
    }

    function animateToCart() {
        const img = imgRef.current;
        if (!img) return;
        const imgRect = img.getBoundingClientRect();
        // Decide destination
        const isMobile = window.innerWidth < 768;
        const destElem = document.getElementById(isMobile ? "bars-icon" : "cart-link");
        if (!destElem) return;
        const destRect = destElem.getBoundingClientRect();
        // Create floating image
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
        // Force reflow
        void floatingImg.offsetWidth;
        // Animate
        floatingImg.style.left = destRect.left + destRect.width/2 - imgRect.width/4 + "px";
        floatingImg.style.top = destRect.top + destRect.height/2 - imgRect.height/4 + "px";
        floatingImg.style.width = imgRect.width/2 + "px";
        floatingImg.style.height = imgRect.height/2 + "px";
        floatingImg.style.opacity = 0;
        // Remove after animation
        setTimeout(() => {
            document.body.removeChild(floatingImg);
        }, 850);
    }

    function handleAddToCart() {
        addProduct(_id);
        animateToCart();
    }

    return (
        <ProductWrapper>
            <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: 10, left: 10, right: 10, zIndex: 3 }}>
                    {compareEnabled && (
                      <CompareCheckbox
                        type="checkbox"
                        checked={compareChecked}
                        onChange={e => {
                          onCompareChange(e.target.checked);
                        }}
                        title="Compare"
                        style={{ position: 'static' }}
                      />
                    )}
                    <WishListButton wished={isWished ? "true" : undefined} onClick={addToWishList}>
                        {isWished ? <HeartSolidIcon/> : <HeartOutlineIcon/>}
                    </WishListButton>
                </div>
                <WhiteBox href={url}>
                    <div className="image-container">
                        {(() => {
                          let displayImg = images?.[0];
                          if (
                            Array.isArray(colorVariants) &&
                            colorVariants.length > 0 &&
                            Array.isArray(colorVariants[0].images) &&
                            colorVariants[0].images.length > 0
                          ) {
                            displayImg = colorVariants[0].images[0];
                          }
                          return displayImg ? (
                            <Image
                              ref={imgRef}
                              src={displayImg}
                              alt={title}
                              width={200}
                              height={200}
                              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                              priority={false}
                            />
                          ) : null;
                        })()}
                    </div>
                </WhiteBox>
            </div>
            <ProductInfoBox>
                <Title href={url}>{title}</Title>
                {reviewSummary && reviewSummary.count > 0 && (
                  <div style={{ margin: '2px 0 4px 0', color: '#ff9900', fontWeight: 600, fontSize: '1.01em' }}>
                    <StarRating value={Math.round(reviewSummary.avgRating)} /> {reviewSummary.avgRating} ({reviewSummary.count})
                  </div>
                )}
                <PriceRow>
                    <Price>
                        {price} AED
                    </Price>
                    {stock === 0 ? (
                      <span style={{ color: 'red', fontWeight: 600, fontSize: '1rem' }}>Out of Stock</span>
                    ) : (
                      <StyledButton block onClick={handleAddToCart} primary={1} outline={1}>
                        Add to Cart
                      </StyledButton>
                    )}
                </PriceRow>
            </ProductInfoBox>
        </ProductWrapper>
    )
}

export default memo(ProductWhiteBox);