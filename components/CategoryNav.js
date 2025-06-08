import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import axios from "axios";

// Map category names to public SVG icon URLs
const categoryIcons = {
  Mobiles: "https://api.iconify.design/mdi:cellphone.svg",
  Laptops: "https://api.iconify.design/mdi:laptop.svg",
  Tablets: "https://api.iconify.design/mdi:tablet.svg",
  Accessories: "https://api.iconify.design/mdi:headphones.svg",
};

const NavWrapper = styled.nav`
  width: 100vw;
  margin-left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 28px 0 18px 0;
  box-shadow: 0 2px 12px rgba(44,62,80,0.06);
  overflow-x: auto;
  @media (max-width: 768px) {
    padding: 18px 0 10px 0;
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
  animation: float-bounce 4.5s cubic-bezier(.4,1.3,.6,1) infinite;
  @keyframes float-bounce {
    0% { transform: translateY(0); }
    12% { transform: translateY(-4px) scale(1.04); }
    24% { transform: translateY(0); }
    36% { transform: translateY(2px) scale(0.98); }
    48% { transform: translateY(0); }
    100% { transform: translateY(0); }
  }
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
`;

const CategoryName = styled.span`
  display: block;
  font-weight: 600;
  font-size: 1.05rem;
  opacity: 0;
  animation: fade-slide-in 0.9s cubic-bezier(.4,1.3,.6,1) forwards;
  animation-delay: 0.3s;
  @keyframes fade-slide-in {
    0% { opacity: 0; transform: translateY(12px); }
    100% { opacity: 1; transform: translateY(0); }
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
            <CategoryLink href={`/category/${cat._id}`}>
              <CategoryIcon src={categoryIcons[cat.name] || "https://api.iconify.design/mdi:apps.svg"} alt={cat.name} />
              <CategoryName>{cat.name}</CategoryName>
            </CategoryLink>
          </CategoryItem>
        ))}
      </CategoryList>
    </NavWrapper>
  );
}
