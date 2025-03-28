import styled from "styled-components";
import Button from "@/components/Button";
import Link from "next/link";
import {useContext, useEffect, useState} from "react";
import {CartContext} from "@/components/CartContext";
import HeartSolidIcon from "@/components/icons/HeartSolidIcon";
import HeartOutlineIcon from "@/components/icons/HeartOutlineIcon";
import axios from "axios";


const ProductWrapper = styled.div`
`;

const WhiteBox = styled(Link)`
    background-color: white;
    padding: 15px;
    height: 120px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    position: relative;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    img {
        max-width: 100%;
        max-height: 80px;
    }

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
`;

const  Title = styled(Link)`
    font-weight: normal;
    font-size: .9rem;
    color: inherit;
    text-decoration: none;
    margin: 0;
`;

const ProductInfoBox= styled.div`
    margin-top: 5px;
`;

const PriceRow= styled.div`
    display : block;
    @media screen and (min-width: 768px){
        display: flex;
        gap: 5px;
    }
    align-items: center;
    justify-content: space-between;
    margin-top: 2px;
`;

const Price = styled.div`
    font-size: 1rem;
    font-weight: 400;
    text-align: right;
    @media screen and (min-width: 768px){
        font-size: 1.2rem;
        font-weight: 600;
        text-align: left;
    }
`;

const WishListButton= styled.button`
    border: none;
    width: 40px !important;
    height: 40px;
    background: transparent;
    position: absolute; 
    top: 10px; 
    right: 10px; 
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    ${({ wished }) =>
            wished &&
            `
        color: red;
    `}
    svg {
        width: 20px;
        height: 20px;
    }
`;


export default function ProductWhiteBox({
    _id,title, description,price,images,wished: initialWished,
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
                    <Button block onClick={() => addProduct(_id)} primary={1} outline={1} >
                        Add to Cart
                    </Button>
                </PriceRow>
            </ProductInfoBox>
        </ProductWrapper>
    )
}