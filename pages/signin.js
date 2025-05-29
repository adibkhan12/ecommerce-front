import Header from "@/components/Header";
import Center from "@/components/Center";
import Button from "@/components/Button";
import styled from "styled-components";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { primary } from "@/lib/colors";
import SeePassword from "@/components/see-password";

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

const BrandCircle = styled.div`
  background: linear-gradient(135deg, ${primary} 60%, #ff9900 100%);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -32px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 4px 16px rgba(255,153,0,0.12);
`;

const Title = styled.h2`
  margin-top: 40px;
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  text-align: center;
  letter-spacing: 0.5px;
`;

const Divider = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin: 18px 0 8px 0;
  color: #aaa;
  font-size: 0.95rem;
  font-weight: 500;
  gap: 10px;
  &::before, &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #eee;
  }
`;

const StyledForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 4px;
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

const ForgotPasswordLink = styled(Link)`
  text-align: right;
  font-size: 0.99rem;
  color: ${primary};
  font-weight: 500;
  margin-top: 4px;
  margin-bottom: 2px;
  margin-left: auto;
  transition: color 0.15s;
  text-decoration: none;

  &:hover {
    color: #ff9900;
    text-decoration: underline;
  }
`;

const ErrorMsg = styled.div`
  color: #e53935;
  font-size: 0.97rem;
  margin-bottom: -8px;
  margin-top: -6px;
  text-align: left;
  padding-left: 2px;
  min-height: 22px;
  display: flex;
  align-items: center;
  gap: 6px;
  svg {
      width: 18px;
      height: 18px;
      vertical-align: middle;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
`;

const BottomText = styled.div`
  width: 100%;
  text-align: center;
  color: #555;
  font-size: 1rem;
  margin-top: 8px;
`;

const GoogleButton = styled.button`
  width: 100%;
  font-size: 1.1rem;
  padding: 12px 0;
  margin-top: 6px;
  background: linear-gradient(90deg, #e0e3e8 0%, #cfd2d6 100%);
  color: #222;
  border: none;
  border-radius: 7px;
  box-shadow: 0 2px 8px rgba(180, 185, 190, 0.10);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  transition: background 0.2s, box-shadow 0.2s;
  gap: 8px;
  &:hover {
    background: linear-gradient(90deg, #d1d4d9 0%, #bfc2c7 100%);
    box-shadow: 0 4px 16px rgba(180, 185, 190, 0.16);
  }
`;

export default function SignInPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
        // callbackUrl: "/account" // you can use this for redirect too
      });
      if (result.error) {
        setError(result.error === "CredentialsSignin" ? "Invalid email or password." : result.error);
        setLoading(false);
        return;
      }
      // Option 1: reload or redirect so NextAuth session loads everywhere
      router.push("/account");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
      <>
        <Header />
        <Center>
          <AuthWrapper>
            <BrandCircle>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="18" fill="#fff" />
                <text x="50%" y="56%" textAnchor="middle" fill={primary} fontSize="18" fontWeight="bold" fontFamily="Arial" dy=".3em">SA</text>
              </svg>
            </BrandCircle>
            <Title>Sign In</Title>
              <GoogleButton onClick={() => signIn("google", { callbackUrl: "/" })} disabled={loading}>
                  <svg width="20" height="20" viewBox="0 0 48 48">
                      <g>
                          <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.8 0 5.4 1 7.5 2.7l6.4-6.4C34.6 6.5 29.6 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5c10.5 0 20-8.5 20-20 0-1.3-.1-2.7-.5-4z"/>
                          <path fill="#34A853" d="M6.3 14.7l7 5.1C15.6 16.2 19.5 13.5 24 13.5c2.8 0 5.4 1 7.5 2.7l6.4-6.4C34.6 6.5 29.6 4.5 24 4.5c-7.2 0-13.3 4.1-16.7 10.2z"/>
                          <path fill="#FBBC05" d="M24 45.5c5.8 0 10.7-1.9 14.6-5.2l-6.7-5.5c-2.1 1.4-4.8 2.2-7.9 2.2-5.8 0-10.7-3.9-12.5-9.2l-7 5.4C7.7 41.1 15.2 45.5 24 45.5z"/>
                          <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.1 5.5-7.7 5.5-2.2 0-4.2-.7-5.7-2l-7 5.4C18.7 43.1 21.2 45.5 24 45.5c10.5 0 20-8.5 20-20 0-1.3-.1-2.7-.5-4z"/>
                      </g>
                  </svg>
                  Sign in with Google
              </GoogleButton>
            <Divider>or</Divider>
            <StyledForm onSubmit={handleSubmit} autoComplete="off">
              <FieldGroup>
                <StyledLabel htmlFor="email">Email</StyledLabel>
                <InputWrapper>
                  <StyledInput
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    disabled={loading}
                  />
                </InputWrapper>
              </FieldGroup>
              <FieldGroup>
                <StyledLabel htmlFor="password">Password</StyledLabel>
                <SeePassword
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={loading}
                />
                <ForgotPasswordLink href="/forgot-password">
                  Forgot Password?
                </ForgotPasswordLink>
              </FieldGroup>
              <ErrorMsg>
                  {error && (
                      <>
                          <svg viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="12" fill="#e53935" opacity="0.12"/>
                              <path d="M12 7v4m0 4h.01" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {error}
                      </>
                  )}
              </ErrorMsg>
              <Button type="submit" block style={{marginTop: 8, fontSize: "1.08rem"}} disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </StyledForm>
            <BottomText>
              Don't have an account?
              <Link href="/signup" legacyBehavior>
                <Button style={{marginLeft: 10, padding: "8px 18px"}} primary>
                  Sign Up
                </Button>
              </Link>
            </BottomText>
          </AuthWrapper>
        </Center>
      </>
  );
}
