import Header from "@/components/Header";
import Center from "@/components/Center";
import Input from "@/components/Input";
import styled from "styled-components";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import ProductsGrid from "@/components/ProductsGrid";
import {debounce} from "lodash";

// Styled Components
const SearchContainer = styled.div`
    width: 100%;
    max-width: 600px;
    margin: 20px auto;
    padding: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background-color: #fff;
    position: sticky;
    top: 80px;
`;


const SearchInput = styled(Input)`
    width: 100%;
    padding: 12px 16px;
    font-size: 16px;
    border: 1px solid #ced4da;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

export default function SearchPage() {
    const [phrase, setPhrase] = useState('');
    const [products, setProducts] = useState([]);
    const debouncedSearch = useCallback(
        debounce(searchProducts, 500), []);
    useEffect(() => {
        if (phrase.length > 0) {
            debouncedSearch(phrase);
        }else {
            setProducts([]);
        }
    }, [phrase]);

    function searchProducts(phrase) {
            axios.get ('/api/products?phrase='+encodeURIComponent(phrase))
                .then(response => {
                    setProducts(response.data);
                });
    }
    return (
        <>
            <StyledHeader />
            <Center>
                <SearchContainer>
                    <SearchInput
                        autoFocus
                        value={phrase}
                        onChange={ev => setPhrase(ev.target.value)}
                        placeholder="Search..." aria-label="Search" />
                </SearchContainer>
                {phrase !== '' && products.length === 0 && (
                    <h2>No Products found for "{phrase}"</h2>
                )}
                <ProductsGrid products={products} />
            </Center>
        </>
    );
}
