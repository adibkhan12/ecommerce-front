import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import { useContext, useState } from "react";
import { CartContext } from "@/components/CartContext";
import BarsIcon from "@/components/icons/Bars";
import SearchIcon from "@/components/icons/SearchIcons";

const StyledHeader = styled.header`
    background-color: #111;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 10;
`;

const Logo = styled(Link)`
    color: #fff;
    text-decoration: none;
    font-size: 1.5rem;
    font-weight: bold;
    position: relative;
    z-index: 3;
    &:hover {
        color: #ff9900; /* Amazon-like hover color */
    }
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    max-width: 1200px;
    margin: 0 auto;
`;

const StyledNav = styled.nav`
    display: ${({ $mobileNavActive }) => ($mobileNavActive ? "block" : "none")};
    gap: 20px;
    position: fixed;
    top: 0;
    right: 0;
    width: 70%;
    height: 100%;
    background-color: #111;
    padding: 80px 20px 20px;
    transition: transform 0.3s ease;
    transform: ${({ $mobileNavActive }) =>
            $mobileNavActive ? "translateX(0)" : "translateX(100%)"};

    @media screen and (min-width: 768px) {
        display: flex;
        position: static;
        width: auto;
        height: auto;
        padding: 0;
        transform: translateX(0);
        background-color: transparent;
    }
`;

const NavLink = styled(Link)`
    display: block;
    color: #ddd;
    text-decoration: none;
    font-size: 1rem;
    padding: 10px 0;
    transition: color 0.3s ease;

    svg{
        height: 20px;
    }
    &:hover {
        color: #ff9900; /* Amazon-like hover color */
    }

    @media screen and (min-width: 768px) {
        padding: 0;
        margin: 0 10px;
    }
`;

const NavButton = styled.button`
    width: 40px;
    height: 40px;
    background-color: transparent;
    color: #fff;
    cursor: pointer;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    margin-left: 10px; /* Add spacing between search icon & hamburger */

    position: relative; /* Changed from fixed to relative to avoid overlap */
    z-index: 10; /* Lowered from 10001 to prevent unintended overlaps */

    svg {
        stroke: white;
        width: 26px; /* Standardized width */
        height: 26px;
    }

    @media screen and (min-width: 768px) {
        display: none;
    }
`;

const CartBadge = styled.span`
    background-color: #ff9900; /* Highlight color */
    color: #fff;
    font-size: 0.8rem; /* Slightly larger for better readability */
    font-weight: bold;
    padding: 3px 8px; /* More padding for a rounded, pill-like look */
    border-radius: 12px; /* Pill shape */
    margin-left: 5px;
    vertical-align: middle;
    display: inline-block;
    min-width: 20px; /* Ensures consistent size for single-digit and multi-digit numbers */
    text-align: center;
    line-height: 1;
`;

const SideIcons = styled.div`
    display: flex;
    align-items: center;
    gap: 20px; /* Increased spacing to avoid overlap */

    a {
        display: inline-block;
        min-width: 24px;
        color: white;

        svg {
            padding-top: 3px;
            width: 22px; /* Standardized width */
            height: 22px;
        }
    }
`;

export default function Header() {
    const { cart } = useContext(CartContext);
    const cartItemCount =
        cart && cart.items
            ? cart.items.reduce((total, item) => total + item.quantity, 0)
            : 0;
    const [mobileNavActive, setMobileNavActive] = useState(false);

    return (
        <StyledHeader>
            <Center>
                <Wrapper>
                    <Logo href="/">Shahzad Arshad Elec</Logo>
                    <StyledNav $mobileNavActive={mobileNavActive}>
                        <NavLink href="/">Home</NavLink>
                        <NavLink href="/products">All Products</NavLink>
                        <NavLink href="/categories">Categories</NavLink>
                        <NavLink href="/account">Account</NavLink>
                        <NavLink href="/cart">
                            Cart <CartBadge>{cartItemCount}</CartBadge>
                        </NavLink>
                    </StyledNav>
                    <SideIcons>
                        <Link href={'/search'} className="size-6"><SearchIcon/></Link>
                        <NavButton onClick={() => setMobileNavActive((prev) => !prev)}>
                            <BarsIcon />
                        </NavButton>
                    </SideIcons>
                </Wrapper>
            </Center>
        </StyledHeader>
    );
}
