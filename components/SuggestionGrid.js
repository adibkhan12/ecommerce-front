import styled from "styled-components";
import ProductsGrid from "@/components/ProductsGrid";

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 900px;
`;

export default function SuggestionGrid({ products }) {
  if (!products || products.length === 0) return null;
  return (
    <Wrapper>
      <ProductsGrid products={products} />
    </Wrapper>
  );
}
