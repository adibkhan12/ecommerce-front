
import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import { useContext, useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { CartContext } from "@/components/CartContext";
import BarsIcon from "@/components/icons/Bars";
import SearchIcon from "@/components/icons/SearchIcons";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { debounce } from "lodash";

const StyledHeader = styled.header`
    background-color: #111;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 9999;
    padding: 10px 0;
`;

const Logo = styled(Link)`
    color: #fff;
    text-decoration: none;
    font-size: 1.6rem;
    font-weight: 700;
    position: relative;
    z-index: 3;
    transition: opacity 0.3s;
    opacity: ${({ $searchActive }) => ($searchActive ? 0 : 1)};
    pointer-events: ${({ $searchActive }) => ($searchActive ? 'none' : 'auto')};
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
    position: relative;
`;

const StyledNav = styled.nav`
    display: ${({ $mobileNavActive, $searchActive }) =>
      $searchActive ? 'none' : ($mobileNavActive ? "block" : "none")};
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
        display: ${({ $searchActive }) => ($searchActive ? 'none' : 'flex')};
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
    padding: 16px 0;
    min-height: 48px;
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
        min-height: unset;
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
    transition: opacity 0.3s;
    opacity: ${({ $searchActive }) => ($searchActive ? 0 : 1)};
    pointer-events: ${({ $searchActive }) => ($searchActive ? 'none' : 'auto')};
    a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 48px;
        min-height: 48px;
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
    const [searchActive, setSearchActive] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchInputRef = useRef();

    // Debounced search
    const debouncedSearch = useRef(
        debounce(async (phrase) => {
            if (!phrase) {
                setSuggestions([]);
                setLoadingSuggestions(false);
                return;
            }
            setLoadingSuggestions(true);
            try {
                const res = await axios.get(`/api/products?phrase=${encodeURIComponent(phrase)}`);
                setSuggestions(res.data || []);
            } catch {
                setSuggestions([]);
            }
            setLoadingSuggestions(false);
        }, 350)
    ).current;

    // Effect: fetch suggestions as user types
    useEffect(() => {
        if (searchActive && searchValue.length > 0) {
            debouncedSearch(searchValue);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchValue, searchActive, debouncedSearch]);
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

    function handleSearchIconClick() {
        setSearchActive(true);
        setTimeout(() => {
            if (searchInputRef.current) searchInputRef.current.focus();
        }, 100);
    }
    function handleCloseSearch() {
        setSearchActive(false);
        setSearchValue("");
        setSuggestions([]);
        setShowSuggestions(false);
    }
    function handleSearchKeyDown(e) {
        if (e.key === "Escape") handleCloseSearch();
        if (e.key === "ArrowDown" && suggestions.length > 0) {
            // Focus first suggestion
            const el = document.getElementById("header-suggestion-0");
            if (el) el.focus();
        }
    }
    function handleSuggestionKeyDown(e, idx, id) {
        if (e.key === "Enter") {
            router.push(`/product/${id}`);
            handleCloseSearch();
        } else if (e.key === "ArrowDown") {
            const el = document.getElementById(`header-suggestion-${idx+1}`);
            if (el) el.focus();
        } else if (e.key === "ArrowUp") {
            if (idx === 0) {
                if (searchInputRef.current) searchInputRef.current.focus();
            } else {
                const el = document.getElementById(`header-suggestion-${idx-1}`);
                if (el) el.focus();
            }
        }
    }
    function handleSuggestionClick(title) {
        router.push(`/search?phrase=${encodeURIComponent(title)}`);
        handleCloseSearch();
    }

    return (
        <StyledHeader>
            <Center>
                <Wrapper>
                    <Logo href="/" $searchActive={searchActive}>Shahzad Arshad Elec</Logo>
                    <StyledNav $mobileNavActive={mobileNavActive} $searchActive={searchActive}>
                        <NavLink href="/">Home</NavLink>
                        <NavLink href="/products">All Products</NavLink>
                        <NavLink href="/categories">Categories</NavLink>
                        <NavLink href="/account">Account</NavLink>
                        <NavLink href="/cart" id="cart-link">
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
                    <SideIcons $searchActive={searchActive}>
                        <button
                            aria-label="Search"
                            style={{ background: "none", border: "none", color: "white", cursor: "pointer", display: searchActive ? 'none' : 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 32, minHeight: 32, padding: 0 }}
                            onClick={handleSearchIconClick}
                        >
                            <SearchIcon style={{ width: 20, height: 20 }} />
                        </button>
                        <NavButton 
                            onClick={() => setMobileNavActive((prev) => !prev)}
                            aria-label={mobileNavActive ? "Close menu" : "Open menu"}
                            id="bars-icon"
                        >
                            <BarsIcon />
                        </NavButton>
                    </SideIcons>
                    {searchActive && (
                        <div style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(17,17,17,0.98)",
                            zIndex: 1000,
                            padding: "0 16px"
                        }}>
                            <div style={{ width: "100%", maxWidth: 600, position: "relative" }}>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchValue}
                                    onChange={e => setSearchValue(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                    placeholder="Search for products..."
                                    style={{
                                        width: "100%",
                                        padding: "14px 20px",
                                        fontSize: 18,
                                        borderRadius: 10,
                                        border: "1.5px solid #eee",
                                        outline: "none",
                                        background: "#fff",
                                        color: "#222",
                                        boxShadow: "0 2px 12px rgba(44,62,80,0.10)",
                                        fontWeight: 500
                                    }}
                                    autoFocus
                                    aria-label="Search for products"
                                />
                                {showSuggestions && (
                                    <div style={{
                                        position: "absolute",
                                        left: 0,
                                        right: 0,
                                        top: "calc(100% + 4px)",
                                        background: "#fff",
                                        borderRadius: 10,
                                        boxShadow: "0 8px 32px rgba(44,62,80,0.13)",
                                        zIndex: 1200,
                                        maxHeight: 320,
                                        overflowY: "auto",
                                        marginTop: 2,
                                        border: "1.5px solid #eee"
                                    }}>
                                        {loadingSuggestions ? (
                                            <div style={{ padding: 16, color: "#888", fontWeight: 500 }}>Loading...</div>
                                        ) : suggestions.length === 0 ? (
                                            <div style={{ padding: 16, color: "#888", fontWeight: 500 }}>No results found</div>
                                        ) : (
                                            suggestions.map((prod, idx) => (
                                                <div
                                                    key={prod._id}
                                                    id={`header-suggestion-${idx}`}
                                                    tabIndex={0}
                                                    style={{
                                                        padding: "12px 18px",
                                                        fontSize: 16,
                                                        color: "#222",
                                                        cursor: "pointer",
                                                        borderBottom: idx !== suggestions.length - 1 ? "1px solid #f0f0f0" : "none",
                                                        background: "#fff",
                                                        outline: "none"
                                                    }}
                                                    onClick={() => handleSuggestionClick(prod.title)}
                                                    onKeyDown={e => handleSuggestionKeyDown(e, idx, prod._id)}
                                                >
                                                    {prod.title}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleCloseSearch}
                                aria-label="Close search"
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#fff",
                                    fontSize: 32,
                                    marginLeft: 12,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                <IoClose />
                            </button>
                        </div>
                    )}
                </Wrapper>
            </Center>
        </StyledHeader>
    );
}
