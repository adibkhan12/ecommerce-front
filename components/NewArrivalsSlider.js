import React, { useState } from "react";
import styled from "styled-components";
import ProductBox from "@/components/ProductBox";

const SliderWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  margin-bottom: 18px;
`;

const SliderTrack = styled.div`
  display: flex;
  width: 100%;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  border: 1px solid #eee;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #222;
  box-shadow: 0 2px 8px rgba(44,62,80,0.10);
  cursor: pointer;
  z-index: 2;
  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

// Arrows will be moved to the header in the parent component

const Slide = styled.div`
  flex: 0 0 50%;
  max-width: 50%;
  box-sizing: border-box;
  padding: 0 4px;
`;

export default function NewArrivalsSlider({ products, wishedProducts, index }) {
  const safeWishedProducts = Array.isArray(wishedProducts) ? wishedProducts : [];
  // Only show two products at a time
  const visibleProducts = products.slice(index, index + 2);

  return (
    <SliderWrapper>
      <SliderTrack>
        {visibleProducts.map((product) => (
          <Slide key={product._id}>
            <ProductBox {...product}
              stock={product.stock}
              wished={safeWishedProducts.includes(product._id)}
            />
          </Slide>
        ))}
      </SliderTrack>
    </SliderWrapper>
  );
}
