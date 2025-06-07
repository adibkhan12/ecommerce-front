import React, { useContext, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Header from "@/components/Header";
import Center from "@/components/Center";
import Title from "@/components/Title";
import ProductImages from "@/components/ProductImages";
import CartIcon from "@/components/icons/CartIcon";
import WhiteBox from "@/components/Box";
import Button from "@/components/Button";
import ProductsGrid from "@/components/ProductsGrid";
import { CartContext } from "@/components/CartContext";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";

const ColsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 36px;
  margin: 40px 0;
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
  @media screen and (min-width: 900px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 48px;
    max-width: 1200px;
  }
  @media screen and (max-width: 900px) {
    padding: 0 4px;
    max-width: 100vw;
  }
`;

const PriceRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
    margin-top: 20px;

    @media screen and (min-width: 768px) {
        gap: 40px;
    }
`;

const Price = styled.span`
    font-size: 1.8rem;
    font-weight: bold;
    color: #333;
    background: linear-gradient(to right, #ff8c00, #ff4500);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    @media screen and (min-width: 768px) {
        font-size: 2rem;
    }
`;

const ProductDetails = styled.div`
  background: #fff;
  border-radius: 18px;
  padding: 36px 32px 32px 32px;
  box-shadow: 0 6px 32px rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 320px;
  max-width: 100%;
  overflow: hidden;
  @media screen and (max-width: 900px) {
    min-width: 0;
    padding: 24px 10px 18px 10px;
  }
`;

const ProductDescription = styled.p`
    color: #444;
    font-size: 1.13rem;
    line-height: 1.7;
    margin: 18px 0 0 0;
    background: #f9f9f9;
    border-radius: 8px;
    padding: 18px 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    @media screen and (min-width: 768px) {
        font-size: 1.18rem;
    }
`;

const StyledButton = styled(Button)`
    background: linear-gradient(to right, #ff7f50, #ff4500);
    color: #fff;
    font-weight: bold;
    font-size: 1rem;
    padding: 10px 20px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    gap: 10px;

    &:hover {
        background: linear-gradient(to right, #ff4500, #ff7f50);
        box-shadow: 0 2px 10px rgba(255, 69, 0, 0.5);
    }

    @media screen and (min-width: 768px) {
        font-size: 1.2rem;
    }
`;

const ImageBox = styled(WhiteBox)`
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    overflow: hidden;

    img {
        max-width: 100%;
        max-height: 400px;
        object-fit: contain;
        border-radius: 10px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    &:hover img {
        transform: scale(1.05);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    @media screen and (min-width: 768px) {
        padding: 30px;
    }
`;

const TabsWrapper = styled.div`
  display: flex;
  gap: 0;
  margin: 18px 0 0 0;
  border-bottom: 2px solid #f0f0f0;
  max-width: 100%;
  overflow-x: auto;
  @media (max-width: 600px) {
    width: 100vw;
    margin-left: -8px;
    margin-right: -8px;
    min-width: 0;
    flex-wrap: nowrap;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  @media (max-width: 600px) {
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
const Tab = styled.button`
  background: none;
  border: none;
  font-size: 1.13rem;
  font-weight: 700;
  color: ${({ active }) => (active ? '#ff9900' : '#888')};
  border-bottom: 3px solid ${({ active }) => (active ? '#ff9900' : 'transparent')};
  padding: 12px 24px 10px 24px;
  cursor: pointer;
  transition: color 0.2s, border-bottom 0.2s;
  outline: none;
  @media (max-width: 600px) {
    display: inline-block;
    min-width: 120px;
    max-width: 200px;
    flex: none;
    padding: 10px 12px 8px 12px;
    font-size: 0.98rem;
    text-align: center;
    box-sizing: border-box;
    white-space: normal;
  }
  @media (min-width: 601px) and (max-width: 900px) {
    padding: 12px 16px 10px 16px;
    font-size: 1.05rem;
  }
`;
const TabPanel = styled.div`
  padding: 18px 0 0 0;
  max-width: 100%;
  box-sizing: border-box;
  word-break: break-word;
  overflow-wrap: break-word;
  overflow-x: auto;
  @media (max-width: 600px) {
    padding: 12px 2px 0 2px;
  }
`;

export default function ProductPage({ product, relatedProducts = [] }) {
    const { addProduct } = useContext(CartContext);
    const [tab, setTab] = useState('description');
    // Delivery estimate: 2-4 days from now (client-only to avoid hydration mismatch)
    const [deliveryEstimate, setDeliveryEstimate] = useState("");
    useEffect(() => {
      const d = new Date();
      d.setDate(d.getDate() + 2 + Math.floor(Math.random()*3));
      setDeliveryEstimate(d.toLocaleDateString());
    }, []);

    return (
        <>
            <Header />
            <Center>
                <ColsWrapper>
                    <ImageBox>
                        <ProductImages images={product.images} />
                    </ImageBox>
                    <ProductDetails>
                        <Title style={{
                          fontSize: '2.5rem',
                          fontWeight: 800,
                          color: '#222',
                          marginBottom: 8,
                          letterSpacing: '0.5px',
                          background: 'linear-gradient(90deg, #ff9900 0%, #ff4500 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}>{product.title}</Title>
                        <TabsWrapper>
                          <Tab active={tab==='description'} onClick={()=>setTab('description')}>Description</Tab>
                          <Tab active={tab==='specs'} onClick={()=>setTab('specs')}>Specifications</Tab>
                          <Tab active={tab==='reviews'} onClick={()=>setTab('reviews')}>Reviews</Tab>
                          <Tab active={tab==='qa'} onClick={()=>setTab('qa')}>Q&amp;A</Tab>
                        </TabsWrapper>
                        <TabPanel>
                          {tab==='description' && (
                            <ProductDescription dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }} />
                          )}
                          {tab==='specs' && product.properties && (
                            <div style={{ margin: '10px 0 18px 0' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.05rem' }}>
                                <tbody>
                                  {Object.entries(product.properties).map(([key, value]) => (
                                    <tr key={key}>
                                      <td style={{ fontWeight: 600, color: '#ff9900', padding: '8px 12px', background: '#fff7e6', border: '1px solid #f0f0f0' }}>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                                      <td style={{ color: '#333', padding: '8px 12px', border: '1px solid #f0f0f0' }}>{value}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                          {tab==='reviews' && (
                            <ReviewsTab productId={product._id} />
                          )}
                          {tab==='qa' && (
                            <QATab productId={product._id} />
                          )}
                        </TabPanel>
                        <hr style={{ border: 0, borderTop: '1.5px solid #f0f0f0', margin: '18px 0 0 0' }} />
                        <PriceRow>
                            <Price>AED {product.price}</Price>
                            {product.stock === 0 ? (
                              <span style={{ color: 'red', fontWeight: 600, fontSize: '1.13rem', marginTop: 18 }}>
                                Out of Stock
                              </span>
                            ) : (
                              <StyledButton onClick={() => addProduct(product._id)} primary={1} outline={1} style={{
                                minWidth: 180,
                                fontSize: '1.13rem',
                                fontWeight: 700,
                                background: 'linear-gradient(90deg, #ff9900 0%, #ff4500 100%)',
                                color: '#fff',
                                border: 'none',
                                boxShadow: '0 2px 8px rgba(255,153,0,0.10)',
                                marginTop: 18,
                              }}>
                                <CartIcon />
                                Add to Cart
                              </StyledButton>
                            )}
                        </PriceRow>
                        <div style={{ color: '#4caf50', fontWeight: 600, fontSize: '1.08rem', marginTop: 8 }}>
                          {product.stock === 0 ? 'Currently unavailable' : deliveryEstimate ? `Delivery by: ${deliveryEstimate}` : ''}
                        </div>
                        <div style={{ display: 'flex', gap: 24, marginTop: 18, alignItems: 'center', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <img src="https://img.icons8.com/ios-filled/50/lock--v1.png" alt="Secure Payment" style={{ width: 28, height: 28 }} />
                          <span style={{ color: '#222', fontWeight: 600 }}>Secure Payment</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <img src="https://img.icons8.com/ios-filled/50/return-purchase.png" alt="Easy Returns" style={{ width: 28, height: 28 }} />
                          <span style={{ color: '#222', fontWeight: 600 }}>Easy Returns</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <img src="https://img.icons8.com/ios-filled/50/guarantee.png" alt="Warranty" style={{ width: 28, height: 28 }} />
                          <span style={{ color: '#222', fontWeight: 600 }}>Warranty</span>
                          </div>
                          <div style={{ marginLeft: 12 }}>
                            <a href="/policies" style={{ color: '#ff9900', fontWeight: 600, textDecoration: 'underline' }}>See all policies</a>
                          </div>
                        </div>
                    </ProductDetails>
                </ColsWrapper>
            </Center>
            {relatedProducts.length > 0 && (
              <Center>
                <div style={{ margin: '48px 0 0 0', width: '100%' }}>
                  <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#222', marginBottom: 18 }}>Related Products</h2>
                  <ProductsGrid products={relatedProducts} enableCompare={true} />
                </div>
              </Center>
            )}
        </>
    );
}

function QATab({ productId }) {
  const { data: session } = useSession();
  const [qas, setQAs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [answeringId, setAnsweringId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/qa?product=${productId}`).then(res => {
      setQAs(res.data);
      setLoading(false);
    });
  }, [productId]);

  function handleAsk(e) {
    e.preventDefault();
    if (!question) return;
    setSubmitting(true);
    axios.post('/api/qa', {
      product: productId,
      user: session?.user?.email || 'Anonymous',
      question
    }).then(() => {
      setQuestion("");
      axios.get(`/api/qa?product=${productId}`).then(res => setQAs(res.data));
    }).finally(() => setSubmitting(false));
  }

  function handleAnswer(e, id) {
    e.preventDefault();
    if (!answerText) return;
    setSubmitting(true);
    axios.put('/api/qa', { id, answer: answerText }).then(() => {
      setAnswerText("");
      setAnsweringId(null);
      axios.get(`/api/qa?product=${productId}`).then(res => setQAs(res.data));
    }).finally(() => setSubmitting(false));
  }

  return (
    <div style={{ maxWidth: '100%', width: '100%', boxSizing: 'border-box', padding: '0 2px' }}>
      <div style={{ marginBottom: 18, color: '#888', fontWeight: 500 }}>
        {qas.length} question{qas.length !== 1 ? 's' : ''}
      </div>
      {loading ? <div>Loading Q&amp;A...</div> : (
        <div style={{ marginBottom: 24 }}>
          {qas.length === 0 && <div style={{ color: '#888' }}>No questions yet.</div>}
          {qas.map(qa => (
            <div key={qa._id} style={{ borderBottom: '1px solid #eee', marginBottom: 16, paddingBottom: 12, wordBreak: 'break-word', overflowWrap: 'break-word', width: '100%' }}>
              <div style={{ color: '#222', fontWeight: 600, marginBottom: 4 }}>Q: {qa.question}</div>
              {qa.answer ? (
                <div style={{ color: '#4caf50', fontWeight: 600 }}>A: {qa.answer}</div>
              ) : (
                answeringId === qa._id ? (
                  <form onSubmit={e => handleAnswer(e, qa._id)} style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                    <input
                      value={answerText}
                      onChange={e => setAnswerText(e.target.value)}
                      placeholder="Type your answer..."
                      style={{ width: '100%', borderRadius: 6, border: '1px solid #eee', padding: 6, fontSize: '1em' }}
                      required
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="submit" disabled={submitting} style={{ background: '#ff9900', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 18px', fontWeight: 700, fontSize: '1em', cursor: 'pointer', flex: 1 }}>
                        {submitting ? 'Submitting...' : 'Submit'}
                      </button>
                      <button type="button" onClick={() => setAnsweringId(null)} style={{ color: '#888', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>Cancel</button>
                    </div>
                  </form>
                ) : session && (
                  <button onClick={() => setAnsweringId(qa._id)} style={{ color: '#ff9900', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, marginTop: 6 }}>Answer</button>
                )
              )}
              <div style={{ color: '#bbb', fontSize: '0.95em', marginTop: 2 }}>{new Date(qa.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}
      {session ? (
        <form onSubmit={handleAsk} style={{ background: '#f9f9f9', borderRadius: 10, padding: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', maxWidth: '100%', width: '100%' }}>
          <div style={{ marginBottom: 10, fontWeight: 600 }}>Ask a Question</div>
          <input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Type your question..."
            style={{ width: '100%', borderRadius: 6, border: '1px solid #eee', padding: 8, fontSize: '1.05em', marginBottom: 10 }}
            required
          />
          <div>
            <button type="submit" disabled={submitting || !question} style={{ background: '#ff9900', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 700, fontSize: '1.08em', cursor: 'pointer', width: '100%' }}>
              {submitting ? 'Submitting...' : 'Submit Question'}
            </button>
          </div>
        </form>
      ) : (
        <div style={{ color: '#888', fontWeight: 500 }}>Sign in to ask a question.</div>
      )}
    </div>
  );
}

function StarRating({ value, onChange, readOnly = false }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2, fontSize: '1.3em', cursor: readOnly ? 'default' : 'pointer' }}>
      {[1,2,3,4,5].map(star => (
        <span
          key={star}
          style={{ color: star <= value ? '#ff9900' : '#ccc' }}
          onClick={() => !readOnly && onChange && onChange(star)}
        >&#9733;</span>
      ))}
    </span>
  );
}

function ReviewsTab({ productId }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/reviews?product=${productId}`).then(res => {
      setReviews(res.data);
      setLoading(false);
    });
  }, [productId]);

  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : null;

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    const readers = files.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = ev => resolve(ev.target.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(imgs => setImages(imgs));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!rating || !text) return;
    setSubmitting(true);
    axios.post('/api/reviews', {
      product: productId,
      user: session?.user?.email || 'Anonymous',
      rating,
      text,
      images
    }).then(() => {
      setRating(0); setText(""); setImages([]);
      fileInputRef.current.value = "";
      axios.get(`/api/reviews?product=${productId}`).then(res => setReviews(res.data));
    }).finally(() => setSubmitting(false));
  }

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        {avgRating && (
          <span style={{ fontWeight: 700, color: '#ff9900', fontSize: '1.2em', marginRight: 12 }}>
            {avgRating} <StarRating value={Math.round(avgRating)} readOnly />
          </span>
        )}
        <span style={{ color: '#888', fontWeight: 500 }}>
          {reviews.length} review{reviews.length !== 1 ? 's' : ''}
        </span>
      </div>
      {loading ? <div>Loading reviews...</div> : (
        <div style={{ marginBottom: 24 }}>
          {reviews.length === 0 && <div style={{ color: '#888' }}>No reviews yet.</div>}
          {reviews.map(r => (
            <div key={r._id} style={{ borderBottom: '1px solid #eee', marginBottom: 16, paddingBottom: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
              <span style={{ color: '#222', fontWeight: 700, fontSize: '1.08em' }}>{r.user.split('@')[0]}</span>
              <span style={{ color: '#bbb', fontSize: '0.97em' }}>{r.user}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
              <StarRating value={r.rating} readOnly />
              <span style={{ color: '#bbb', fontSize: '0.95em' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              </div>
              <div style={{ margin: '8px 0', color: '#444' }}>{r.text}</div>
              {r.images && r.images.length > 0 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  {r.images.map((img, i) => (
                    <img key={i} src={img} alt="review" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {session ? (
        <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', borderRadius: 10, padding: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ marginBottom: 10, fontWeight: 600 }}>Add a Review</div>
          <div style={{ marginBottom: 10 }}>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={3}
            placeholder="Write your review..."
            style={{ width: '100%', borderRadius: 6, border: '1px solid #eee', padding: 8, fontSize: '1.05em', marginBottom: 10 }}
            required
          />
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ marginBottom: 10 }}
          />
          <div>
            <button type="submit" disabled={submitting || !rating || !text} style={{ background: '#ff9900', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 700, fontSize: '1.08em', cursor: 'pointer' }}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      ) : (
        <div style={{ color: '#888', fontWeight: 500 }}>Sign in to add a review.</div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
    await mongooseConnect();
    const {id} = context.query;
    const product = await Product.findById(id);
    // Fetch related products (same category, exclude self)
    let relatedProducts = [];
    if (product?.category) {
      relatedProducts = await Product.find({
        category: product.category,
        _id: { $ne: product._id }
      }).limit(6);
    }
    return {
        props:{
            product: JSON.parse(JSON.stringify(product)),
            relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
        }
    }
}
