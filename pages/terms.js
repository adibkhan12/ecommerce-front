import Header from "@/components/Header";
import styled from "styled-components";

const PageWrapper = styled.div`
  background: #f7f8fa;
  min-height: 100vh;
  padding: 0;
`;

const TermsContainer = styled.div`
  max-width: 760px;
  margin: 56px auto 40px auto;
  padding: 0 24px;
  @media (max-width: 600px) {
    margin: 24px 0;
    padding: 0 8px;
  }
`;

const Title = styled.h1`
  text-align: center;
  color: #1a2440;
  font-size: 2.3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  letter-spacing: 1px;
  line-height: 1.15;
`;

const Section = styled.section`
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h2`
  color: #ff9900;
  font-size: 1.18rem;
  margin-top: 2.2rem;
  margin-bottom: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  border-left: 4px solid #ff9900;
  padding-left: 12px;
  background: linear-gradient(90deg, #fffbe6 0 60%, transparent 100%);
`;

const StyledList = styled.ul`
  padding-left: 1.3rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const StyledListItem = styled.li`
  margin-bottom: 0.6rem;
  line-height: 1.7;
  color: #232323;
  font-size: 1.07rem;
  strong {
    color: #1a2440;
    font-weight: 600;
  }
`;

const Paragraph = styled.p`
  color: #444;
  font-size: 1.13rem;
  line-height: 1.8;
  margin-bottom: 1.1rem;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1.5px solid #ececec;
  margin: 32px 0 28px 0;
`;

const Contact = styled.p`
  margin-top: 2.5rem;
  color: #1a2440;
  font-size: 1.08rem;
  text-align: center;
  a {
    color: #ff9900;
    text-decoration: underline;
    font-weight: 500;
    &:hover {
      color: #e88a00;
    }
  }
`;

export default function Terms() {
  return (
    <>
      <Header />
      <PageWrapper>
        <TermsContainer>
          <Title>Refund and Returns Policy</Title>
          <Paragraph>
            At Shahzadmobile, we prioritize transparency and customer satisfaction.
            Please review our refund and return policy carefully before making a purchase.
          </Paragraph>

          <Divider />

          <Section>
            <SectionTitle>Refund Policy</SectionTitle>
            <StyledList>
              <StyledListItem>
                <strong>Non-Refundable Purchases:</strong> All sales made at Shahzadmobile are final. Once a product is purchased, it cannot be returned or refunded under any circumstances.
              </StyledListItem>
              <StyledListItem>
                <strong>Customer Acknowledgement:</strong> By purchasing a product, you confirm that you have thoroughly checked and tested the product to your satisfaction.
              </StyledListItem>
            </StyledList>
          </Section>

          <Section>
            <SectionTitle>Return &amp; Exchange Policy</SectionTitle>
            <StyledList>
              <StyledListItem>
                <strong>No Product Replacements:</strong> Used products are not eligible for replacement with brand-new items. Customers are encouraged to verify the condition of their purchase before leaving the store or completing an online transaction.
              </StyledListItem>
              <StyledListItem>
                <strong>Warranty Seal:</strong> All devices are sold with a warranty seal. Removing or tampering with the seal will void any service eligibility.
              </StyledListItem>
            </StyledList>
          </Section>

          <Section>
            <SectionTitle>Important Guidelines</SectionTitle>
            <StyledList>
              <StyledListItem>
                <strong>LCD Screens and Cameras:</strong> No warranty is provided for LCD screens or camera components. Please inspect these parts thoroughly before purchase.
              </StyledListItem>
              <StyledListItem>
                <strong>Battery Health:</strong> As battery health depends on prior usage, no warranty is offered for battery performance or longevity.
              </StyledListItem>
              <StyledListItem>
                <strong>Water Damage:</strong> Products damaged by water are excluded from warranty coverage. Please handle your device with care.
              </StyledListItem>
            </StyledList>
          </Section>

          <Section>
            <SectionTitle>Tax Policy</SectionTitle>
            <StyledList>
              <StyledListItem>
                <strong>VAT Inclusion:</strong> All prices displayed on our website include a 5% VAT, calculated under the Profit Margin Scheme. This ensures a clear and hassle-free purchase experience for our customers.
              </StyledListItem>
            </StyledList>
          </Section>

          <Divider />

          <Contact>
            By purchasing from Shahzadmobile, you acknowledge and accept these policies.<br />
            For any inquiries, feel free to reach out to us at{" "}
            <a href="mailto:sa@shahzadmobile.com">sa@shahzadmobile.com</a> or call{" "}
            <a href="tel:566130458">+971-56-6130458</a>
          </Contact>
        </TermsContainer>
      </PageWrapper>
    </>
  );
}