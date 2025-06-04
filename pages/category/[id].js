import Header from "@/components/Header";
import Center from "@/components/Center";
import {Category} from "@/models/Category";
import {Product} from "@/models/product";
import ProductsGrid from "@/components/ProductsGrid";
import styled from "styled-components";
import {useEffect, useState} from "react";
import axios from "axios";

const CategoryHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap; /* Ensure responsive layout for smaller screens */
    gap: 20px;
    margin-bottom: 30px;

    h1 {
        font-size: 2rem;
        font-weight: bold;
        color: #333;
        background: linear-gradient(to right, #4caf50, #81c784);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
    }
`;

const FilterWrapper = styled.div`
    display: flex;
    flex-wrap: wrap; /* Ensures filters wrap on smaller screens */
    gap: 15px;
`;

const Filter = styled.div`
    background-color: #f1f1f1;
    padding: 8px 15px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #555;
    font-size: 1rem;
    font-weight: 500;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s, box-shadow 0.3s;

    &:hover {
        background-color: #e0e0e0;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    }

    select {
        background-color: transparent;
        border: none;
        font-size: 1rem;
        color: #555;
        outline: none;
        cursor: pointer;

        &:hover {
            color: #333;
        }
    }

    span {
        font-weight: bold;
        color: #4caf50;
    }
`;

const NoProductsMessage = styled.div`
    text-align: center;
    font-size: 1.2rem;
    color: #999;
    margin-top: 50px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    span {
        color: #4caf50;
        font-weight: bold;
    }
`;

export default function CategoryPage({
    category, subCategories, products:originalProducts
}) {
    const [products, setProducts] = useState(originalProducts);
    const [filtersValues, setFiltersValues] = useState(
        category.properties.map(p => ({name:p.name,value:'all'}))
    );
    const [sort, setSort] = useState('price_asc')

    function handleFilterChange(filterName, filterValue) {
        setFiltersValues(prev => {
            return prev.map(p => ({
                name: p.name,
                value: p.name === filterName ? filterValue : p.value,
            }));
        })
    }

    const activeFilters = filtersValues.filter(f => f.value !== 'all');

    useEffect(() => {
        const catIds = [category._id, ...(subCategories?.map(c => c._id) || [])];
        const params = new URLSearchParams;
        params.set('categories', catIds.join(','));
        params.set('sort', sort);
        filtersValues.forEach(f => {
            if (f.value !== 'all'){
                params.set(f.name, f.value);
            }
        });
        const url = `/api/products?`+ params.toString();
        axios.get(url).then(res => {
            setProducts(res.data)
        })
    }, [filtersValues,sort]);
    return (
        <>
            <Header />
            <Center>
                <CategoryHeader>
                    <h1>{category.name}</h1>
                    <FilterWrapper>
                        {category.properties.map(prop => (
                            <Filter key={prop.name}>
                                <span>
                                {prop.name}:
                                </span>
                                <select
                                    onChange={(ev) => handleFilterChange(prop.name, ev.target.value )}
                                    value={filtersValues.find(f => f.name === prop.name).value}
                                >
                                    <option value="all">All</option>
                                    {prop.values.map(val => (
                                        <option key={val}>{val}</option>
                                    ))}
                                </select>
                            </Filter>
                        ))}
                        <Filter>
                            <span>Sorting:</span>
                            <select
                                value={sort}
                                onChange={ev => setSort(ev.target.value)}
                            >
                                <option value="price_asc">Price, Lowest First</option>
                                <option value="price_desc">Price, Highest First</option>
                            </select>
                        </Filter>
                    </FilterWrapper>
                </CategoryHeader>
                {products.length > 0 ? (
                    <ProductsGrid products={products} enableCompare={true} />
                ) : (
                    <NoProductsMessage>
                        😔 No products available for the selected filters.<br />
                        {activeFilters.length > 0 && (
                            <div>
                                Tried filters:
                                {activeFilters.map(f => (
                                    <span key={f.name}> {f.name}: "{f.value}"</span>
                                ))}
                            </div>
                        )}
                    </NoProductsMessage>
                )}
            </Center>
        </>
    )
}

export async function getServerSideProps(context){
    const category = await Category.findById(context.query.id);
    const subCategories = await Category.find({parent:category._id});
    const catIds = [category._id, ...subCategories.map(c => c._id)];
    const products = await Product.find({category: { $in: catIds }});

    return {
        props:{
            category: JSON.parse(JSON.stringify(category)),
            subCategories: JSON.parse(JSON.stringify(subCategories)),
            products: JSON.parse(JSON.stringify(products)),
        }
    }
}