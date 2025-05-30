
export default function handler(req, res) {
  // Hardcoded quicklinks data
  const quicklinks = {
    about: "About us information goes here.",
    terms: "Terms and conditions go here.",
    shop: "Shop information goes here.",
    support: "Support information goes here."
  };

  res.json(quicklinks);
}
