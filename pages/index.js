import Header from "@/components/Header";
import Featured from "@/components/Featured";
import NewProducts from "@/components/NewProducts";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/product";
import {Setting} from "@/models/Setting";
import {getServerSession} from "next-auth";
import {WishedProduct} from "@/models/WishedProduct";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

export default function HomePage({featuredProduct, newProducts, wishedNewProducts}) {
    return (
      <div>
        <Header/>
        <Featured product={featuredProduct}/>
        <NewProducts products={newProducts} wishedProducts={wishedNewProducts} />
      </div>
  );
}
export async function getServerSideProps(ctx){
    await mongooseConnect()
    // Fetch the featured product ID from settings
    const featuredProductSetting = await Setting.findOne({ name: "featuredProductId" });

    let featuredProduct = null;
    if (featuredProductSetting?.value) {
        featuredProduct = await Product.findById(featuredProductSetting.value);
    }

    const newProducts = await Product.find({}, null, {sort: {'_id':-1}, limit: 20});

    const session = await getServerSession(ctx.req, ctx.res, authOptions);
    const userEmail = session?.user?.email || null;

    let wishedNewProducts = [];
    if (userEmail) {
        wishedNewProducts = await WishedProduct.find({
            userEmail,
            product: newProducts.map(p => p._id.toString()),
        });
    }
    return {
        props: {
            featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
            newProducts: JSON.parse(JSON.stringify(newProducts)),
            wishedNewProducts: wishedNewProducts.map(i => i.product.toString()),
        },
    }
}