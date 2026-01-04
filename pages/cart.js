import Header from "@/components/Header";
import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import { FaLock, FaChevronLeft, FaMapMarkerAlt, FaUser, FaEnvelope, FaPhone, FaCity, FaFlag, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';

const PageBg = styled.div`
  min-height: 100vh;
  background: #f6f7fb;
  padding-bottom: 80px;
`;

const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 auto 18px auto;
  max-width: 420px;
  font-size: 0.98rem;
  color: #888;
  user-select: none;
  span {
    font-weight: 600;
    color: #0070f3;
  }
`;

const Main = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 0 8px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(60,60,130,0.10);
  padding: 22px 18px 18px 18px;
  margin-bottom: 18px;
`;

const SectionTitle = styled.h2`
  font-size: 1.18rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CartList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ClearCartLink = styled.a`
  color: #0070f3;
  font-weight: 600;
  font-size: 1rem;
  margin-left: auto;
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: #ff4500;
  }
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 10px 8px;
`;

const ProductImage = styled.img`
  border-radius: 10px;
  background: #fff;
`;

const QtyButton = styled.button`
  font-size: 1.1rem;
  padding: 4px 14px;
  border-radius: 6px;
  background: #f3f4f6;
  color: #222;
  border: 1px solid #e5e7eb;
  margin: 0 4px;
  cursor: pointer;
  &:hover {
    background: #0070f3;
    color: #fff;
    border-color: #0070f3;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 13px 14px 13px 38px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  font-size: 1rem;
  margin: 8px 0 0 0;
  outline: none;
  transition: border 0.2s;
  box-sizing: border-box;
  &:focus {
    border-color: #0070f3;
  }
`;

const InputIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #bbb;
  font-size: 1.1rem;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 10px;
`;

const PaymentOptions = styled.div`
  margin: 18px 0 8px 0;
  label {
    margin-right: 18px;
    font-weight: 500;
    font-size: 1rem;
    display: inline-flex;
    align-items: center;
    opacity: 1;
    color: #333;
    cursor: pointer;
    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    &.active {
      font-weight: 700;
      color: #0070f3;
    }
    input {
      margin-right: 8px;
    }
    svg {
      margin-right: 4px;
    }
  }
`;

const TrustRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0 0 0;
  color: #28a745;
  font-size: 1.01rem;
  font-weight: 500;
`;

const StickySummary = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  box-shadow: 0 -2px 16px rgba(0,0,0,0.08);
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  padding: 18px 16px 12px 16px;
  z-index: 100;
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  @media (min-width: 600px) {
    max-width: 480px;
  }
`;

const PlaceOrderBtn = styled.button`
  width: 100%;
  padding: 16px 0;
  background: linear-gradient(90deg, #0070f3 0%, #0059c1 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1.1rem;
  margin-top: 10px;
  box-shadow: 0 2px 12px rgba(0,112,243,0.08);
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: background 0.2s;
  &:hover {
    background: linear-gradient(90deg, #0059c1 0%, #0070f3 100%);
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
`;

const BackLink = styled.a`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #0070f3;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 18px;
  text-decoration: none;
  cursor: pointer;
`;

const SuccessMessage = styled.div`
  font-size: 1.6rem;
  text-align: center;
  color: #28a745;
  margin-top: 20px;
`;

export default function CartPage() {
  const { cart, addProduct, removeProduct, clearCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [referralSource, setReferralSource] = useState("");
  const [referralOther, setReferralOther] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (cart.items && cart.items.length > 0) {
      const ids = cart.items.map(item => item.product);
      axios.post("/api/products", { ids })
        .then((response) => {
          const fetchedProducts = response.data;
          const filteredProducts = fetchedProducts.filter(product => {
            const cartItem = cart.items.find(item => String(item.product) === String(product._id));
            return cartItem && cartItem.quantity > 0;
          });
          setProducts(filteredProducts);
        })
        .catch((error) => {
          console.error("Error fetching product details", error);
        });
    } else {
      setProducts([]);
    }
  }, [cart]);

  useEffect(() => {
    if (isClient && window.location.href.includes("success")) {
      clearCart();
    }
    axios.get('/api/address')
      .then((response) => {
        setName(response.data.name || "");
        setEmail(response.data.email || "");
        setAddressLine1(response.data.addressLine1 || "");
        setAddressLine2(response.data.addressLine2 || "");
        setNumber(response.data.number || "");
        setCity(response.data.city || "");
        setCountry(response.data.country || "");
        setPostalCode(response.data.postalCode || "");
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.warn("User not logged in. Proceeding without address details.");
        } else {
          console.error("Error fetching address:", error);
        }
      });
  }, [isClient]);

  function moreOfThisProduct(id) {
    addProduct(id);
  }

  function lessOfThisProduct(id) {
    removeProduct(id);
  }

  function validateForm() {
    if (!name || !email || !city || !postalCode || !addressLine1 || !number || !country) {
      alert("Please fill in all required fields.");
      return false;
    }
    if (!referralSource || (referralSource === "Other" && !referralOther)) {
      alert("Please tell us where you heard about us.");
      return false;
    }
    return true;
  }

  async function placeOrderCOD() {
    if (!validateForm()) return;
    try {
      const response = await axios.post("/api/checkout", {
        name,
        email,
        city,
        postalCode,
        addressLine1,
        addressLine2,
        number,
        country,
        cartProducts: cart.items,
        paymentMethod: "COD",
        referralSource,
        referralOther
      });
      if (response.status === 200) {
        clearCart();
        window.location.href = "/cart?success=1";
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      alert("Error occurred while placing the order.");
    }
  }

  async function placeOrderBNPL(method) {
    if (!validateForm()) return;
    try {
      const response = await axios.post('/api/checkout', {
        name,
        email,
        city,
        postalCode,
        addressLine1,
        addressLine2,
        number,
        country,
        cartProducts: cart.items,
        paymentMethod: method,
        referralSource,
        referralOther,
      });
      if (response.status === 200 && response.data?.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      } else {
        alert('Failed to start payment.');
      }
    } catch (e) {
      alert('Payment error. Please try another method.');
    }
  }

  function placeOrder() {
    if (paymentMethod === 'COD') return placeOrderCOD();
    if (paymentMethod === 'tamara') return placeOrderBNPL('tamara');
    if (paymentMethod === 'tabby') return placeOrderBNPL('tabby');
  }

  let total = 0;
  products.forEach(product => {
    const cartItem = cart.items.find(item => String(item.product) === String(product._id));
    if (cartItem) {
      total += (cartItem.quantity * product.price);
    }
  });

  if (isClient && window.location.href.includes("success")) {
    return (
      <PageBg>
        <Header />
        <Main>
          <Card style={{ marginTop: 32 }}>
            <SectionTitle><FaLock /> Order Placed Successfully</SectionTitle>
            <SuccessMessage>
              Soon you will get confirmation message via email or WhatsApp
            </SuccessMessage>
            <p style={{ textAlign: 'center', marginTop: 18 }}>THANK YOU FOR SHOPPING WITH US!</p>
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <a href="/order-tracking" style={{ color: '#0070f3', fontWeight: 600, textDecoration: 'underline', fontSize: '1.08rem' }}>
                Track your order here
              </a>
            </div>
          </Card>
        </Main>
      </PageBg>
    );
  }

  return (
    <PageBg>
      <Header />
      <Main>
        <BackLink href="/"><FaChevronLeft /> Back to Shop</BackLink>
        <ProgressBar>
          <span>Cart</span> &gt; Delivery &gt; Payment &gt; Review
        </ProgressBar>
        <Card>
          <SectionTitle><FaLock /> Secure Checkout</SectionTitle>
          <TrustRow><FaLock /> 100% Secure &amp; Encrypted</TrustRow>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <SectionTitle>Cart Items</SectionTitle>
            {cart.items && cart.items.length > 0 && (
              <ClearCartLink onClick={clearCart}>Clear Cart</ClearCartLink>
            )}
          </div>
          {(!cart.items || cart.items.length === 0) && (
            <div><p>Your cart is empty</p></div>
          )}
          {products.length > 0 && (
            <CartList>
              {products.map((product, index) => {
                if (!product) {
                  return (
                    <div key={product?._id || idx} style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
                      This product is no longer available.
                    </div>
                  );
                }
                const cartItem = cart.items.find(
                  (item) => String(item.product) === String(product._id)
                );
                const quantity = cartItem ? cartItem.quantity : 0;
                return (
                  <CartItem key={product._id}>
                    <ProductImage
                      src={product.images[0]}
                      alt={product.title}
                      width={54}
                      height={54}
                      style={{ objectFit: "contain" }}
                      loading="lazy"
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 2 }}>{product.title}</div>
                      <div style={{ color: '#888', fontSize: '0.97rem' }}>{quantity} x {product.price} AED</div>
                    </div>
                    <QtyButton onClick={() => lessOfThisProduct(product._id)}>-</QtyButton>
                    <span style={{ margin: '0 8px', fontWeight: 600 }}>{quantity}</span>
                    <QtyButton onClick={() => moreOfThisProduct(product._id)}>+</QtyButton>
                  </CartItem>
                );
              })}
            </CartList>
          )}
        </Card>
        <div style={{ textAlign: 'center', margin: '18px 0 24px 0' }}>
          <a href="/order-tracking" style={{ color: '#0070f3', fontWeight: 600, textDecoration: 'underline', fontSize: '1.08rem' }}>
            Track your order
          </a>
        </div>
        <Card>
          <SectionTitle><FaMapMarkerAlt /> Delivery Details</SectionTitle>
          <form onSubmit={e => { e.preventDefault(); placeOrder(); }} autoComplete="on">
            <InputGroup>
              <InputIcon><FaUser /></InputIcon>
              <StyledInput
                type="text"
                placeholder="Name"
                value={name}
                name="name"
                onChange={ev => setName(ev.target.value)}
                autoComplete="name"
              />
            </InputGroup>
            <InputGroup>
              <InputIcon><FaEnvelope /></InputIcon>
              <StyledInput
                type="email"
                placeholder="Email"
                value={email}
                name="email"
                onChange={ev => setEmail(ev.target.value)}
                autoComplete="email"
              />
            </InputGroup>
            <InputGroup>
              <InputIcon><FaMapMarkerAlt /></InputIcon>
              <StyledInput
                type="text"
                placeholder="Address line 1"
                value={addressLine1}
                name="addressLine1"
                onChange={ev => setAddressLine1(ev.target.value)}
                autoComplete="address-line1"
              />
            </InputGroup>
            <InputGroup>
              <InputIcon><FaMapMarkerAlt /></InputIcon>
              <StyledInput
                type="text"
                placeholder="Address line 2"
                value={addressLine2}
                name="addressLine2"
                onChange={ev => setAddressLine2(ev.target.value)}
                autoComplete="address-line2"
              />
            </InputGroup>
            <InputGroup>
              <InputIcon><FaPhone /></InputIcon>
              <StyledInput
                type="text"
                placeholder="WhatsApp number"
                value={number}
                name="number"
                onChange={ev => setNumber(ev.target.value)}
                autoComplete="tel"
              />
            </InputGroup>
            <InputGroup>
              <InputIcon><FaCity /></InputIcon>
              <StyledInput
                type="text"
                placeholder="City"
                value={city}
                name="city"
                onChange={ev => setCity(ev.target.value)}
                autoComplete="address-level2"
              />
            </InputGroup>
            <InputGroup>
              <InputIcon><FaFlag /></InputIcon>
              <StyledInput
                type="text"
                placeholder="Postal Code"
                value={postalCode}
                name="postalCode"
                onChange={ev => setPostalCode(ev.target.value)}
                autoComplete="postal-code"
              />
            </InputGroup>
            <InputGroup>
              <InputIcon><FaFlag /></InputIcon>
              <StyledInput
                type="text"
                placeholder="Country"
                value={country}
                name="country"
                onChange={ev => setCountry(ev.target.value)}
                autoComplete="country"
              />
            </InputGroup>
            <FieldGroup>
              <label htmlFor="referralSource" style={{ fontWeight: 500, color: '#444', marginBottom: 4 }}>Where did you hear about us?</label>
              <select
                id="referralSource"
                name="referralSource"
                value={referralSource}
                onChange={e => setReferralSource(e.target.value)}
                style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #e0e3e8', fontSize: '1rem', marginBottom: 8 }}
                required
                disabled={false}
              >
                <option value="">Select an option</option>
                <option value="Google Search">Google Search</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="Friend/Family">Friend/Family</option>
                <option value="Other">Other</option>
              </select>
              {referralSource === "Other" && (
                <StyledInput
                  name="referralOther"
                  type="text"
                  placeholder="Please specify"
                  value={referralOther}
                  onChange={e => setReferralOther(e.target.value)}
                  style={{ marginTop: 8 }}
                />
              )}
            </FieldGroup>
            <PaymentOptions>
              <label className={paymentMethod === 'COD' ? 'active' : ''}><FaMoneyBillWave />
                <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                Cash on Delivery
              </label>
              <label className={paymentMethod === 'tamara' ? 'active' : ''}><FaCreditCard />
                <input type="radio" name="payment" value="tamara" checked={paymentMethod === 'tamara'} onChange={() => setPaymentMethod('tamara')} />
                Tamara (Pay in installments)
              </label>
              <label className={paymentMethod === 'tabby' ? 'active' : ''}><FaCreditCard />
                <input type="radio" name="payment" value="tabby" checked={paymentMethod === 'tabby'} onChange={() => setPaymentMethod('tabby')} />
                Tabby (Pay later)
              </label>
            </PaymentOptions>
            <div style={{ height: 70 }} />
          </form>
        </Card>
        {/* Sticky summary for mobile */}
        {products.length > 0 && (
          <StickySummary>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: '1.13rem' }}>
              <span>Total</span>
              <span style={{ color: '#0070f3', fontWeight: 700 }}>AED {total}</span>
            </div>
            <PlaceOrderBtn onClick={placeOrder}>Place Order</PlaceOrderBtn>
          </StickySummary>
        )}
      </Main>
    </PageBg>
  );
}
