import Header from "@/components/Header";
import Center from "@/components/Center";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import styled from "styled-components";

const PageWrapper = styled.div`
  padding: 20px;
  background-color: #f9f9f9; /* Match the categories.js background */
  min-height: 100vh;
`;

const ProductsSection = styled.section`
  margin: 40px 0;
`;

export default function ProductPage({ products }) {
    return (
        <>
            <Header />
            <PageWrapper>
                <Center>
                    <ProductsSection>
                        <Title>All Products</Title>
                        <ProductsGrid products={products} />
                    </ProductsSection>
                </Center>
            </PageWrapper>
        </>
    );
}

export async function getServerSideProps() {
    await mongooseConnect();
    const products = await Product.find({}, null, { sort: { _id: -1 } });
    return {
        props: {
            products: JSON.parse(JSON.stringify(products)),
        },
    };
}
