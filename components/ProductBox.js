import styled from "styled-components";
import Button from "@/components/Button";
import Link from "next/link";
import {useContext, useEffect, useState} from "react";
import {CartContext} from "@/components/CartContext";
import HeartSolidIcon from "@/components/icons/HeartSolidIcon";
import HeartOutlineIcon from "@/components/icons/HeartOutlineIcon";
import axios from "axios";


const ProductWrapper = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  padding: 18px 14px 16px 14px;
  margin: 0 0 18px 0;
  transition: box-shadow 0.2s, transform 0.2s;
  position: relative;
  min-width: 180px;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  &:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.13);
    transform: translateY(-4px) scale(1.02);
  }
`;

const WhiteBox = styled(Link)`
  background: linear-gradient(135deg, #f9f9f9 60%, #f3f3f3 100%);
  border-radius: 12px;
  padding: 18px 8px 10px 8px;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  margin-bottom: 10px;
  transition: box-shadow 0.2s;
  img {
    max-width: 100%;
    max-height: 90px;
    object-fit: contain;
    transition: transform 0.2s;
  }
  &:hover img {
    transform: scale(1.07);
  }
`;

const Title = styled(Link)`
  font-weight: 600;
  font-size: 1.08rem;
  color: #222;
  text-decoration: none;
  margin: 0 0 2px 0;
  display: block;
  text-align: left;
  transition: color 0.2s;
  &:hover {
    color: #ff9900;
  }
`;

const ProductInfoBox = styled.div`
  margin-top: 2px;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  gap: 8px;
`;

const Price = styled.div`
  font-size: 1.13rem;
  font-weight: 700;
  color: #ff4500;
  letter-spacing: 0.5px;
`;

const WishListButton = styled.button`
  border: none;
  width: 38px;
  height: 38px;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: box-shadow 0.2s, background 0.2s;
  z-index: 2;
  color: ${({ wished }) => (wished ? 'red' : '#bbb')};
  &:hover {
    background: #ffe5d0;
    box-shadow: 0 4px 16px rgba(255,153,0,0.13);
  }
  svg {
    width: 22px;
    height: 22px;
  }
`;


export default function ProductWhiteBox({
    _id, title, price, images, description, arDescription, brand, category, wished: initialWished,
    onRemoveFromWishlist = ()=>{},
}) {
        const {addProduct}=useContext(CartContext)
    const url = '/product/'+_id;
    const[isWished,setIsWished] = useState(initialWished);
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
                alert("You need to log in to modify your wishlist.");
                setIsWished(prev => !prev); // Revert state on error
            });
    }

    return (
        <ProductWrapper>
            <WhiteBox href={url}>
                <div>
                    <WishListButton wished={isWished ? "true" : undefined} onClick={addToWishList}>
                        {isWished ? <HeartSolidIcon/> : <HeartOutlineIcon/>}
                    </WishListButton>
                    <img src={images?.[0]} alt=""/>
                </div>
            </WhiteBox>
            <ProductInfoBox>
                <Title href={url}>{title}</Title>
                <PriceRow>
                    <Price>
                        {price} AED
                    </Price>
                    <Button block onClick={() => addProduct(_id)} primary={1} outline={1} style={{ minWidth: 110 }}>
                        Add to Cart
                    </Button>
                </PriceRow>
            </ProductInfoBox>
        </ProductWrapper>
    )
}