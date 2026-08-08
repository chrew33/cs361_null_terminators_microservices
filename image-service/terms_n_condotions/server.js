const express = require('express');
const app = express();
const PORT = process.env.PORT || 5003;

// Middleware to parse JSON request bodies
app.use(express.json());

// Current active terms and conditions data
const CURRENT_TERMS = {
  version: "1.0",
  effective_date: "2026-08-08",
  text: "By accessing and using this service, you agree to comply with our acceptable use policies, project guidelines, and disclaimers."
};

// In-memory mock database to track which users have accepted the terms
const acceptedAgreements = new Set();

// 1. GET Endpoint: Retrieve the latest Terms & Conditions
app.get('/api/terms', (req, res) => {
  res.status(200).json({
    status: "success",
    terms: CURRENT_TERMS
  });
});

// 2. POST Endpoint: Record a user's agreement to the Terms & Conditions
app.post('/api/terms/accept', (req, res) => {
  const { user_id, version, agreed } = req.body;

  // Validate request parameters
  if (!user_id || agreed !== true) {
    return res.status(400).json({
      status: "error",
      message: "Invalid request. User ID and explicit agreement (agreed: true) are required."
    });
  }

  // Check if version matches or default to current
  const targetVersion = version || CURRENT_TERMS.version;

  // Record agreement
  const agreementRecord = `${user_id}_v${targetVersion}`;
  acceptedAgreements.add(agreementRecord);

  console.log(`[Terms Service] User ${user_id} successfully accepted terms version ${targetVersion}`);

  return res.status(201).json({
    status: "success",
    message: "Terms and conditions agreement recorded successfully.",
    user_id: user_id,
    version: targetVersion
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Terms & Conditions Microservice running on http://localhost:${PORT}`);
});