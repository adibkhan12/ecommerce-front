import Center from "@/components/Center";
import ProductsGrid from "@/components/ProductsGrid";
import Link from "next/link";
import styled from "styled-components";

const Section = styled.section`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 32px rgba(44,62,80,0.10);
  padding: 44px 0 32px 0;
  margin: 44px 0 32px 0;
  @media (max-width: 600px) {
    padding: 18px 0 12px 0;
    margin: 18px 0 12px 0;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
`;

const Title = styled.h2`
  font-size: 2.1rem;
  font-weight: 800;
  color: #222;
  margin: 0;
  letter-spacing: 0.5px;
`;

const ShowAllLink = styled(Link)`
  background: linear-gradient(90deg, #ff9900 60%, #ffb84d 100%);
  color: #fff;
  font-weight: 700;
  padding: 10px 28px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 1.05rem;
  box-shadow: 0 2px 12px rgba(255,153,0,0.10);
  transition: background 0.2s, color 0.2s, transform 0.15s;
  &:hover {
    background: #ffb84d;
    color: #222;
    transform: translateY(-2px) scale(1.04);
  }
`;

export default function CategorySection({ _id, name, products, wishedProducts = [] }) {
  return (
    <Section>
      <Center>
        <TitleRow>
          <Title>{name}</Title>
          <ShowAllLink href={`/category/${_id}`}>Show All</ShowAllLink>
        </TitleRow>
        <ProductsGrid products={products} wishedProducts={wishedProducts} />
      </Center>
    </Section>
  );
}