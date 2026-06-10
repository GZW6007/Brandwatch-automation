const form = document.querySelector("#extractForm");
const output = document.querySelector("#promptOutput");
const statusLine = document.querySelector("#statusLine");
const copyButton = document.querySelector("#copyButton");
const resetButton = document.querySelector("#resetButton");

const controls = {
  dashboard: document.querySelector("#dashboard"),
  customDashboard: document.querySelector("#customDashboard"),
  customDashboardWrap: document.querySelector("#customDashboardWrap"),
  startDate: document.querySelector("#startDate"),
  endDate: document.querySelector("#endDate"),
  tabName: document.querySelector("#tabName"),
  customTab: document.querySelector("#customTab"),
  customTabWrap: document.querySelector("#customTabWrap"),
  chart: document.querySelector("#chart"),
  customChart: document.querySelector("#customChart"),
  customChartWrap: document.querySelector("#customChartWrap"),
  returnPercent: document.querySelector("#returnPercent"),
  returnSeries: document.querySelector("#returnSeries"),
  brandFilter: document.querySelector("#brandFilter"),
  customBrand: document.querySelector("#customBrand"),
  customBrandWrap: document.querySelector("#customBrandWrap"),
};

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function selectedOrCustom(select, customInput) {
  return select.value === "custom" ? customInput.value.trim() : select.value;
}

function toggleCustom(select, wrapper) {
  wrapper.classList.toggle("hidden", select.value !== "custom");
}

function buildReturnText() {
  const parts = [];
  if (controls.returnPercent.checked) parts.push("percentages");
  if (controls.returnSeries.checked) parts.push("Series 1 values");
  const metricText = parts.length ? parts.join(" and ") : "visible chart values";
  const brand = selectedOrCustom(controls.brandFilter, controls.customBrand);

  if (!brand || brand === "all") return `all brands, ${metricText}`;
  return `${brand}, ${metricText}`;
}

function buildPrompt() {
  const dashboard = selectedOrCustom(controls.dashboard, controls.customDashboard) || "<dashboard name or URL>";
  const tab = selectedOrCustom(controls.tabName, controls.customTab) || "<exact tab name>";
  const chart = selectedOrCustom(controls.chart, controls.customChart) || "<exact chart title>";
  const start = formatDate(controls.startDate.value) || "<start date>";
  const end = formatDate(controls.endDate.value) || "<end date>";

  return [
    "Brandwatch extract:",
    `Dashboard: ${dashboard}`,
    `Date range: ${start} - ${end}`,
    `Tab: ${tab}`,
    `Chart: ${chart}`,
    `Return: ${buildReturnText()}`,
    "",
    "Notes:",
    "- If the in-app browser is logged out, stop and ask me to log in manually.",
    "- Widen the viewport before using Date range if the toolbar is collapsed.",
    "- Do not include or print Brandwatch credentials in the result.",
  ].join("\n");
}

function updateOutput() {
  toggleCustom(controls.dashboard, controls.customDashboardWrap);
  toggleCustom(controls.tabName, controls.customTabWrap);
  toggleCustom(controls.chart, controls.customChartWrap);
  toggleCustom(controls.brandFilter, controls.customBrandWrap);
  output.value = buildPrompt();
}

form.addEventListener("input", updateOutput);
form.addEventListener("change", updateOutput);

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(output.value);
    statusLine.textContent = "指令已複製。";
  } catch {
    output.select();
    statusLine.textContent = "無法直接複製，已選取文字可手動複製。";
  }
});

resetButton.addEventListener("click", () => {
  form.reset();
  updateOutput();
  statusLine.textContent = "表單已重設。";
});

updateOutput();
