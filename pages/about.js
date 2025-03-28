import { QuickLinks } from '@/models/QuickLinks';
import {mongooseConnect} from "@/lib/mongoose";
import Header from "@/components/Header";

export async function getServerSideProps() {
  await mongooseConnect();
  const quicklinks = await QuickLinks.findOne();
  if (!quicklinks) return { notFound: true };
  return { props: { description: quicklinks.about.description } };
}

export default function About({ description }) {
  return (
      <>
          <Header />
          <div style={{ padding: "2rem" }}>
              <h1>About Us</h1>
              <p>{description}</p>
          </div>
      </>
  );
}
