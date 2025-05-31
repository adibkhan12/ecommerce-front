import React from "react";
import styled from "styled-components";
import Title from "./Title";
import Link from "next/link";

const BrandList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  list-style: none;
  padding: 0;
`;

const BrandItem = styled.li`
  background: #f5f5f5;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #e0e0e0;
  }
`;

// TODO: Replace with API fetch
const mockBrands = ["Apple", "Samsung", "Dell", "HP", "Lenovo", "Asus", "Sony", "Microsoft"];

const ShopByBrand = () => {
  return (
    <section style={{ margin: "40px 0" }}>
      <Title>Shop by Brand</Title>
      <BrandList>
        {mockBrands.map((brand) => (
          <Link key={brand} href={`/brand/${encodeURIComponent(brand)}`} passHref legacyBehavior>
            <BrandItem as="a">{brand}</BrandItem>
          </Link>
        ))}
      </BrandList>
    </section>
  );
};

export default ShopByBrand;
