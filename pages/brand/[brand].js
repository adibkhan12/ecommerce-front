import React from "react";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";

export default function BrandPage({ brand, products }) {
  return (
    <>
      <Header />
      <div style={{ maxWidth: 1200, margin: "40px auto" }}>
        <Title>Products by {brand}</Title>
        <ProductsGrid products={products} />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { brand } = context.query;
  // Find all products with the given brand (case-insensitive)
  const products = await Product.find({ brand: { $regex: `^${brand}$`, $options: "i" } });
  return {
    props: {
      brand,
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
