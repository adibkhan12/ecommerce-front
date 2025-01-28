import Center from "@/components/Center";
import styled from "styled-components";
import Button from "@/components/Button";
import ButtonLink from "@/components/ButtonLink";
import CartIcon from "@/components/icons/CartIcon";
import {useContext} from "react";
import {CartContext} from "@/components/CartContext";

const Bg = styled.div`
    background-color: #1a1a1a; /* Slightly lighter shade for better contrast */
    color: #f5f5f5;
    padding: 30px 15px; /* Add padding for spacing */
`;

const Title = styled.h1`
    margin: 0;
    font-weight: bold;
    font-size: 2rem;
    color: #ffffff;
    text-transform: capitalize; /* Capitalize the first letter of each word */
    @media screen and (min-width: 768px) {
        font-size: 3.5rem;
    }
`;

const Desc = styled.p`
    color: #cccccc; /* Slightly brighter text for readability */
    font-size: 1rem;
    margin-top: 10px;
    line-height: 1.5;
`;

const ButtonWrapper = styled.div`
    display: flex;
    gap: 15px;
    margin-top: 30px;
    flex-wrap: wrap; /* Ensure buttons wrap on smaller screens */
`;

const ColumnWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 50px;
    margin-top: 20px;

    img {
        max-width: 100%;
        max-height: 250px;
        object-fit: cover; /* Ensure consistent scaling */
        border-radius: 8px; /* Add rounded corners to the image */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Add subtle shadow for depth */
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
    text-align: center; /* Center text alignment for smaller screens */

    @media screen and (min-width: 768px) {
        align-items: flex-start; /* Left-align content on larger screens */
        text-align: left;
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



export default function Featured({product}){
    const {addProduct}=useContext(CartContext)
    function addFeaturedToCart(){
        addProduct(product._id);
    }
    return (
        <Bg>
            <Center>
                <ColumnWrapper>
                    <Column>
                        <div>
                            <Title>{product.title}</Title>
                            <Desc>
                                <TruncatedDesc text={product.description} maxWords={30} productId={product._id} />
                            </Desc>
                            <ButtonWrapper>
                                <ButtonLink href = {'/product/'+product._id} outline={1} white={1}>Read More</ButtonLink>
                                <Button white="true" onClick={addFeaturedToCart}>
                                    <CartIcon />
                                    Add to Cart
                                </Button>
                            </ButtonWrapper>
                        </div>
                    </Column>
                    <ImgColumn>
                        <img src={product.images?.[0]} alt={product.title}/>
                    </ImgColumn>
                </ColumnWrapper>
            </Center>
        </Bg>
    )
}