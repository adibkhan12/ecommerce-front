import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';

export default function TamaraSuccess() {
  const router = useRouter();
  const { orderId } = router.query;
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/payment/capture?orderId=${orderId}&provider=tamara`)
      .then(r => r.json())
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [orderId]);

  return (
    <div>
      <Header />
      <div style={{ maxWidth: 520, margin: '40px auto', padding: 16 }}>
        {status === 'processing' && <p>Finalizing your Tamara payment...</p>}
        {status === 'success' && (
          <>
            <h2>Payment successful</h2>
            <p>Your order has been confirmed. Thank you!</p>
            <a href="/cart?success=1" style={{ color: '#0070f3', textDecoration: 'underline', fontWeight: 600 }}>Continue</a>
          </>
        )}
        {status === 'error' && <p>We could not confirm the payment. Please contact support.</p>}
      </div>
    </div>
  );
}
