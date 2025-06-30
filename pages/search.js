import Header from "@/components/Header";
import Center from "@/components/Center";
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import ProductsGrid from "@/components/ProductsGrid";
import { debounce } from "lodash";
// New components (to be created)
import LoadingSpinner from "@/components/LoadingSpinner";
import NoResultsIllustration from "@/components/NoResultsIllustration";
import SuggestionGrid from "@/components/SuggestionGrid";
import SearchPhraseBadge from "@/components/SearchPhraseBadge";
import BackButton from "@/components/BackButton";

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



export default function SearchPage() {
    const router = useRouter();
    const [phrase, setPhrase] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const debouncedSearch = useCallback(
        debounce(searchProducts, 500), []);

    // Sync phrase from URL query
    useEffect(() => {
        if (router.isReady) {
            const urlPhrase = router.query.phrase || '';
            setPhrase(typeof urlPhrase === 'string' ? urlPhrase : '');
        }
    }, [router.isReady, router.query.phrase]);

    // Search when phrase changes
    useEffect(() => {
        if (phrase.length > 0) {
            debouncedSearch(phrase);
        } else {
            setProducts([]);
            setSuggestions([]);
        }
    }, [phrase, debouncedSearch]);

    function searchProducts(phrase) {
        setLoading(true);
        axios.get('/api/products?phrase=' + encodeURIComponent(phrase))
            .then(response => {
                setProducts(response.data);
                if (!response.data || response.data.length === 0) {
                    // Try to get suggestions (broader search, e.g. by first word)
                    const firstWord = phrase.split(' ')[0];
                    if (firstWord && firstWord.length > 1) {
                        axios.get('/api/products?phrase=' + encodeURIComponent(firstWord))
                            .then(sugRes => {
                                setSuggestions(sugRes.data || []);
                            });
                    } else {
                        setSuggestions([]);
                    }
                } else {
                    setSuggestions([]);
                }
            })
            .finally(() => setLoading(false));
    }

    // When user types, update URL
    function handleInputChange(ev) {
        const newPhrase = ev.target.value;
        setPhrase(newPhrase);
        router.replace({
            pathname: '/search',
            query: newPhrase ? { phrase: newPhrase } : {},
        }, undefined, { shallow: true });
    }

    return (
        <>
            <Header />
            <Center>
                <div style={{
                    maxWidth: 900,
                    margin: '0 auto',
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                    padding: '32px 24px 48px 24px',
                    marginTop: 40,
                    marginBottom: 40,
                    position: 'relative',
                }}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24}}>
                        <h2 style={{
                            fontWeight: 800,
                            fontSize: 32,
                            letterSpacing: 0.5,
                            color: '#222',
                            textTransform: 'uppercase',
                            margin: 0,
                        }}>
                            Products Matching Your Search
                        </h2>
                        <BackButton href="/products" />
                    </div>
                    {phrase && <SearchPhraseBadge phrase={phrase} />}
                    {loading ? (
                        <div style={{margin: '48px 0'}}><LoadingSpinner /></div>
                    ) : (
                        <>
                            {phrase !== '' && products.length === 0 && (
                                <>
                                    <div style={{margin: '48px 0'}}>
                                        <NoResultsIllustration message="Not available at the moment" />
                                    </div>
                                    {suggestions.length > 0 && (
                                        <div style={{marginTop: 32}}>
                                            <h4 style={{textAlign: 'center', color: '#555', fontWeight: 600, fontSize: 20, marginBottom: 16}}>
                                                Shop for these instead?
                                            </h4>
                                            <SuggestionGrid products={suggestions} />
                                        </div>
                                    )}
                                </>
                            )}
                            <ProductsGrid products={products} />
                        </>
                    )}
                </div>
            </Center>
        </>
    );
}
