import Header from "@/components/Header";

export default function Support() {
  const description = "Support information goes here.";
  return (
    <>
      <Header/>
      <div style={{padding: "2rem"}}>
        <h1>Support</h1>
        <p>{description}</p>
      </div>
    </>
  );
}
