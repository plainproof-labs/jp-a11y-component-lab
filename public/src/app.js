import { DisclosureErrorPattern, TEST_STATES } from "./component.js";
import { createMeasurementRecorder } from "./measurement.js";

function announceMeasurement(event) {
  window.dispatchEvent(new CustomEvent("lab:measurement", { detail: event }));
}

function connectOfficialLink(measurement) {
  const link = document.querySelector("#official-product-link");
  link.addEventListener("click", () => {
    measurement.record("official_product_click");
  });
}

function connectAcquisition(measurement) {
  const acquisitionCard = document.querySelector("#acquisition-card");
  const bundleDownload = document.querySelector("#bundle-download");
  const acquisitionStatus = document.querySelector("#acquisition-status");
  const useConfirmation = document.querySelector("#use-confirmation");
  const confirmUseButton = document.querySelector("#confirm-use-button");
  const useConfirmationStatus = document.querySelector("#use-confirmation-status");
  const officialCard = document.querySelector("#official-card");
  let downloadStarted = false;

  bundleDownload.addEventListener("click", () => {
    downloadStarted = true;
    acquisitionStatus.hidden = false;
    useConfirmation.hidden = false;
  });

  confirmUseButton.addEventListener("click", () => {
    if (!downloadStarted) return;
    if (!measurement.record("component_use_completed")) return;

    confirmUseButton.disabled = true;
    confirmUseButton.textContent = "保存したHTMLを開いて確認済み";
    useConfirmationStatus.hidden = false;
    officialCard.hidden = false;
  });

  return () => {
    acquisitionCard.hidden = false;
  };
}

const measurement = createMeasurementRecorder(announceMeasurement);
measurement.record("qualified_asset_reach");

const root = document.querySelector("#disclosure-error-pattern");
const component = new DisclosureErrorPattern(root, {
  onReadyForAcquisition: connectAcquisition(measurement)
});
connectOfficialLink(measurement);

window.__componentTestApi = Object.freeze({
  setState: (state) => component.setState(state),
  states: TEST_STATES,
  getState: () => component.state,
  getMeasurements: () => measurement.snapshot()
});

window.dispatchEvent(new CustomEvent("component:ready"));
