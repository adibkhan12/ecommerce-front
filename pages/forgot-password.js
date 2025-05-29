import Header from "@/components/Header";
import Center from "@/components/Center";
import Button from "@/components/Button";
import styled from "styled-components";
import { useState } from "react";
import Link from "next/link";
import { primary } from "@/lib/colors";

const AuthWrapper = styled.div`
  max-width: 400px;
  margin: 60px auto;
  padding: 40px 32px 32px 32px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 24px 0 rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  gap: 28px;
  align-items: center;
  position: relative;
`;

const Title = styled.h2`
  margin-top: 24px;
  font-size: 1.7rem;
  font-weight: 700;
  color: #222;
  text-align: center;
  letter-spacing: 0.5px;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
`;

const StyledForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 10px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
`;

const StyledLabel = styled.label`
  font-size: 1rem;
  color: #444;
  margin-bottom: 2px;
  font-weight: 500;
  letter-spacing: 0.01em;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1.5px solid #e0e3e8;
  background: #fafbfc;
  font-size: 1rem;
  color: #222;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s, background 0.2s;
  box-shadow: 0 1px 2px rgba(180,185,190,0.04);

  &:focus {
      border-color: ${primary};
      background: #fff;
      box-shadow: 0 2px 8px rgba(116,13,194,0.07);
  }

  &:hover:not(:focus) {
      border-color: #bfc2c7;
      background: #f5f6fa;
  }
`;

const ErrorMsg = styled.div`
  color: #e53935;
  font-size: 0.97rem;
  margin-bottom: -8px;
  margin-top: -6px;
  text-align: left;
  min-height: 22px;
`;

const SuccessMsg = styled.div`
  color: #388e3c;
  font-size: 1rem;
  background: #e6fee6;
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 10px;
  margin-top: 8px;
  text-align: center;
`;

const BottomText = styled.div`
  width: 100%;
  text-align: center;
  color: #555;
  font-size: 1rem;
`;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSent(false);
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email })
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Something went wrong.");
      } else {
        setSent(true);
      }
    } catch (e) {
      setError("Network error, please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <Center>
        <AuthWrapper>
          <Title>Forgot Password</Title>
          {sent && (
            <SuccessMsg>
              If this email is registered, you will receive a password reset link within a few minutes.
            </SuccessMsg>
          )}
          <StyledForm onSubmit={handleSubmit}>
            <FieldGroup>
              <StyledLabel htmlFor="email">Email</StyledLabel>
              <InputWrapper>
                <StyledInput
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={loading || sent}
                    autoComplete="email"
                />
              </InputWrapper>
            </FieldGroup>
            <ErrorMsg>{error}</ErrorMsg>
            <Button type="submit" block style={{ marginTop: 8, fontSize: "1.08rem" }} disabled={loading || sent}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </StyledForm>
          <BottomText>
            <Link href="/signin">Back to Sign In</Link>
          </BottomText>
        </AuthWrapper>
      </Center>
    </>
  );
}

