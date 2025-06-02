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

export default function ProductsGrid({ products, wishedProducts }) {
  const safeWishedProducts = Array.isArray(wishedProducts) ? wishedProducts : [];
  return (
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
          />
        </motion.div>
      ))}
    </StyledProductsGrid>
  );
}