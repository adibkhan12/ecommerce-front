import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/center";
import Button from "@/components/Button";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";

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
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease-in-out;
    &:hover {
        box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
    }
`;

const ProductInfoCell = styled.td`
    padding: 10px 0;
`;

const ProductImageBox = styled.div`
    width: 90px;
    height: 120px;
    padding: 5px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    transition: all 0.2s ease;

    img {
        max-height: 90px;
        max-width: 90px;
        border-radius: 8px;
    }

    &:hover {
        transform: scale(1.05);
    }

    @media screen and (min-width: 768px) {
        padding: 12px;
        width: 140px;
        height: 140px;

        img {
            max-height: 110px;
            max-width: 110px;
        }
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
    margin-top: 30px;
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

const ModernButton = styled(Button)`
    font-size: 1.1rem;
    padding: 4px 16px;
    border-radius: 6px; // Less curve, more rectangular
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
        border-radius: 6px;  // Less curve, more rectangular
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

export default function CartPage() {
    const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [country, setCountry] = useState("");
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (cartProducts.length > 0) {
            axios.post("/api/cart", { ids: cartProducts }).then((response) => {
                setProducts(response.data);
            });
        } else {
            setProducts([]);
        }
    }, [cartProducts]);

    useEffect(() => {
        if (isClient && window.location.href.includes("success")) {
            clearCart();
        }
        axios.get('/api/address').then((response) => {
            setName(response.data.name);
            setEmail(response.data.email);
            setAddressLine1(response.data.addressLine1);
            setAddressLine2(response.data.addressLine2);
            setCity(response.data.city);
            setCountry(response.data.country);
            setPostalCode(response.data.postalCode);
        })
    }, [isClient]);

    function moreOfThisProduct(id) {
        addProduct(id);
    }

    function lessOfThisProduct(id) {
        removeProduct(id);
    }

    function validateForm() {
        if (!name || !email || !city || !postalCode || !addressLine1 || !country) {
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
                country,
                cartProducts,
                paymentMethod: "COD",
            });

            if (response.status === 200) {
                clearCart();
                alert("Your order has been placed successfully with Cash on Delivery!");
                window.location.href = "/cart?success=1";
            } else {
                alert("Failed to place order. Please try again.");
            }
        } catch (error) {
            alert("Error occurred while placing the order.");
        }
    }

    let total = 0;
    for (const productId of cartProducts) {
        const price = products.find((p) => p._id === productId)?.price || 0;
        total += price;
    }

    if (isClient && window.location.href.includes("success")) {
        return (
            <>
                <Header />
                <Center>
                    <ColumnWrapper>
                        <Box>
                            <h1>Payment Successful</h1>
                            <SuccessMessage>Your order will reach your destination on time.</SuccessMessage>
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
                    <Box>
                        <Heading>Cart</Heading>
                        {!cartProducts?.length && <div>Your cart is empty</div>}
                        {products?.length > 0 && (
                            <Table>
                                <thead>
                                <tr>
                                    <th>Products</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                                </thead>
                                <tbody>
                                {products.map((product) => (
                                    <tr key={product._id}>
                                        <ProductInfoCell>
                                            <ProductImageBox>
                                                <img src={product.images[0]} alt={product.title} />
                                            </ProductImageBox>
                                            {product.title}
                                        </ProductInfoCell>
                                        <td>
                                            <ModernButton onClick={() => lessOfThisProduct(product._id)}>-</ModernButton>
                                            <QuantityLabel>
                                                {cartProducts.filter((id) => id === product._id).length}
                                            </QuantityLabel>
                                            <ModernButton onClick={() => moreOfThisProduct(product._id)}>+</ModernButton>
                                        </td>
                                        <td>
                                            AED{" "}
                                            {cartProducts.filter((id) => id === product._id).length *
                                                product.price}
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td>AED {total}</td>
                                </tr>
                                </tbody>
                            </Table>
                        )}
                    </Box>
                    {!!cartProducts?.length > 0 && (
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
                    )}
                </ColumnWrapper>
            </Center>
        </>
    );
}
