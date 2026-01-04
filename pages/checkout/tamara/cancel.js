import Header from '@/components/Header';

export default function TamaraCancel() {
  return (
    <div>
      <Header />
      <div style={{ maxWidth: 520, margin: '40px auto', padding: 16 }}>
        <h2>Payment canceled</h2>
        <p>Your Tamara payment was canceled. You can try again or choose another method.</p>
        <a href="/cart" style={{ color: '#0070f3', textDecoration: 'underline', fontWeight: 600 }}>Back to cart</a>
      </div>
    </div>
  );
}
