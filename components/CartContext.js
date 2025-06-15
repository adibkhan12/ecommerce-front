import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
    const { data: session } = useSession();
    const [cart, setCart] = useState({ items: [], updatedAt: new Date() });
    const [guestId, setGuestId] = useState(null);

    // Handle guestId for non-logged-in users
    useEffect(() => {
        if (!session?.user?.email) {
            let id = window.localStorage.getItem("guestId");
            if (!id) {
                id = uuidv4();
                window.localStorage.setItem("guestId", id);
            }
            setGuestId(id);
        }
    }, [session]);

    // Fetch cart from DB
    const fetchCart = async () => {
        const identifier = session?.user?.email || guestId;
        if (!identifier) return;
        try {
            const res = await axios.get("/api/cart", { params: { identifier } });
            if (res.status === 200 && res.data) setCart(res.data);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    // Update cart in DB
    const updateCart = async (updatedCart) => {
        const identifier = session?.user?.email || guestId;
        if (!identifier) return;
        try {
            await axios.put("/api/cart", { identifier, cart: updatedCart });
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    // Fetch cart on mount/session/guestId change
    useEffect(() => {
        if (session?.user?.email || guestId) fetchCart();
    }, [session, guestId]);

    const addProduct = async (productId, quantity = 1) => {
        const idx = cart.items.findIndex(item => String(item.product) === String(productId));
        let newItems = [...cart.items];
        if (idx !== -1) {
            newItems[idx] = { ...newItems[idx], quantity: newItems[idx].quantity + quantity };
        } else {
            newItems.push({ product: productId, quantity });
        }
        const newCart = { ...cart, items: newItems, updatedAt: new Date() };
        setCart(newCart);
        await updateCart(newCart);
    };

    const removeProduct = async (productId) => {
        const idx = cart.items.findIndex(item => String(item.product) === String(productId));
        if (idx === -1) return;
        let newItems = [...cart.items];
        if (newItems[idx].quantity > 1) {
            newItems[idx] = { ...newItems[idx], quantity: newItems[idx].quantity - 1 };
        } else {
            newItems.splice(idx, 1);
        }
        const newCart = { ...cart, items: newItems, updatedAt: new Date() };
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
