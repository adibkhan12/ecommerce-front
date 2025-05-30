import styled from "styled-components";
import ProductBox from "@/components/ProductBox";
import { motion } from "framer-motion";
// import {RevealWrapper} from "next-reveal";

const StyledProductsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    @media screen and (min-width: 768px){
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
`;

export default function ProductsGrid({products, wishedProducts = []}) {
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
                        wished={wishedProducts?.includes(product._id)}
                    />
                </motion.div>
            ))}
        </StyledProductsGrid>
    );
}
