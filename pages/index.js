import Header from "@/components/Header";
import dynamic from "next/dynamic";
import CategoryNav from "@/components/CategoryNav";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/product";
import {Setting} from "@/models/Setting";
import {getServerSession} from "next-auth";
import {WishedProduct} from "@/models/WishedProduct";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import Swal from 'sweetalert2';

const HeroBanner = dynamic(() => import("@/components/HeroBanner"), { ssr: false });
const FeaturedSlider = dynamic(() => import("@/components/FeaturedSlider"), { ssr: false });
const ShopByBrand = dynamic(() => import("@/components/ShopByBrand"), { ssr: false });
const NewProducts = dynamic(() => import("@/components/NewProducts"), { ssr: false });
const CategorySection = dynamic(() => import("@/components/CategorySection"), { ssr: false });

export default function HomePage({ featuredProducts, newProducts, wishedNewProducts, categoriesWithProducts }) {
  return (
    <div>
      <Header />
      <HeroBanner />
      <CategoryNav />
      <FeaturedSlider products={featuredProducts} />
      <ShopByBrand />
      <NewProducts products={newProducts} wishedProducts={wishedNewProducts} enableCompare={true} />
      {categoriesWithProducts && categoriesWithProducts.map(cat => (
        <CategorySection key={cat._id} {...cat} wishedProducts={cat.wishedProducts} />
      ))}
          </div>
  );
}

export async function getServerSideProps(ctx){
    await mongooseConnect();
    const { Category } = require("@/models/Category");
    // Fetch the three featured product IDs from settings
    const [setting1, setting2, setting3] = await Promise.all([
      Setting.findOne({ name: "featuredProductId1" }),
      Setting.findOne({ name: "featuredProductId2" }),
      Setting.findOne({ name: "featuredProductId3" })
    ]);
    const featuredIds = [setting1?.value, setting2?.value, setting3?.value].filter(Boolean);
    const featuredProducts = featuredIds.length > 0
      ? await Product.find({ _id: { $in: featuredIds } })
      : [];
    // Ensure the order matches the settings
    const featuredProductsOrdered = featuredIds.map(id => featuredProducts.find(p => p._id.toString() === id)).filter(Boolean);

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
            featuredProducts: JSON.parse(JSON.stringify(featuredProductsOrdered)),
            newProducts: JSON.parse(JSON.stringify(newProducts)),
            wishedNewProducts: wishedNewProducts.map(i => i.product.toString()),
            categoriesWithProducts: categoriesWithWished,
        },
    }
}
