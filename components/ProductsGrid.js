import styled from "styled-components";
import ProductBox from "@/components/ProductBox";
import { motion } from "framer-motion";

const StyledProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
  @media (min-width: 480px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }
  @media (min-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  }
  @media (min-width: 600px) and (max-width: 899px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  @media screen and (max-width: 600px){
    gap: 16px;
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