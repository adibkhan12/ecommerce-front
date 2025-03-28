import Header from "@/components/Header";
import Center from "@/components/Center";
import { Category } from "@/models/Category";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";
import ProductWhiteBox from "@/components/ProductBox";
import styled from "styled-components";
import Link from "next/link";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {WishedProduct} from "@/models/WishedProduct";
import {RevealWrapper} from "next-reveal";

// Styled Components
const CategoryWrapper = styled.div`
    margin-bottom: 20px;
    margin-top: 20px;
    padding: 20px;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const CategoryTitle = styled.h2`
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
    background: linear-gradient(to right, #4caf50, #81c784);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const ProductsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    @media screen and (min-width: 768px) {
        grid-template-columns: repeat(4, 1fr);
    }
`;

const ShowAllLinkWrapper = styled.div`
    margin: 20px auto 10px;
    text-align: center;
`;

const ShowAllLink = styled(Link)`
    font-size: 0.9rem;
    color: #fff;
    text-decoration: none;
    background-color: #4caf50;
    padding: 10px 15px;
    border-radius: 5px;
    font-weight: bold;
    display: inline-block;
    transition: background-color 0.3s;

    &:hover {
        background-color: #388e3c;
    }
`;

const StyledProductWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const ShowAllSquare = styled(Link)`
    background-color: #f1f1f1; /* Neutral background to distinguish from product cards */
    max-height: 160px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    color: #4caf50; /* Matches the category title gradient for harmony */
    font-weight: bold;
    text-decoration: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
        background-color: #4caf50; /* Highlight the square on hover */
        color: #fff; /* White text on hover for contrast */
        transform: scale(1.05); /* Slight zoom for interactivity */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    &:active {
        transform: scale(0.98); /* Slight press effect */
    }

    @media screen and (min-width: 768px) {
        font-size: 1.2rem; /* Slightly larger text for wider screens */
    }
`;


// Main Component
export default function CategoriesPage({ mainCategories, categoriesProducts, wishedProducts=[] }) {
    return (
        <>
            <Header />
            <Center>
                {mainCategories.map((cat) => (
                    <CategoryWrapper key={cat._id}>
                        <CategoryTitle>{cat.name}</CategoryTitle>
                        <ShowAllLinkWrapper>
                            <ShowAllLink href={`/category/${cat._id}`}>
                                Show All
                            </ShowAllLink>
                        </ShowAllLinkWrapper>
                        <ProductsGrid>
                            {categoriesProducts[cat._id]?.map((p,index) => (
                                <RevealWrapper key={p._id} delay={index*50}>
                                    <StyledProductWrapper key={p._id}>
                                        <ProductWhiteBox {...p} wished={wishedProducts.includes(p._id)} />
                                    </StyledProductWrapper>
                                </RevealWrapper>
                            ))}
                            <RevealWrapper origin={'right'} delay={categoriesProducts[cat._id].length*50}>
                                <ShowAllSquare href={'/category/'+cat._id}>
                                    Show All Products &rarr;
                                </ShowAllSquare>
                            </RevealWrapper>
                        </ProductsGrid>
                    </CategoryWrapper>
                ))}
            </Center>
        </>
    );
}

export async function getServerSideProps(ctx) {
    await mongooseConnect();
    const categories = await Category.find();
    const mainCategories = categories.filter((c) => !c.parent);
    const categoriesProducts = {};
    const allFetchedProductsId = [];

    for (const mainCat of mainCategories) {
        const mainCatId = mainCat._id.toString();
        const childCatIds = categories
            .filter((c) => c?.parent?.toString() === mainCatId)
            .map((c) => c._id.toString());
        const categoriesIds = [mainCatId, ...childCatIds];
        const products = await Product.find(
            { category: categoriesIds },
            null,
            { limit: 3, sort: { _id: -1 } }
        );
        allFetchedProductsId.push(...products.map(p => p._id.toString()));
        categoriesProducts[mainCat._id] = products;
    }
    const session = await getServerSession(ctx.req, ctx.res, authOptions);
    const userEmail = session?.user?.email || null;

    let wishedProducts = [];
    if (userEmail) {
        wishedProducts = await WishedProduct.find({
            userEmail,
            product: allFetchedProductsId,
        });
    }

    return {
        props: {
            mainCategories: JSON.parse(JSON.stringify(mainCategories)),
            categoriesProducts: JSON.parse(JSON.stringify(categoriesProducts)),
            wishedProducts: wishedProducts.map(i =>i.product.toString()),
        },
    };
}
