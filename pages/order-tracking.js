import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import styled from "styled-components";
import Header from "@/components/Header";
import Center from "@/components/Center";
import { FaCheckCircle, FaShippingFast, FaBoxOpen, FaCreditCard, FaTimesCircle } from "react-icons/fa";

const Bg = styled.div`
  min-height: 100vh;
  background: linear-gradient(120deg, #f8fafc 0%, #e0e7ef 100%);
  padding-bottom: 60px;
`;
const TrackingBox = styled.div`
  max-width: 600px;
  margin: 48px auto 0 auto;
  background: rgba(255,255,255,0.85);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(44,62,80,0.13);
  padding: 38px 32px 32px 32px;
  backdrop-filter: blur(2.5px);
`;
const OrderList = styled.ul`
  list-style: none;
  padding: 0;
`;
const OrderItem = styled.li`
  background: rgba(255,255,255,0.95);
  border-radius: 18px;
  margin-bottom: 28px;
  padding: 28px 22px 18px 22px;
  box-shadow: 0 2px 12px rgba(44,62,80,0.10);
  position: relative;
`;
const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 14px;
  border-radius: 12px;
  font-size: 1em;
  font-weight: 700;
  color: #fff;
  background: ${({ status }) =>
    status === 'Paid' || status === 'paid' ? '#28a745' :
    status === 'Unpaid' || status === 'unpaid' ? '#e53e3e' :
    status === 'Delivered' ? '#0070f3' :
    status === 'Shipped' ? '#ff9900' :
    '#888'};
  margin-left: 8px;
`;
const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin: 18px 0 18px 0;
`;
const ProgressStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ active }) => (active ? '#ff9900' : '#bbb')};
  font-weight: ${({ active }) => (active ? 700 : 500)};
  font-size: 0.98em;
`;
const ProgressDot = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${({ active }) => (active ? '#ff9900' : '#eee')};
  border: 2px solid ${({ active }) => (active ? '#ff9900' : '#ccc')};
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 18px;
  margin-top: 16px;
`;
const ProductCard = styled.div`
  background: rgba(248,250,252,0.98);
  border-radius: 14px;
  box-shadow: 0 1px 8px rgba(44,62,80,0.08);
  padding: 14px 10px 16px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  transition: box-shadow 0.2s, transform 0.2s;
  &:hover {
    box-shadow: 0 4px 18px rgba(44,62,80,0.16);
    transform: translateY(-2px) scale(1.03);
  }
`;
const ProductImg = styled.img`
  width: 72px;
  height: 72px;
  object-fit: contain;
  border-radius: 10px;
  margin-bottom: 10px;
  background: #f3f3f3;
`;
// Add loading="lazy" to all usages of ProductImg below
const ProductName = styled.div`
  font-weight: 700;
  font-size: 1.08rem;
  margin-bottom: 2px;
  text-align: center;
`;
const ProductMeta = styled.div`
  color: #888;
  font-size: 1.01rem;
  margin-bottom: 2px;
`;
const Label = styled.label`
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
`;
const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
  margin-bottom: 18px;
  font-size: 1.08rem;
`;
const Button = styled.button`
  width: 100%;
  padding: 14px 0;
  background: linear-gradient(90deg, #ff9900 0%, #ffb84d 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 800;
  font-size: 1.13rem;
  margin-top: 8px;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(255,153,0,0.10);
  letter-spacing: 0.5px;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  &:hover {
    background: linear-gradient(90deg, #ffb84d 0%, #ff9900 100%);
    color: #222;
    box-shadow: 0 4px 18px rgba(255,153,0,0.18);
  }
`;

function getOrderProgress(status) {
  // You can expand this logic for more granular statuses
  if (!status) return 0;
  if (status.toLowerCase() === 'placed') return 1;
  if (status.toLowerCase() === 'shipped') return 2;
  if (status.toLowerCase() === 'delivered') return 3;
  return 1;
}

export default function OrderTracking() {
  const { data: session } = useSession();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchUserOrders() {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/orders");
      setOrders(res.data);
    } catch (e) {
      setError("Could not fetch your orders.");
    }
    setLoading(false);
  }

  async function fetchOrderById(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await axios.get(`/api/orders?orderId=${orderId}&email=${email}`);
      setOrder(res.data);
    } catch (e) {
      setError("Order not found. Please check your details.");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (session?.user?.email) fetchUserOrders();
  }, [session]);

  const progressSteps = [
    { label: "Placed", icon: <FaCheckCircle /> },
    { label: "Shipped", icon: <FaShippingFast /> },
    { label: "Delivered", icon: <FaBoxOpen /> },
  ];

  return (
    <Bg>
      <Header />
      <Center>
        <TrackingBox>
          <h2 style={{ fontWeight: 900, fontSize: '2rem', marginBottom: 18, letterSpacing: 0.5 }}>Order Tracking</h2>
          {session?.user?.email ? (
            <>
              <p style={{ color: '#444', marginBottom: 18 }}>Here are your recent orders:</p>
              {loading && <p>Loading...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <OrderList>
                {orders.length === 0 && !loading && <li>No orders found.</li>}
                {orders.map(order => (
                  <OrderItem key={order._id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span><b>Order ID:</b> {order._id}</span>
                      <StatusBadge status={order.status}>{order.status || 'N/A'}</StatusBadge>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <b>Date:</b> {new Date(order.createdAt).toLocaleString()}
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <b>Payment:</b> <StatusBadge status={order.paid ? 'Paid' : 'Unpaid'}>{order.paid ? <FaCreditCard style={{ marginRight: 4 }} /> : <FaTimesCircle style={{ marginRight: 4 }} />}{order.paid ? 'Paid' : 'Unpaid'}</StatusBadge>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <b>Total:</b> {order.total || (Array.isArray(order.line_items) && order.line_items.length > 0
                        ? `${(
                            order.line_items.reduce((sum, item) => {
                              const unit = item?.price_data?.unit_amount || 0;
                              const qty = item?.quantity || 0;
                              return sum + unit * qty;
                            }, 0) / 100
                          ).toLocaleString(undefined, { minimumFractionDigits: 2 })} AED`
                        : 'N/A')}
                    </div>
                    <div style={{ margin: '10px 0' }}>
                      <b>Shipping Address:</b>
                      <div style={{ marginLeft: 8 }}>
                        {order.name} <span style={{ color: '#888', fontSize: '0.95em' }}>({order.email})</span><br />
                        {order.addressLine1} {order.addressLine2}<br />
                        {order.city} {order.postalCode}<br />
                        {order.country}
                      </div>
                    </div>
                    <ProgressBar>
                      {progressSteps.map((step, idx) => (
                        <ProgressStep key={step.label} active={getOrderProgress(order.status) >= idx + 1}>
                          <ProgressDot active={getOrderProgress(order.status) >= idx + 1}>{step.icon}</ProgressDot>
                          {step.label}
                        </ProgressStep>
                      ))}
                    </ProgressBar>
                    <div>
                      <b>Products:</b>
                      <ProductGrid>
                        {Array.isArray(order.line_items) && order.line_items.length > 0 ? (
                          order.line_items.map((item, idx) => {
                            const img = item?.price_data?.product_data?.images?.[0];
                            return (
                              <ProductCard key={idx}>
                                {img && <ProductImg src={img} alt={item?.price_data?.product_data?.name || 'Product'} loading="lazy" />}
                                <ProductName>{item?.price_data?.product_data?.name || 'Product'}</ProductName>
                                <ProductMeta>Qty: {item?.quantity || 1}</ProductMeta>
                                {item?.price_data?.unit_amount && (
                                  <ProductMeta>{(item.price_data.unit_amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })} AED</ProductMeta>
                                )}
                              </ProductCard>
                            );
                          })
                        ) : (
                          <div style={{ color: '#888', padding: 8 }}>No products</div>
                        )}
                      </ProductGrid>
                    </div>
                  </OrderItem>
                ))}
              </OrderList>
            </>
          ) : (
            <form onSubmit={fetchOrderById}>
              <Label>Order ID</Label>
              <Input value={orderId} onChange={e => setOrderId(e.target.value)} required />
              <Label>Email</Label>
              <Input value={email} onChange={e => setEmail(e.target.value)} required type="email" />
              <Button type="submit">Track Order</Button>
              {loading && <p>Loading...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {order && (
                <OrderItem>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span><b>Order ID:</b> {order._id}</span>
                    <StatusBadge status={order.status}>{order.status || 'N/A'}</StatusBadge>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <b>Date:</b> {new Date(order.createdAt).toLocaleString()}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <b>Payment:</b> <StatusBadge status={order.paid ? 'Paid' : 'Unpaid'}>{order.paid ? <FaCreditCard style={{ marginRight: 4 }} /> : <FaTimesCircle style={{ marginRight: 4 }} />}{order.paid ? 'Paid' : 'Unpaid'}</StatusBadge>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <b>Total:</b> {order.total || (Array.isArray(order.line_items) && order.line_items.length > 0
                      ? `${(
                          order.line_items.reduce((sum, item) => {
                            const unit = item?.price_data?.unit_amount || 0;
                            const qty = item?.quantity || 0;
                            return sum + unit * qty;
                          }, 0) / 100
                        ).toLocaleString(undefined, { minimumFractionDigits: 2 })} AED`
                      : 'N/A')}
                  </div>
                  <div style={{ margin: '10px 0' }}>
                    <b>Shipping Address:</b>
                    <div style={{ marginLeft: 8 }}>
                      {order.name} <span style={{ color: '#888', fontSize: '0.95em' }}>({order.email})</span><br />
                      {order.addressLine1} {order.addressLine2}<br />
                      {order.city} {order.postalCode}<br />
                      {order.country}
                    </div>
                  </div>
                  <ProgressBar>
                    {progressSteps.map((step, idx) => (
                      <ProgressStep key={step.label} active={getOrderProgress(order.status) >= idx + 1}>
                        <ProgressDot active={getOrderProgress(order.status) >= idx + 1}>{step.icon}</ProgressDot>
                        {step.label}
                      </ProgressStep>
                    ))}
                  </ProgressBar>
                  <div>
                    <b>Products:</b>
                    <ProductGrid>
                      {Array.isArray(order.line_items) && order.line_items.length > 0 ? (
                        order.line_items.map((item, idx) => {
                          const img = item?.price_data?.product_data?.images?.[0];
                          return (
                            <ProductCard key={idx}>
                              {img && <ProductImg src={img} alt={item?.price_data?.product_data?.name || 'Product'} loading="lazy" />}
                              <ProductName>{item?.price_data?.product_data?.name || 'Product'}</ProductName>
                              <ProductMeta>Qty: {item?.quantity || 1}</ProductMeta>
                              {item?.price_data?.unit_amount && (
                                <ProductMeta>{(item.price_data.unit_amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })} AED</ProductMeta>
                              )}
                            </ProductCard>
                          );
                        })
                      ) : (
                        <div style={{ color: '#888', padding: 8 }}>No products</div>
                      )}
                    </ProductGrid>
                  </div>
                </OrderItem>
              )}
            </form>
          )}
        </TrackingBox>
      </Center>
    </Bg>
  );
}
