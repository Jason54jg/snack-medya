import assert from "node:assert/strict";
import test from "node:test";
import { loadTypescript } from "./load-salade.mjs";

test("la salade normale est commandable à 10 EUR, poulet et tenders à 11 EUR", () => {
  const { useConfiguratorStore } = loadTypescript("src/lib/store/configurator.ts");
  const { calculateTotal } = loadTypescript("src/lib/pricing.ts");
  const store = useConfiguratorStore.getState();
  store.setMode("salades"); store.setProductId("salade-maison"); store.setFormula("simple");
  assert.equal(useConfiguratorStore.getState().isComplete(), true);
  assert.equal(calculateTotal(useConfiguratorStore.getState()), 10);
  for (const meat of ["poulet", "tenders"]) {
    store.setMeats([meat]);
    assert.equal(calculateTotal(useConfiguratorStore.getState()), 11);
    assert.equal(useConfiguratorStore.getState().isComplete(), true);
  }
  store.setMeats([]);
  assert.equal(calculateTotal(useConfiguratorStore.getState()), 10);
});
test("le panini exige toujours un choix de viande", () => {
  const { useConfiguratorStore } = loadTypescript("src/lib/store/configurator.ts");
  const store = useConfiguratorStore.getState();
  store.setMode("sandwiches"); store.setProductId("panini"); store.setFormula("simple");
  assert.equal(useConfiguratorStore.getState().isComplete(), false);
});
