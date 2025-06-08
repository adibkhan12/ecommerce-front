import React from "react";
import styled from "styled-components";
import Image from "next/image";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.45);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 32px 18px 24px 18px;
  min-width: 320px;
  max-width: 98vw;
  max-height: 90vh;
  overflow-x: auto;
  box-shadow: 0 8px 32px rgba(44,62,80,0.18);
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  th, td {
    border: 1px solid #eee;
    padding: 10px 14px;
    text-align: center;
    font-size: 1rem;
  }
  th {
    background: #f8fafc;
    font-weight: 700;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 18px;
  right: 24px;
  background: #ff9900;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1.3rem;
  cursor: pointer;
  z-index: 2;
  &:hover {
    background: #ffb84d;
    color: #222;
  }
`;

export default function CompareModal({ products, onClose }) {
  if (!products || products.length < 2) return null;
  // Collect all unique property keys
  const allKeys = Array.from(new Set(products.flatMap(p => Object.keys(p.properties || {}))));
  return (
    <ModalOverlay>
      <ModalContent style={{ position: 'relative' }}>
        <CloseButton onClick={onClose} aria-label="Close">&times;</CloseButton>
        <h2 style={{ textAlign: 'center', marginBottom: 18 }}>Compare Products</h2>
        <Table>
          <thead>
            <tr>
              <th>Image</th>
              {products.map(p => (
                <th key={p._id}>
                  {p.images?.[0] && (
                    <Image
                      src={p.images[0]}
                      alt={p.title}
                      width={60}
                      height={60}
                      style={{ maxWidth: 60, maxHeight: 60, objectFit: 'contain' }}
                    />
                  )}
                </th>
              ))}
            </tr>
            <tr>
              <th>Name</th>
              {products.map(p => (
                <td key={p._id}>{p.title}</td>
              ))}
            </tr>
            <tr>
              <th>Price</th>
              {products.map(p => (
                <td key={p._id}>{p.price} AED</td>
              ))}
            </tr>
            {allKeys.map(key => (
              <tr key={key}>
                <th>{key}</th>
                {products.map(p => (
                  <td key={p._id + key}>{p.properties?.[key] || '-'}</td>
                ))}
              </tr>
            ))}
          </thead>
        </Table>
      </ModalContent>
    </ModalOverlay>
  );
}
