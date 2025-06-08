import Header from "@/components/Header";
import Center from "@/components/Center";
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "@/components/Button";
import styled from "styled-components";
import WhiteBox from "@/components/Box";
import { useEffect, useState } from "react";
import Input from "@/components/Input";
import axios from "axios";
import ProductWhiteBox from "@/components/ProductBox";

const ColsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-top: 50px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const StyledWhiteBox = styled(WhiteBox)`
    padding: 40px;
    background: linear-gradient(145deg, #ffffff, #f0f0f0);
    border-radius: 16px;
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.1), -5px -5px 15px rgba(255, 255, 255, 0.8);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-8px);
        box-shadow: 8px 8px 25px rgba(0, 0, 0, 0.2), -8px -8px 25px rgba(255, 255, 255, 0.9);
    }

    h2 {
        font-size: 1.8rem;
        margin-bottom: 15px;
        color: #333;
        font-weight: bold;
        border-left: 5px solid #ff9900;
        padding-left: 10px;
    }

    p {
        color: #555;
        font-size: 1rem;
        line-height: 1.6;
    }
`;

const StyledInput = styled(Input)`
    margin-bottom: 20px;
    padding: 15px;
    font-size: 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    background-color: #fafafa;
    box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.05);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;

    &:focus {
        border-color: #ff9900;
        box-shadow: 0 0 8px rgba(255, 153, 0, 0.3);
        outline: none;
    }
`;

const CityHolder = styled.div`
    display: flex;
    gap: 15px;

    @media (max-width: 480px) {
        flex-direction: column;
    }
`;

const WishedProductGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
`;

const ActionButton = styled(Button)`
    margin-top: 20px;
    padding: 14px 28px;
    font-size: 1.1rem;
    font-weight: bold;
    border-radius: 30px;
    background: linear-gradient(90deg, #ff9900, #ff6600);
    color: #fff;
    border: none;
    box-shadow: 0 5px 15px rgba(255, 153, 0, 0.4);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(255, 153, 0, 0.6);
    }

    &:active {
        transform: scale(0.98);
        box-shadow: 0 4px 10px rgba(255, 153, 0, 0.5);
    }
`;

const Divider = styled.hr`
    margin: 20px 0;
    border: none;
    border-top: 2px solid  #ff9900;
`;

export default function AccountPage() {
    const { data: session, status } = useSession();
    const [name, setName] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [number, setNumber] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [addressLoaded, setAddressLoaded] = useState(false);
    const [wishlistLoaded, setWishlistLoaded] = useState(false);
    const [wishedProduct, setWishedProduct] = useState([]);

    async function logout() {
        await signOut({ callbackUrl: process.env.NEXT_PUBLIC_URL });
        setWishedProduct([]);
        setWishlistLoaded(false);
    }

    async function login() {
        await signIn("google");
    }

    function saveAddress() {
        const data = { name, email: session.user.email, city, postalCode, addressLine1, addressLine2, number, country };
        axios.put("/api/address", data)
            .then(() => console.log("Address saved successfully"))
            .catch((error) => console.error("Error saving address:", error));
    }

    useEffect(() => {
        if (!session?.user?.email) {
            console.log("Session is null, user might not be logged in.");
            return;
        }

        axios.get("/api/address")
            .then((response) => {
                if (response.data && Object.keys(response.data).length > 0) {
                    setName(response.data.name || "");
                    setAddressLine1(response.data.addressLine1 || "");
                    setAddressLine2(response.data.addressLine2 || "");
                    setNumber(response.data.number || "");
                    setCity(response.data.city || "");
                    setCountry(response.data.country || "");
                    setPostalCode(response.data.postalCode || "");
                } else {
                    axios.put("/api/address", {
                        name: session.user.name || "",
                        email: session.user.email,
                        city: "",
                        number: "",
                        postalCode: "",
                        addressLine1: "",
                        addressLine2: "",
                        country: "",
                    }).catch((error) => console.error("Error creating new user profile:", error));
                }
                setAddressLoaded(true);
            })
            .catch((error) => {
                console.error("Error fetching address:", error);
                setAddressLoaded(true);
            });

        axios.get("/api/wishlist")
            .then((response) => {
                setWishedProduct(response.data.map(wp => wp.product));
                setWishlistLoaded(true);
            })
            .catch((error) => console.error("Error fetching wishlist:", error));
    }, [session]);

    function handleProductRemoval(idToRemove) {
        setWishedProduct((products) => products.filter(p => p._id.toString() !== idToRemove));
    }

    return (
        <>
            <Header />
            <Center>
                <ColsWrapper>
                    <StyledWhiteBox>
                        <h2>Wishlist</h2>
                        {session ? (
                            wishlistLoaded ? (
                                <WishedProductGrid>
                                    {wishedProduct.length > 0 ? (
                                        wishedProduct.map(wp =>
                                            wp ? (
                                                <ProductWhiteBox key={wp._id} {...wp} wished={true}
                                                    onRemoveFromWishlist={handleProductRemoval} />
                                            ) : (
                                                <div key={product?._id || idx} style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
                                                    This product is no longer available.
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <p>Your saved products will appear here. Keep shopping and save your favorites!</p>
                                    )}
                                </WishedProductGrid>
                            ) : (
                                <p>Loading wishlist...</p>
                            )
                        ) : (
                            <p>Please log in to view and manage your wishlist.</p>
                        )}
                    </StyledWhiteBox>
                    <StyledWhiteBox>
                        <h2>{session ? 'Account Details' : 'Login'}</h2>
                        {session ? (
                            status === "loading" ? (
                                <p>Loading...</p>
                            ) : (
                                <>
                                    <StyledInput type="text" placeholder="Name" value={name}
                                                 onChange={(e) => setName(e.target.value)} />
                                    <StyledInput type="email" placeholder="Email" value={session?.user?.email || ""}
                                                 readOnly />
                                    <StyledInput type="text" placeholder="Address Line 1" value={addressLine1}
                                                 onChange={(e) => setAddressLine1(e.target.value)} />
                                    <StyledInput type="text" placeholder="Address Line 2" value={addressLine2}
                                                 onChange={(e) => setAddressLine2(e.target.value)} />
                                    <StyledInput type="text" placeholder="WhatsApp number" value={number}
                                                 onChange={(e) => setNumber(e.target.value)} />
                                    <CityHolder>
                                        <StyledInput type="text" placeholder="City" value={city}
                                                     onChange={(e) => setCity(e.target.value)} />
                                        <StyledInput type="text" placeholder="Postal Code" value={postalCode}
                                                     onChange={(e) => setPostalCode(e.target.value)} />
                                    </CityHolder>
                                    <StyledInput type="text" placeholder="Country" value={country}
                                                 onChange={(e) => setCountry(e.target.value)} />
                                    <ActionButton onClick={saveAddress}>Save</ActionButton>
                                    <Divider />
                                    <p>Welcome! <strong>{session.user.name}</strong></p>
                                    <Button primary={true} onClick={logout}>Logout</Button>
                                </>
                            )
                        ) : (
                            <>
                                <Button primary={true} onClick={login}>Login</Button>
                            </>
                        )}
                    </StyledWhiteBox>
                </ColsWrapper>
            </Center>
        </>
    );
}