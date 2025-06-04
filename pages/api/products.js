import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";

export default async function handler(req, res) {
    await mongooseConnect();

    const { categories, sort = 'price_asc',phrase, ...filters } = req.query;

    // Extract sorting field and order from the sort query
    const [sortField, sortOrder] = sort.split("_");

    let query = {};

    // Filter by category if provided
    if (categories) {
        query.category = { $in: categories.split(',') };
    }
    if (phrase) {
        query['$or'] = [
            {title:{$regex: phrase,$options:'i'}},
            {description:{$regex: phrase,$options:'i'}},
        ]
    }
    // Apply property filters
    const propertyFilters = [];
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== 'all') {
            propertyFilters.push({
                [`properties.${key}`]: { $regex: value, $options: 'i' }
            });
        }
    });

    if (propertyFilters.length > 0) {
        query.$and = propertyFilters;
    }

    // Handle sorting logic
    let sortQuery = {};
    if (sortField === 'price') {
        sortQuery.price = sortOrder === 'asc' ? 1 : -1;
    } else if (sortField === 'name') {
        sortQuery.title = sortOrder === 'asc' ? 1 : -1;
    } else {
        // Default sorting if sortField is invalid
        sortQuery.createdAt = -1;  // Newest first
    }

    // Fetch products with filters and sorting
    let products;
    if (sortField === 'name') {
        products = await Product.find(query)
            .collation({ locale: 'en', strength: 1 })
            .sort(sortQuery);
    } else {
        products = await Product.find(query).sort(sortQuery);
    }

    res.json(products);
}
