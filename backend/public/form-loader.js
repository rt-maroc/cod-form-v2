(function () {
  const formContainer = document.createElement("div");
  formContainer.innerHTML = `
    <form id="cod-form" style="margin-top: 20px;">
      <input type="text" name="nom" placeholder="Nom complet" required/><br/>
      <input type="tel" name="telephone" placeholder="Téléphone" required/><br/>
      <button type="submit">Commander en Paiement à la Livraison</button>
    </form>
    <div id="cod-message" style="margin-top: 10px;"></div>
  `;
  document.querySelector("form[action*='/cart/add']").insertAdjacentElement("afterend", formContainer);

  const form = document.getElementById("cod-form");
  const message = document.getElementById("cod-message");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const nom = form.nom.value.trim();
    const telephone = form.telephone.value.trim();

    const variantId = Shopify?.Analytics?.meta?.page?.variantId ||
                      window.meta?.product?.variants?.[0]?.id;

    if (!variantId) {
      message.innerText = "Erreur : impossible d’identifier le produit.";
      return;
    }

    try {
      const res = await fetch("https://shopify-cod-form.onrender.com/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, telephone, variantId })
      });

      const data = await res.json();

      if (res.ok && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        message.innerText = "Erreur: " + (data.detail || "Impossible d'enregistrer la commande.");
      }
    } catch (error) {
      message.innerText = "Erreur réseau : " + error.message;
    }
  });
})();
