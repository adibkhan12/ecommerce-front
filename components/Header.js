
import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import { useContext, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { CartContext } from "@/components/CartContext";
import BarsIcon from "@/components/icons/Bars";
import SearchIcon from "@/components/icons/SearchIcons";

const StyledHeader = styled.header`
    background-color: #111;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 10;
    padding: 10px 0;
`;

const Logo = styled(Link)`
    color: #fff;
    text-decoration: none;
    font-size: 1.6rem;
    font-weight: 700;
    position: relative;
    z-index: 3;
    &:hover {
        color: #ff9900;
        transition: color 0.2s ease;
    }
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
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
    transition: all 0.3s ease;
    transform: ${({ $mobileNavActive }) =>
            $mobileNavActive ? "translateX(0)" : "translateX(100%)"};
    box-shadow: ${({ $mobileNavActive }) => 
            $mobileNavActive ? "-5px 0 15px rgba(0,0,0,0.2)" : "none"};

    @media screen and (min-width: 768px) {
        display: flex;
        position: static;
        width: auto;
        height: auto;
        padding: 0;
        transform: translateX(0);
        background-color: transparent;
        box-shadow: none;
    }
`;

const NavLink = styled(Link)`
    display: block;
    color: #eee;
    text-decoration: none;
    font-size: 1.1rem;
    padding: 12px 0;
    transition: color 0.3s ease;
    font-weight: 500;

    svg{
        height: 20px;
    }
    &:hover {
        color: #ff9900;
    }

    @media screen and (min-width: 768px) {
        padding: 0;
        margin: 0 15px;
    }
`;

const NavButtonLink = styled.button`
    display: block;
    background: #e0e0e0;
    border: none;
    color: #222;
    font-size: 1rem;
    padding: 10px 22px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    margin-top: 15px;
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        background: #d0d0d0;
        color: #000;
        transform: translateY(-1px);
        box-shadow: 0 3px 6px rgba(0,0,0,0.12);
    }

    &:active:not(:disabled) {
        transform: translateY(1px);
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    @media screen and (min-width: 768px) {
        margin: 0 10px;
        padding: 8px 18px;
        display: inline-block;
    }
`;

const NavButton = styled.button`
    width: 44px;
    height: 44px;
    background-color: transparent;
    color: #fff;
    cursor: pointer;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    margin-left: 10px;
    position: relative;
    z-index: 10;
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.1);
    }

    &:active {
        transform: scale(0.95);
    }

    svg {
        stroke: white;
        width: 26px;
        height: 26px;
    }

    @media screen and (min-width: 768px) {
        display: none;
    }
`;

const CartBadge = styled.span`
    background-color: #ff9900;
    color: #fff;
    font-size: 0.8rem;
    font-weight: bold;
    padding: 3px 8px;
    border-radius: 12px;
    margin-left: 5px;
    vertical-align: middle;
    display: inline-block;
    min-width: 20px;
    text-align: center;
    line-height: 1;
`;

const SideIcons = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;

    a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 24px;
        color: white;
        transition: transform 0.2s ease;
        
        &:hover {
            transform: scale(1.1);
            color: #ff9900;
        }

        svg {
            width: 22px;
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

    // Auth
    const { data: session, status } = useSession();
    const router = useRouter();

    // Handlers
    function handleSignIn() {
        router.push("/signin");
        setMobileNavActive(false);
    }

    async function handleSignOut() {
        try {
            await signOut({ callbackUrl: process.env.NEXT_PUBLIC_URL });
            setMobileNavActive(false);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

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
                            Cart {cartItemCount > 0 && <CartBadge>{cartItemCount}</CartBadge>}
                        </NavLink>
                        {/* Auth options in nav as grey button */}
                        {status === "loading" ? (
                            <NavButtonLink disabled>Loading...</NavButtonLink>
                        ) : !session ? (
                            <NavButtonLink onClick={handleSignIn}>
                                Sign in
                            </NavButtonLink>
                        ) : (
                            <NavButtonLink onClick={handleSignOut}>
                                Sign out
                            </NavButtonLink>
                        )}
                    </StyledNav>
                    <SideIcons>
                        <Link href={'/search'} aria-label="Search"><SearchIcon/></Link>
                        <NavButton 
                            onClick={() => setMobileNavActive((prev) => !prev)}
                            aria-label={mobileNavActive ? "Close menu" : "Open menu"}
                        >
                            <BarsIcon />
                        </NavButton>
                    </SideIcons>
                </Wrapper>
            </Center>
        </StyledHeader>
    );
}
