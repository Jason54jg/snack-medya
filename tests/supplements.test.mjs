import assert from "node:assert/strict";
import test from "node:test";
import { loadTypescript } from "./load-supplements.mjs";

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
