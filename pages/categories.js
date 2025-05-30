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
import { motion } from "framer-motion";
// import {RevealWrapper} from "next-reveal";

// Styled Components
const PageBackground = styled.div`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  width: 100%;
  padding: 0 0 40px 0;
`;

const CategoryWrapper = styled.section`
    margin: 14px auto;
    padding: 12px 4px 18px 4px;
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 2px 12px rgba(44,62,80,0.07);
    max-width: 100vw;
    width: 100%;
    @media (min-width: 600px) {
        padding: 20px 10px 24px 10px;
        max-width: 700px;
    }
    @media (min-width: 1024px) {
        max-width: 1200px;
        padding: 32px 24px 32px 24px;
    }
`;

const CategoryTitle = styled.h2`
    font-size: 1.2rem;
    color: #222;
    margin-bottom: 14px;
    text-align: center;
    font-weight: 800;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    line-height: 1.2;
    
    &::before {
        content: "📂";
        font-size: 1.1rem;
        margin-right: 6px;
    }
    @media (min-width: 600px) {
        font-size: 1.5rem;
        gap: 12px;
        &::before { font-size: 1.3rem; }
    }
    @media (min-width: 1024px) {
        font-size: 2.1rem;
    }
`;

const ProductsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
    @media (min-width: 500px) {
        grid-template-columns: 1fr 1fr;
        gap: 18px;
    }
    @media (min-width: 900px) {
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
    }
`;

const ShowAllLinkWrapper = styled.div`
    margin: 20px auto 10px;
    text-align: center;
`;

const ShowAllLink = styled(Link)`
    font-size: 1rem;
    color: #fff;
    text-decoration: none;
    background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
    padding: 12px 22px;
    border-radius: 8px;
    font-weight: 700;
    display: inline-block;
    box-shadow: 0 2px 8px rgba(44,62,80,0.08);
    margin-bottom: 8px;
    letter-spacing: 0.5px;
    transition: background 0.3s, transform 0.2s;

    &:hover {
        background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
        transform: translateY(-2px) scale(1.04);
    }
`;

const StyledProductWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    @media (max-width: 500px) {
        padding: 0 2px;
    }
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
        <PageBackground>
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
                                <motion.div
                                    key={p._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.07, duration: 0.5 }}
                                >
                                    <StyledProductWrapper>
                                        <ProductWhiteBox {...p} wished={wishedProducts.includes(p._id)} />
                                    </StyledProductWrapper>
                                </motion.div>
                            ))}
                        </ProductsGrid>
                    </CategoryWrapper>
                ))}
            </Center>
        </PageBackground>
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
            { limit: 4, sort: { _id: -1 } }
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
