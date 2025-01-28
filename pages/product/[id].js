import ProductImages from "@/components/ProductImages";
import Header from "@/components/Header";
import Center from "@/components/Center";
import Title from "@/components/Title";
import CartIcon from "@/components/icons/CartIcon";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/product";
import {CartContext} from "@/components/CartContext";
import {useContext} from "react";
import WhiteBox from "@/components/Box";
import styled from "styled-components";
import Button from "@/components/Button";

const ColsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    margin: 40px 0;

    @media screen and (min-width: 768px) {
        grid-template-columns: 0.8fr 1.2fr;
        align-items: start;
    }
`;

const PriceRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
    margin-top: 20px;

    @media screen and (min-width: 768px) {
        gap: 40px;
    }
`;

const Price = styled.span`
    font-size: 1.8rem;
    font-weight: bold;
    color: #333;
    background: linear-gradient(to right, #ff8c00, #ff4500);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    @media screen and (min-width: 768px) {
        font-size: 2rem;
    }
`;

const ProductDetails = styled.div`
  background: #f8f8f8;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media screen and (min-width: 768px) {
    padding: 30px;
  }
`;

const ProductDescription = styled.p`
    color: #555;
    font-size: 1rem;
    line-height: 1.6;
    margin-top: 15px;

    @media screen and (min-width: 768px) {
        font-size: 1.2rem;
    }
`;

const StyledButton = styled(Button)`
    background: linear-gradient(to right, #ff7f50, #ff4500);
    color: #fff;
    font-weight: bold;
    font-size: 1rem;
    padding: 10px 20px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    gap: 10px;

    &:hover {
        background: linear-gradient(to right, #ff4500, #ff7f50);
        box-shadow: 0 2px 10px rgba(255, 69, 0, 0.5);
    }

    @media screen and (min-width: 768px) {
        font-size: 1.2rem;
    }
`;

const ImageBox = styled(WhiteBox)`
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    overflow: hidden;

    img {
        max-width: 100%;
        max-height: 400px;
        object-fit: contain;
        border-radius: 10px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    &:hover img {
        transform: scale(1.05);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    @media screen and (min-width: 768px) {
        padding: 30px;
    }
`;

export default function ProductPage({ product }) {
    const { addProduct } = useContext(CartContext);

    return (
        <>
            <Header />
            <Center>
                <ColsWrapper>
                    <ImageBox>
                        <ProductImages images={product.images} />
                    </ImageBox>
                    <ProductDetails>
                        <Title>{product.title}</Title>
                        <ProductDescription>{product.description}</ProductDescription>
                        <PriceRow>
                            <Price>AED {product.price}</Price>
                            <StyledButton onClick={() => addProduct(product._id)} primary={1} outline={1}>
                                <CartIcon />
                                Add to Cart
                            </StyledButton>
                        </PriceRow>
                    </ProductDetails>
                </ColsWrapper>
            </Center>
        </>
    );
}

export async function getServerSideProps(context) {
    await mongooseConnect();
    const {id} = context.query;
    const product = await Product.findById(id);
    return {
        props:{
            product: JSON.parse(JSON.stringify(product )),
        }
    }
}
