import assert from "node:assert/strict";
import test from "node:test";
import { loadTypescript } from "./load-supplements.mjs";

test("tous les durums simples proposent les frites à 1,50 €, sans supplément en menu", () => {
  const { DURUMS } = loadTypescript("src/data/menu.ts");
  const { getAllowedExtras } = loadTypescript("src/lib/extras.ts");
  const { useConfiguratorStore } = loadTypescript("src/lib/store/configurator.ts");
  const { calculateTotal } = loadTypescript("src/lib/pricing.ts");
  for (const product of DURUMS) {
    const store = useConfiguratorStore.getState();
    store.setMode("durums");
    store.setProductId(product.id);
    store.setFormula("simple");
    store.toggleExtra("frites-durum");
    assert.equal(calculateTotal(useConfiguratorStore.getState()), product.prices.simple + 1.5, product.id);
    if (product.id === "pizza-lahmacun") {
      store.toggleExtra("lahmacun-viande");
      assert.equal(calculateTotal(useConfiguratorStore.getState()), product.prices.simple + 2.5);
    }
    for (const formula of ["menu", "menuDessert"]) {
      store.setFormula(formula);
      assert.equal(useConfiguratorStore.getState().extras.includes("frites-durum"), false);
      store.toggleExtra("frites-durum");
      assert.equal(useConfiguratorStore.getState().extras.includes("frites-durum"), false);
      assert.equal(getAllowedExtras("durums", product.id, formula).some((extra) => extra.id === "frites-durum"), false);
      const meat = product.id === "pizza-lahmacun" ? 1 : 0;
      assert.equal(calculateTotal({ ...useConfiguratorStore.getState(), extras: [...useConfiguratorStore.getState().extras, "frites-durum"] }), product.prices[formula] + meat);
      assert.equal(useConfiguratorStore.getState().isComplete(), true);
    }
    store.setFormula("simple");
    assert.equal(useConfiguratorStore.getState().extras.includes("frites-durum"), false);
  }
});

test("chaque catégorie propose uniquement ses propres suppléments", () => {
  const { getAllowedExtras } = loadTypescript("src/lib/extras.ts");
  for (const [mode, productId, expected] of [
    ["sandwiches", "kebab", ["viande", "feta", "mozza", "cheddar", "oeuf", "frites"]],
    ["tacos", null, ["viande", "feta-tacos", "mozza", "cheddar", "oeuf-tacos"]],
    ["bowls", "bowl-kebab", ["viande-bowl"]],
    ["durums", "pizza-lahmacun", ["lahmacun-viande"]],
    ["durums", "durum-kebab", []],
    ["burgers", "burger-classique", []],
    ["assiettes", "assiette-steak", []],
    ["salades", "salade-maison", []],
    ["enfant", null, []],
    [null, null, []],
  ]) {
    assert.deepEqual(getAllowedExtras(mode, productId).map((extra) => extra.id), expected, mode);
  }
});

test("les suppléments sandwichs ne sont ni sélectionnables ni facturés ailleurs", () => {
  const { useConfiguratorStore } = loadTypescript("src/lib/store/configurator.ts");
  const { calculateTotal } = loadTypescript("src/lib/pricing.ts");
  for (const [mode, productId] of [
    ["durums", "durum-kebab"],
    ["burgers", "burger-classique"],
    ["assiettes", "assiette-steak"],
    ["salades", "salade-maison"],
  ]) {
    const store = useConfiguratorStore.getState();
    store.setMode(mode);
    store.setProductId(productId);
    store.setFormula("simple");
    const base = calculateTotal(useConfiguratorStore.getState());
    assert.ok(base > 0);
    for (const id of ["viande", "feta", "mozza", "cheddar", "oeuf", "frites"]) store.toggleExtra(id);
    assert.deepEqual(useConfiguratorStore.getState().extras, [], mode);
    const invalid = { ...useConfiguratorStore.getState(), extras: ["oeuf", "frites"] };
    assert.equal(calculateTotal(invalid), base, mode);
    useConfiguratorStore.setState({ extras: invalid.extras });
    assert.equal(useConfiguratorStore.getState().isComplete(), false, mode);
  }
});

test("l’œuf ajoute 1,50 € au total et son retrait restaure le prix de base", () => {
  const { useConfiguratorStore } = loadTypescript("src/lib/store/configurator.ts");
  const { calculateTotal } = loadTypescript("src/lib/pricing.ts");
  for (const [mode, productId, extraId] of [
    ["sandwiches", "kebab", "oeuf"],
    ["tacos", null, "oeuf-tacos"],
  ]) {
    const store = useConfiguratorStore.getState();
    store.setMode(mode);
    if (productId) store.setProductId(productId);
    else store.setTacoSize("S");
    store.setFormula("simple");
    const base = calculateTotal(useConfiguratorStore.getState());
    assert.ok(base > 0);
    store.toggleExtra(extraId);
    assert.equal(calculateTotal(useConfiguratorStore.getState()), base + 1.5, mode);
    store.toggleExtra(extraId);
    assert.equal(calculateTotal(useConfiguratorStore.getState()), base, mode);
  }
});

test("le supplément Lahmacun est limité à son produit", () => {
  const { getAllowedExtras } = loadTypescript("src/lib/extras.ts");
  assert.equal(getAllowedExtras("sandwiches", "kebab").some((extra) => extra.id === "lahmacun-viande"), false);
  assert.equal(getAllowedExtras("durums", "pizza-lahmacun").some((extra) => extra.id === "lahmacun-viande"), true);
});
test("une option interdite ne peut être ajoutée et n’est pas facturée", () => {
  const { useConfiguratorStore } = loadTypescript("src/lib/store/configurator.ts");
  const { calculateTotal } = loadTypescript("src/lib/pricing.ts");
  const store = useConfiguratorStore.getState();
  store.setMode("sandwiches"); store.setProductId("kebab"); store.setFormula("simple");
  store.toggleExtra("lahmacun-viande");
  assert.deepEqual(useConfiguratorStore.getState().extras, []);
  store.toggleExtra("viande");
  assert.equal(calculateTotal(useConfiguratorStore.getState()), 10.5);
  const invalid = { ...useConfiguratorStore.getState(), extras: ["lahmacun-viande"] };
  assert.equal(calculateTotal(invalid), 7);
  useConfiguratorStore.setState({ extras: ["lahmacun-viande"] });
  assert.equal(useConfiguratorStore.getState().isComplete(), false);
});
test("changer de produit enlève les suppléments devenus incompatibles", () => {
  const { useConfiguratorStore } = loadTypescript("src/lib/store/configurator.ts");
  const store = useConfiguratorStore.getState();
  store.setMode("durums"); store.setProductId("pizza-lahmacun"); store.toggleExtra("lahmacun-viande");
  assert.equal(useConfiguratorStore.getState().extras.length, 1);
  store.setProductId("durum-kebab");
  assert.deepEqual(useConfiguratorStore.getState().extras, []);
});
