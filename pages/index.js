import Header from "@/components/Header";
import Featured from "@/components/Featured";
import NewProducts from "@/components/NewProducts";
// import ShopByBrand from "@/components/ShopByBrand";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import CategorySection from "@/components/CategorySection";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/product";
import {Setting} from "@/models/Setting";
import {getServerSession} from "next-auth";
import {WishedProduct} from "@/models/WishedProduct";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

export default function HomePage({ featuredProduct, newProducts, wishedNewProducts, categoriesWithProducts }) {
  return (
    <div style={{ background: "linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)" }}>
      <Header />
      <Featured product={featuredProduct} />
      <NewProducts products={newProducts} wishedProducts={wishedNewProducts} />
      {categoriesWithProducts && categoriesWithProducts.map(cat => (
        <CategorySection key={cat._id} {...cat} wishedProducts={cat.wishedProducts} />
      ))}
    </div>
  );
}

export async function getServerSideProps(ctx){
    await mongooseConnect();
    const { Category } = require("@/models/Category");
    // Fetch the featured product ID from settings
    const featuredProductSetting = await Setting.findOne({ name: "featuredProductId" });

    let featuredProduct = null;
    if (featuredProductSetting?.value) {
        featuredProduct = await Product.findById(featuredProductSetting.value);
    }

    const newProducts = await Product.find({}, null, {sort: {'_id':-1}, limit: 12});

    const session = await getServerSession(ctx.req, ctx.res, authOptions);
    const userEmail = session?.user?.email || null;

    let wishedNewProducts = [];
    let wishedCategoryProducts = {};
    // Fetch all main categories
    const { default: uniq } = await import('lodash/uniq');
    const allCategories = await Category.find();
    const mainCategories = allCategories.filter(c => !c.parent);
    // For each main category, fetch up to 20 products
    const categoriesWithProducts = await Promise.all(mainCategories.map(async (cat) => {
      const products = await Product.find({ category: cat._id }, null, { sort: { '_id': -1 }, limit: 12 });
      return {
        _id: cat._id.toString(),
        name: cat.name,
        products: JSON.parse(JSON.stringify(products)),
      };
    }));

    // Collect all product IDs shown in all category sections
    const allCategoryProductIds = uniq(categoriesWithProducts.flatMap(cat => cat.products.map(p => p._id)));

    if (userEmail) {
        wishedNewProducts = await WishedProduct.find({
            userEmail,
            product: newProducts.map(p => p._id.toString()),
        });
        // Fetch wished products for all category products
        const wishedCategory = await WishedProduct.find({
            userEmail,
            product: allCategoryProductIds,
        });
        wishedCategoryProducts = wishedCategory.map(i => i.product.toString());
    }

    // Attach wishedProducts to each category
    const categoriesWithWished = categoriesWithProducts.map(cat => ({
      ...cat,
      wishedProducts: wishedCategoryProducts || [],
    }));

    return {
        props: {
            featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
            newProducts: JSON.parse(JSON.stringify(newProducts)),
            wishedNewProducts: wishedNewProducts.map(i => i.product.toString()),
            categoriesWithProducts: categoriesWithWished,
        },
    }
}
