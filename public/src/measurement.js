export const ORDERED_EVENTS = Object.freeze([
  "qualified_asset_reach",
  "component_use_completed",
  "official_product_click"
]);

export function createMeasurementRecorder(notify = () => {}) {
  const events = [];

  return {
    record(name) {
      const expected = ORDERED_EVENTS[events.length];
      if (name !== expected) return false;

      events.push(name);
      notify(Object.freeze({ name }));
      return true;
    },
    snapshot() {
      return [...events];
    }
  };
}
