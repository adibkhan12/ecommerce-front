import React from "react";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import styled from "styled-components";
import Center from "@/components/Center";

const BrandWrapper = styled.section`
  margin: 40px 0;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(44,62,80,0.07);
  padding: 32px 18px 24px 18px;
  width: 100%;
  box-sizing: border-box;
  @media (max-width: 600px) {
    padding: 18px 4px 14px 4px;
    margin: 24px 0;
  }
`;

const BrandTitle = styled.h2`
  font-size: 2.1rem;
  font-weight: 800;
  color: #222;
  margin-bottom: 28px;
  letter-spacing: 0.5px;
`;

export default function BrandPage({ brand, products }) {
  return (
    <>
      <Header />
      <Center>
        <BrandWrapper>
          <BrandTitle>Products by {brand}</BrandTitle>
          <ProductsGrid products={products} />
        </BrandWrapper>
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { brand } = context.query;
  // Find all products with the given brand (case-insensitive) in properties.Brand
  const products = await Product.find({ ["properties.Brand"]: { $regex: `^${brand}$`, $options: "i" } });
  return {
    props: {
      brand,
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
