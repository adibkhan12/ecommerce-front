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

// Removed unused ArrowButton styled component

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
