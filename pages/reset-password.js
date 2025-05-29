import { useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Center from "@/components/Center";
import Button from "@/components/Button";
import styled from "styled-components";
import { primary } from "@/lib/colors";
import Link from "next/link";
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

const Title = styled.h2`
  margin-top: 24px;
  font-size: 1.7rem;
  font-weight: 700;
  color: #222;
  text-align: center;
  letter-spacing: 0.5px;
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

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token, email } = router.query;
  const [form, setForm] = useState({
    password: "",
    confirm: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!form.password || !form.confirm)
      return setError("Please enter and confirm your new password.");
    if (form.password !== form.confirm)
      return setError("Passwords do not match.");
    if (!token || !email)
      return setError("Invalid reset link. Try requesting a new one.");

    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ token, email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reset password.");
      } else {
        setSuccess("Your password has been reset. You can now sign in.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <Center>
        <AuthWrapper>
          <Title>Reset Password</Title>
          {success && <SuccessMsg>{success}</SuccessMsg>}
          <StyledForm onSubmit={handleSubmit}>
            <FieldGroup>
              <StyledLabel htmlFor="password">New Password</StyledLabel>
              <SeePassword
                id="password"
                name="password"
                type="password"
                placeholder="Enter new password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                disabled={loading || !!success}
                autoComplete="new-password"
              />
            </FieldGroup>
            <FieldGroup>
              <StyledLabel htmlFor="confirm">Confirm Password</StyledLabel>
              <SeePassword
                id="confirm"
                name="confirm"
                type="password"
                placeholder="Re-enter new password"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                disabled={loading || !!success}
                autoComplete="new-password"
              />
            </FieldGroup>
            <ErrorMsg>{error}</ErrorMsg>
            <Button type="submit" block style={{ marginTop: 8, fontSize: "1.08rem" }} disabled={loading || !!success}>
              {loading ? "Resetting..." : "Reset Password"}
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