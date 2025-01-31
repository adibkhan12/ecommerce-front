import { createContext, useEffect, useState } from "react";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
    const ls = typeof window !== "undefined" ? window.localStorage : null;
    const [cartProducts, setCartProducts] = useState([]);

    // Load cart from localStorage when app starts
    useEffect(() => {
        const ls = typeof window !== "undefined" ? window.localStorage : null;
        if (ls && ls.getItem("cart")) {
            const storedCart = JSON.parse(ls.getItem("cart"));
            if (storedCart.length > 0) {
                setCartProducts(storedCart);
            }
        }
    }, []);

    // Save cart to localStorage when updated
    useEffect(() => {
        const ls = typeof window !== "undefined" ? window.localStorage : null;
        if (cartProducts.length > 0) {
            ls?.setItem("cart", JSON.stringify(cartProducts));
        } else {
            ls?.removeItem("cart");  // Remove cart if empty to avoid restoring
        }
    }, [cartProducts]);

    function addProduct(productId) {
        setCartProducts((prev) => [...prev, productId]);
    }

    function removeProduct(productId) {
        setCartProducts((prev) => {
            const pos = prev.indexOf(productId);
            if (pos !== -1) {
                return prev.filter((value, index) => index !== pos);
            }
            return prev;
        });
    }

    function clearCart() {
        setCartProducts([]); // Clear cart state
        ls?.removeItem("cart"); // Remove cart from localStorage to prevent restoring
    }

    return (
        <CartContext.Provider value={{ cartProducts, setCartProducts, addProduct, removeProduct, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}
