import Header from "@/components/Header";

export default function Shop() {
  const description = "Shop information goes here.";
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
