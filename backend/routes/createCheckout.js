const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/create-checkout", async (req, res) => {
  const { nom, telephone, variantId } = req.body;

  if (!nom || !telephone || !variantId) {
    return res.status(400).json({ message: "Informations manquantes" });
  }

  try {
    const response = await axios.post(
      `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2023-10/checkouts.json`,
      {
        checkout: {
          email: `${telephone}@cod.local`,
          line_items: [{ variant_id: variantId, quantity: 1 }],
          note: `Nom: ${nom}, Téléphone: ${telephone}`
        }
      },
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json"
        }
      }
    );

    res.status(200).json({ checkout: response.data.checkout });
  } catch (err) {
    console.error("Erreur:", err.response?.data || err.message);
    res.status(500).json({
      message: "Erreur serveur",
      detail: err.response?.data || err.message
    });
  }
});

module.exports = router;