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
  display: flex;
  flex-direction: column;
  gap: 36px;
  margin: 40px 0;
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
  @media screen and (min-width: 900px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 48px;
    max-width: 1200px;
  }
  @media screen and (max-width: 900px) {
    padding: 0 4px;
    max-width: 100vw;
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
  background: #fff;
  border-radius: 18px;
  padding: 36px 32px 32px 32px;
  box-shadow: 0 6px 32px rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 320px;
  @media screen and (max-width: 900px) {
    min-width: 0;
    padding: 24px 10px 18px 10px;
  }
`;

const ProductDescription = styled.p`
    color: #444;
    font-size: 1.13rem;
    line-height: 1.7;
    margin: 18px 0 0 0;
    background: #f9f9f9;
    border-radius: 8px;
    padding: 18px 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    @media screen and (min-width: 768px) {
        font-size: 1.18rem;
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
                        <Title style={{
                          fontSize: '2.5rem',
                          fontWeight: 800,
                          color: '#222',
                          marginBottom: 8,
                          letterSpacing: '0.5px',
                          background: 'linear-gradient(90deg, #ff9900 0%, #ff4500 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}>{product.title}</Title>
                        {product.properties && (
                            <div style={{ margin: '10px 0 18px 0', display: 'flex', flexWrap: 'wrap', gap: '10px 14px' }}>
                                {Object.entries(product.properties).map(([key, value]) => (
                                    <span key={key} style={{
                                        display: 'inline-block',
                                        background: 'linear-gradient(90deg, #ffe0b2 0%, #fff3e0 100%)',
                                        color: '#ff4500',
                                        borderRadius: '20px',
                                        padding: '6px 16px',
                                        fontWeight: 600,
                                        fontSize: '1.01rem',
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                                        letterSpacing: '0.2px',
                                    }}>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                                    </span>
                                ))}
                            </div>
                        )}
                        <hr style={{ border: 0, borderTop: '1.5px solid #f0f0f0', margin: '18px 0 0 0' }} />
                        <ProductDescription dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }} />

                        <PriceRow>
                            <Price>AED {product.price}</Price>
                            {product.stock === 0 ? (
                              <span style={{ color: 'red', fontWeight: 600, fontSize: '1.13rem', marginTop: 18 }}>
                                Out of Stock
                              </span>
                            ) : (
                              <StyledButton onClick={() => addProduct(product._id)} primary={1} outline={1} style={{
                                minWidth: 180,
                                fontSize: '1.13rem',
                                fontWeight: 700,
                                background: 'linear-gradient(90deg, #ff9900 0%, #ff4500 100%)',
                                color: '#fff',
                                border: 'none',
                                boxShadow: '0 2px 8px rgba(255,153,0,0.10)',
                                marginTop: 18,
                              }}>
                                <CartIcon />
                                Add to Cart
                              </StyledButton>
                            )}
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
