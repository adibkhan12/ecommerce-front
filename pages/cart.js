
import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import Image from "next/image";
import {RevealWrapper} from "next-reveal";

const ColumnWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    margin-top: 40px;
    @media screen and (min-width: 768px) {
        grid-template-columns: 2fr 1fr;
    }
`;

const Box = styled.div`
    background: #fff;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.1),
    -5px -5px 15px rgba(255, 255, 255, 0.8);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-8px);
        box-shadow: 8px 8px 25px rgba(0, 0, 0, 0.2),
        -8px -8px 25px rgba(255, 255, 255, 0.9);
    }

    p {
        color: #555;
        font-size: 1rem;
        line-height: 1.6;
    }
`;

const ProductInfoCell = styled.td`
    padding: 10px 0;
`;

const ProductImageBox = styled.div`
    width: 140px;
    height: 140px;
    padding: 8px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    overflow: hidden;
    background: white;

    img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
`;

const QuantityLabel = styled.span`
    padding: 0 12px;
    font-weight: bold;
    display: block;
    font-size: 1.1rem;
    color: #444;
    @media screen and (min-width: 768px) {
        display: inline-block;
        padding: 0 8px;
    }
`;

const CityHolder = styled.div`
    display: flex;
    gap: 10px;
`;

const FormBox = styled(Box)`
    margin-top: 0;
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.1),
    -5px -5px 15px rgba(255, 255, 255, 0.8);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-8px);
        box-shadow: 8px 8px 25px rgba(0, 0, 0, 0.2),
        -8px -8px 25px rgba(255, 255, 255, 0.9);
    }
`;

const Heading = styled.h2`
    font-size: 1.8rem;
    margin-bottom: 15px;
    color: #333;
    font-weight: bold;
    border-left: 5px solid #ff9900;
    padding-left: 10px;
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

const SuccessMessage = styled.div`
    font-size: 1.6rem;
    text-align: center;
    color: #28a745;
    margin-top: 20px;
`;

const ClearCartWrapper = styled.div`
    margin-top: 20px;
    text-align: right;
`;

const ModernButton = styled(Button)`
    font-size: 1.1rem;
    padding: 4px 16px;
    border-radius: 6px;
    background: transparent;
    color: black;
    border: none;
    transition: all 0.3s ease;

    &:hover {
        background: #ff9900;
        color: white;
        transform: translateY(-2px);
    }

    &:active {
        background: #d88100;
    }

    @media screen and (min-width: 768px) {
        font-size: 1.1rem;
        padding: 8px 20px;
        border-radius: 6px;
        background: transparent;
        color: black;
        border: none;
        transition: all 0.3s ease;

        &:hover {
            background: #ff9900;
            transform: translateY(-2px);
        }

        &:active {
            background: #d88100;
        }
    }
`;

export default function CartPage({ _id }) {
    // Use "cart" from context rather than the old "cartProducts".
    const { cart, addProduct, removeProduct, clearCart } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [email, setEmail] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [number, setNumber] = useState("");
    const [name, setName] = useState("");
    const [country, setCountry] = useState("");
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Fetch product details only for products that have been added (quantity > 0)
    useEffect(() => {
        if (cart.items && cart.items.length > 0) {
            const ids = cart.items.map(item => item.product);
            axios.post("/api/products", { ids })
                .then((response) => {
                    const fetchedProducts = response.data;
                    // Filter out products that have zero quantity
                    const filteredProducts = fetchedProducts.filter(product => {
                        const cartItem = cart.items.find(item => String(item.product) === String(product._id));
                        return cartItem && cartItem.quantity > 0;
                    });
                    setProducts(filteredProducts);
                })
                .catch((error) => {
                    console.error("Error fetching product details", error);
                });
        } else {
            setProducts([]);
        }
    }, [cart]);

    useEffect(() => {
        if (isClient && window.location.href.includes("success")) {
            clearCart();
        }
        axios.get('/api/address')
            .then((response) => {
                setName(response.data.name || "");
                setEmail(response.data.email || "");
                setAddressLine1(response.data.addressLine1 || "");
                setAddressLine2(response.data.addressLine2 || "");
                setNumber(response.data.number || "");
                setCity(response.data.city || "");
                setCountry(response.data.country || "");
                setPostalCode(response.data.postalCode || "");
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    console.warn("User not logged in. Proceeding without address details.");
                } else {
                    console.error("Error fetching address:", error);
                }
            });
    }, [isClient]);

    function moreOfThisProduct(id) {
        addProduct(id);
    }

    function lessOfThisProduct(id) {
        removeProduct(id);
    }

    function validateForm() {
        if (!name || !email || !city || !postalCode || !addressLine1 || !number || !country) {
            alert("Please fill in all required fields.");
            return false;
        }
        return true;
    }

    async function placeOrderCOD() {
        if (!validateForm()) return;

        try {
            const response = await axios.post("/api/checkout", {
                name,
                email,
                city,
                postalCode,
                addressLine1,
                addressLine2,
                number,
                country,
                // Pass the cart items to the order
                cartItems: cart.items,
                paymentMethod: "COD",
            });

            if (response.status === 200) {
                clearCart();
                window.location.href = "/cart?success=1";
            } else {
                alert("Failed to place order. Please try again.");
            }
        } catch (error) {
            alert("Error occurred while placing the order.");
        }
    }

    // Compute total based on the filtered products and cart quantities.
    let total = 0;
    products.forEach(product => {
        const cartItem = cart.items.find(item => String(item.product) === String(product._id));
        if (cartItem) {
            total += (cartItem.quantity * product.price);
        }
    });

    if (isClient && window.location.href.includes("success")) {
        return (
            <>
                <Header />
                <Center>
                    <ColumnWrapper>
                        <Box>
                            <h1>Order Placed Successful</h1>
                            <SuccessMessage>
                                Soon you will get confirmation message via email or WhatsApp
                            </SuccessMessage>
                            <p>THANK YOU FOR SHOPPING WITH US!</p>
                        </Box>
                    </ColumnWrapper>
                </Center>
            </>
        );
    }

    return (
        <>
            <Header />
            <Center>
                <ColumnWrapper>
                    <RevealWrapper origin={'left'} duration={800} distance='30px'>
                        <Box>
                            <Heading>Cart</Heading>
                            {(!cart.items || cart.items.length === 0) && (
                                <div><p>Your cart is empty</p></div>
                            )}
                            {products.length > 0 && (
                                <div>
                                    <Table>
                                        <thead>
                                        <tr>
                                            <th>Products</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {products.map((product,index) => {
                                            if (!product) {
                                                return (
                                                    <tr key={Math.random()}>
                                                        <td colSpan={3} style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
                                                            This product is no longer available.
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                            const cartItem = cart.items.find(
                                                (item) => String(item.product) === String(product._id)
                                            );
                                            const quantity = cartItem ? cartItem.quantity : 0;
                                            return (
                                                <tr key={product._id}>
                                                    <RevealWrapper
                                                        delay={index*100}
                                                        origin={'left'}
                                                        duration={800}
                                                        distance='30px'
                                                    >
                                                        <ProductInfoCell>
                                                            <ProductImageBox>
                                                                <Image
                                                                    src={product.images[0]}
                                                                    alt={product.title}
                                                                    width={140}
                                                                    height={140}
                                                                    style={{ objectFit: "contain" }}
                                                                />
                                                            </ProductImageBox>
                                                            {product.title}
                                                        </ProductInfoCell>
                                                    </RevealWrapper>
                                                        <td>
                                                            <ModernButton onClick={() => lessOfThisProduct(product._id)}>-</ModernButton>
                                                            <QuantityLabel>{quantity}</QuantityLabel>
                                                            <ModernButton onClick={() => moreOfThisProduct(product._id)}>+</ModernButton>
                                                        </td>
                                                <td>
                                                    {quantity * product.price} AED
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>AED {total}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                                <ClearCartWrapper>
                                    <ModernButton onClick={clearCart}>Clear Cart</ModernButton>
                                </ClearCartWrapper>
                            </div>
                        )}
                    </Box>
                </RevealWrapper>
        {cart.items && cart.items.length > 0 && (
            <RevealWrapper>
                <FormBox>
                    <Heading>Order Information</Heading>
                    <StyledInput
                        type="text"
                        placeholder="Name"
                        value={name}
                        name="name"
                        onChange={(ev) => setName(ev.target.value)}
                    />
                    <StyledInput
                        type="email"
                        placeholder="Email"
                        value={email}
                        name="email"
                        onChange={(ev) => setEmail(ev.target.value)}
                    />
                    <StyledInput
                        type="text"
                        placeholder="Address line 1"
                        value={addressLine1}
                        name="addressLine1"
                        onChange={(ev) => setAddressLine1(ev.target.value)}
                    />
                    <StyledInput
                        type="text"
                        placeholder="Address line 2"
                        value={addressLine2}
                        name="addressLine2"
                        onChange={(ev) => setAddressLine2(ev.target.value)}
                    />
                    <StyledInput
                        type="text"
                        placeholder="WhatsApp number"
                        value={number}
                        name="number"
                        onChange={(ev) => setNumber(ev.target.value)}
                    />
                    <CityHolder>
                        <StyledInput
                            type="text"
                            placeholder="City"
                            value={city}
                            name="city"
                            onChange={(ev) => setCity(ev.target.value)}
                        />
                        <StyledInput
                            type="text"
                            placeholder="Postal Code"
                            value={postalCode}
                            name="postalCode"
                            onChange={(ev) => setPostalCode(ev.target.value)}
                        />
                    </CityHolder>
                    <StyledInput
                        type="text"
                        placeholder="Country"
                        value={country}
                        name="country"
                        onChange={(ev) => setCountry(ev.target.value)}
                    />
                    <ModernButton block black onClick={placeOrderCOD}>
                        Place Order (COD)
                    </ModernButton>
                </FormBox>
            </RevealWrapper>

        )}
        </ColumnWrapper>
</Center>
</>
);
}
