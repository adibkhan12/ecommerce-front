import Header from "@/components/Header";
import Featured from "@/components/Featured";
import NewProducts from "@/components/NewProducts";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/product";
import {Setting} from "@/models/Setting";

export default function HomePage({featuredProduct, newProducts}) {
    return (
      <div>
        <Header/>
        <Featured product={featuredProduct}/>
        <NewProducts products={newProducts}/>
      </div>
  );
}
export async function getServerSideProps(){
    await mongooseConnect()
    // Fetch the featured product ID from settings
    const featuredProductSetting = await Setting.findOne({ name: "featuredProductId" });

    let featuredProduct = null;
    if (featuredProductSetting?.value) {
        featuredProduct = await Product.findById(featuredProductSetting.value);
    }

    const newProducts = await Product.find({}, null, {sort: {'_id':-1}, limit: 20});
    return {
        props: {
            featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
            newProducts: JSON.parse(JSON.stringify(newProducts)),
        },
    }
}