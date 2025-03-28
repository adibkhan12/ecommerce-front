import { mongooseConnect } from '@/lib/mongoose';
import { QuickLinks } from '@/models/QuickLinks';
import Header from "@/components/Header";

export async function getServerSideProps() {
  await mongooseConnect();
  const quicklinks = await QuickLinks.findOne();
  if (!quicklinks) return { notFound: true };
  return { props: { description: quicklinks.shop.description } };
}

export default function Shop({ description }) {
  return (
      <>
          <Header/>
          <div style={{padding: "2rem"}}>
              <h1>Shop</h1>
              <p>{description}</p>
          </div>
      </>
  );
}
