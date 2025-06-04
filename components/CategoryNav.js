import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import axios from "axios";

// Map category names to icons (add more as needed)
const categoryIcons = {
  Mobiles: "/icons/mobile.svg",
  Laptops: "/icons/laptop.svg",
  Tablets: "/icons/tablet.svg",
  Accessories: "/icons/accessories.svg",
  Wearables: "/icons/watch.svg",
  Audio: "/icons/audio.svg"
};

const NavWrapper = styled.nav`
  width: 100vw;
  margin-left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 18px 0 10px 0;
  box-shadow: 0 2px 12px rgba(44,62,80,0.06);
  overflow-x: auto;
  @media (max-width: 768px) {
    padding: 10px 0 6px 0;
  }
`;

const CategoryList = styled.ul`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 28px;
  list-style: none;
  padding: 0 18px;
  margin: 0;
  overflow-x: auto;
  @media (max-width: 768px) {
    gap: 16px;
    padding: 0 8px;
  }
`;

const CategoryItem = styled.li`
  text-align: center;
`;

const CategoryLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #222;
  font-weight: 600;
  font-size: 1.05rem;
  transition: color 0.2s;
  &:hover {
    color: #ff9900;
  }
`;

const CategoryIcon = styled.img`
  width: 38px;
  height: 38px;
  margin-bottom: 6px;
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
`;

export default function CategoryNav() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios.get('/api/categories').then(res => setCategories(res.data));
  }, []);
  return (
    <NavWrapper>
      <CategoryList>
        {categories.map(cat => (
          <CategoryItem key={cat._id}>
            <CategoryLink href={`/category/${encodeURIComponent(cat.name.toLowerCase())}`}>
              <CategoryIcon src={categoryIcons[cat.name] || "/icons/category.svg"} alt={cat.name} />
              {cat.name}
            </CategoryLink>
          </CategoryItem>
        ))}
      </CategoryList>
    </NavWrapper>
  );
}
