import Header from "@/components/Header";
import Center from "@/components/Center";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";
import dynamic from "next/dynamic";
const ProductsGrid = dynamic(() => import("@/components/ProductsGrid"), { ssr: false });
import Title from "@/components/Title";
import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomSelect from "@/components/CustomSelect";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {WishedProduct} from "@/models/WishedProduct";

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
`;

const ProductsSection = styled.section`
  margin: 40px 0;
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
  @media (max-width: 900px) {
    max-width: 100vw;
    padding: 0 4px;
  }
`;

const FilterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 24px;
`;
const Filter = styled.div`
  background-color: #f1f1f1;
  padding: 8px 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, box-shadow 0.3s;
  select {
    background-color: transparent;
    border: none;
    font-size: 1rem;
    color: #555;
    outline: none;
    cursor: pointer;
    &:hover { color: #333; }
  }
  span { font-weight: bold; color: #4caf50; }
`;

export default function ProductPage({ products: originalProducts, wishedProducts }) {
  const [products, setProducts] = useState(originalProducts);
  const [brands, setBrands] = useState([]);
  const [brand, setBrand] = useState('all');
  const [sort, setSort] = useState('price_asc');

  useEffect(() => {
    // Fetch unique brands from products
    const uniqueBrands = Array.from(new Set(originalProducts.map(p => p.properties?.Brand).filter(Boolean)));
    setBrands(uniqueBrands);
  }, [originalProducts]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (brand !== 'all') params.set('Brand', brand);
    params.set('sort', sort);
    axios.get('/api/products?' + params.toString()).then(res => setProducts(res.data));
  }, [brand, sort]);

  return (
    <>
      <Header />
      <PageWrapper>
        <Center>
          <ProductsSection>
            <Title>All Products</Title>
            <FilterWrapper>
              <Filter>
                <span>Brand:</span>
                <CustomSelect value={brand} onChange={e => setBrand(e.target.value)}>
                  <option value="all">All</option>
                  {brands.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </CustomSelect>
              </Filter>
              <Filter>
                <span>Sorting:</span>
                <CustomSelect value={sort} onChange={e => setSort(e.target.value)}>
                  <option value="price_asc">Price, Lowest First</option>
                  <option value="price_desc">Price, Highest First</option>
                  <option value="name_asc">Name, A-Z</option>
                  <option value="name_desc">Name, Z-A</option>
                  <option value="newest">Newest</option>
                </CustomSelect>
              </Filter>
            </FilterWrapper>
            {products && products.length > 0 ? (
              <ProductsGrid products={products} wishedProducts={wishedProducts} enableCompare={true} />
            ) : (
              <div>No products available at the moment.</div>
            )}
          </ProductsSection>
        </Center>
      </PageWrapper>
    </>
  );
}

export async function getServerSideProps(ctx) {
    await mongooseConnect();
    const products = await Product.find({}, null, { sort: { _id: -1 } });
    const session = await getServerSession(ctx.req, ctx.res, authOptions);
    const userEmail = session?.user?.email || null;

    let wishedProducts = [];
    if (userEmail) {
        wishedProducts = await WishedProduct.find({
            userEmail,
            product: products.map(p => p._id.toString()),
        });
    }
    return {
        props: {
            products: JSON.parse(JSON.stringify(products)),
            wishedProducts: wishedProducts.map(i => i.product.toString()),
        },
    };
}
