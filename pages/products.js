import Header from "@/components/Header";
import Center from "@/components/Center";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import styled from "styled-components";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {WishedProduct} from "@/models/WishedProduct";

const PageWrapper = styled.div`
  padding: 20px;
  background-color: #f9f9f9; 
  min-height: 100vh;
`;

const ProductsSection = styled.section`
  margin: 40px 0;
`;

export default function ProductPage({ products, wishedProducts }) {
    return (
        <>
            <Header />
            <PageWrapper>
                <Center>
                    <ProductsSection>
                        <Title>All Products</Title>
                        <ProductsGrid products={products} wishedProducts={wishedProducts} />
                    </ProductsSection>
                </Center>
            </PageWrapper>
        </>
    );
}

export async function getServerSideProps(ctx) {
    await mongooseConnect();
    const products = await Product.find({}, null, { sort: { _id: -1 } });
    const session = await getServerSession(ctx.req, ctx.res, authOptions);
    const userEmail = session?.user?.email || null;

    let wishedProducts = [];
    if (userEmail) {
        wishedProducts = await WishedProduct.find({
            userEmail,
            product: products.map(p => p._id.toString()),
        });
    }
    return {
        props: {
            products: JSON.parse(JSON.stringify(products)),
            wishedProducts: wishedProducts.map(i => i.product.toString()),
        },
    };
}
