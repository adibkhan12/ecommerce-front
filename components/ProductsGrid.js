import styled from "styled-components";
import ProductBox from "@/components/ProductBox";
import { motion } from "framer-motion";

const StyledProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  @media (min-width: 768px) and (max-width: 1023px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
    gap: 28px;
  }
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const CompareModal = dynamic(() => import("@/components/CompareModal"), { ssr: false });
import axios from "axios";

export default function ProductsGrid({ products, wishedProducts, enableCompare }) {
  const safeWishedProducts = Array.isArray(wishedProducts) ? wishedProducts : [];
  const [compareIds, setCompareIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reviewsByProduct, setReviewsByProduct] = useState({});

  useEffect(() => {
    if (!products?.length) return;
    const ids = products.map(p => p._id).join(',');
    axios.get(`/api/reviews?products=${ids}`).then(res => {
      setReviewsByProduct(res.data || {});
    });
  }, [products]);

  function handleCompareChange(productId, checked) {
    setCompareIds(prev => {
      if (checked) {
        if (prev.length >= 4) return prev; // Max 4
        return [...prev, productId];
      } else {
        return prev.filter(id => id !== productId);
      }
    });
  }

  const selectedProducts = products.filter(p => compareIds.includes(p._id));

  return (
    <>
      <StyledProductsGrid>
        {products?.length > 0 && products.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, duration: 0.5 }}
          >
            <ProductBox {...product}
              stock={product.stock}
              wished={safeWishedProducts.includes(product._id)}
              compareEnabled={enableCompare}
              compareChecked={compareIds.includes(product._id)}
              onCompareChange={checked => handleCompareChange(product._id, checked)}
              reviews={reviewsByProduct[product._id] || []}
            />
          </motion.div>
        ))}
      </StyledProductsGrid>
      {enableCompare && compareIds.length >= 2 && (
        <button
          style={{
            position: 'fixed',
            bottom: 110,
            right: 25,
            zIndex: 10001,
            background: '#ff9900',
            color: '#fff',
            border: 'none',
            borderRadius: 24,
            padding: '14px 32px',
            fontSize: '1.2rem',
            fontWeight: 700,
            boxShadow: '0 4px 16px rgba(44,62,80,0.18)',
            cursor: 'pointer',
          }}
          onClick={() => setShowModal(true)}
        >
          Compare ({compareIds.length})
        </button>
      )}
      {showModal && (
        <CompareModal products={selectedProducts} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}