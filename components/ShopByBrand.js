import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Title from "./Title";
import Link from "next/link";

const BrandSection = styled.section`
  margin: 40px 0;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(44,62,80,0.07);
  padding: 32px 18px 24px 18px;
  @media (max-width: 600px) {
    padding: 18px 4px 14px 4px;
    margin: 24px 0;
  }
`;

const BrandList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px 18px;
  list-style: none;
  padding: 0;
  margin: 0 auto;
  max-width: 900px;
`;

const BrandItem = styled.li`
  background: linear-gradient(90deg, #f8fafc 60%, #e0e7ef 100%);
  border-radius: 10px;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 1.12rem;
  color: #222;
  cursor: pointer;
  box-shadow: 0 1px 6px rgba(44,62,80,0.06);
  border: 1px solid #f0f0f0;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  text-decoration: none;
  font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
  letter-spacing: 0.5px;
  &:hover {
    background: #fffae6;
    color: #ff9900;
    box-shadow: 0 2px 12px rgba(255,153,0,0.10);
    text-decoration: none;
  }
  @media (max-width: 600px) {
    padding: 10px 16px;
    font-size: 1.02rem;
  }
`;

const ShopByBrand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBrands() {
      try {
        // Fetch all products
        const res = await fetch("/api/products");
        const products = await res.json();
        // Filter products in the 'Mobile' category (case-insensitive)
        // and extract unique Brand values from their properties
        const brandSet = new Set();
        products.forEach(product => {
          // Check if product.properties and product.properties.Brand exist
          if (product.properties && product.properties.Brand) {
            brandSet.add(product.properties.Brand);
          }
        });
        setBrands(Array.from(brandSet));
      } catch (err) {
        setError("Failed to load brands");
      } finally {
        setLoading(false);
      }
    }
    fetchBrands();
  }, []);

  return (
    <BrandSection>
      <Title>Shop by Brand</Title>
      {loading ? (
        <div style={{ color: '#888', fontSize: '1.1rem', textAlign: 'center', margin: '18px 0' }}>Loading brands...</div>
      ) : error ? (
        <div style={{ color: 'red', fontSize: '1.1rem', textAlign: 'center', margin: '18px 0' }}>{error}</div>
      ) : brands.length === 0 ? (
        <div style={{ color: '#888', fontSize: '1.1rem', textAlign: 'center', margin: '18px 0' }}>No brands found.</div>
      ) : (
        <BrandList>
          {brands.map((brand) => (
            <Link key={brand} href={`/brand/${encodeURIComponent(brand)}`} passHref legacyBehavior>
              <BrandItem as="a">{brand}</BrandItem>
            </Link>
          ))}
        </BrandList>
      )}
    </BrandSection>
  );
};

export default ShopByBrand;
