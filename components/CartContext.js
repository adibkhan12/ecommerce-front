import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";  // npm install uuid if not already installed

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
    const { data: session } = useSession();
    const [cart, setCart] = useState({ items: [], updatedAt: new Date() });
    const [guestId, setGuestId] = useState(null);

    // For guests, generate or get unique guestId stored in localStorage.
    useEffect(() => {
        if (!session?.user?.email) {
            const storedGuestId = window.localStorage.getItem("guestId");
            if (storedGuestId) {
                setGuestId(storedGuestId);
            } else {
                const newGuestId = uuidv4();
                window.localStorage.setItem("guestId", newGuestId);
                setGuestId(newGuestId);
            }
        }
    }, [session]);


    // Fetch cart from DB (if exists), using session email or guestId.
    const fetchCart = async () => {
        try {
            const identifier = session?.user?.email || guestId;
            if (!identifier) return;
            const res = await axios.get("/api/cart", { params: { identifier } });
            if (res.status === 200 && res.data) {
                setCart(res.data);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    // Update cart in DB via API PUT
    const updateCart = async (updatedCart) => {
        try {
            const identifier = session?.user?.email || guestId;
            if (!identifier) return;
            await axios.put("/api/cart", { identifier, cart: updatedCart });
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    // On mount or when session/guestId changes, fetch existing cart.
    useEffect(() => {
        if (session?.user?.email || guestId) {
            fetchCart();
        }
    }, [session, guestId]);

    const addProduct = async (productId, quantity = 1) => {
        let newCart;
        const index = cart.items.findIndex(item => String(item.product) === String(productId));
        if (index !== -1) {
            newCart = {
                ...cart,
                items: cart.items.map((item, i) =>
                    i === index ? { ...item, quantity: item.quantity + quantity } : item
                ),
                updatedAt: new Date()
            };
        } else {
            newCart = {
                ...cart,
                items: [...cart.items, { product: productId, quantity }],
                updatedAt: new Date()
            };
        }
        setCart(newCart);
        await updateCart(newCart);
    }

    const removeProduct = async (productId) => {
        const newCart = {
            ...cart,
            items: cart.items.filter(item => String(item.product) !== String(productId)),
            updatedAt: new Date()
        };
        setCart(newCart);
        await updateCart(newCart);
    };

    const clearCart = async () => {
        const newCart = { items: [], updatedAt: new Date() };
        setCart(newCart);
        await updateCart(newCart);
    };

    return (
        <CartContext.Provider value={{ cart, addProduct, removeProduct, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}
