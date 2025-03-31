// --- DOM Elements ---
const switchAElement = document.getElementById("switchA");
const switchBElement = document.getElementById("switchB");
const lightBulbSVGElement = document.getElementById("lightBulbSVG");
const operationRadios = document.querySelectorAll('input[name="operation"]');
const truthTableBody = document.getElementById("truthTable");
const operationDescriptionTextElement = document.getElementById(
  "operationDescriptionText"
); // New Element
const contextualExplanationSpan = document.getElementById(
  "contextualExplanation"
); // New span for context

// Status Display Elements
const currentOperationSpan = document.getElementById("currentOperation");
const switchAStatusSpan = document.getElementById("switchAStatus");
const switchBStatusSpan = document.getElementById("switchBStatus");
const lightStatusSpan = document.getElementById("lightStatus");
const logicFormulaSpan = document.getElementById("logicFormula");

// --- State Variables ---
let isSwitchAUp = false; // Initial state matches HTML 'down' class
let isSwitchBUp = true; // Initial state matches HTML 'up' class
let currentOperation = "AND"; // Default

// --- Constants ---
const OPERATIONS = {
  AND: {
    name: "AND",
    formula: "A AND B",
    contextualExplanation: "Output is True only when BOTH A AND B are True.",
    description:
      "The AND operation returns True only if all of its inputs are True. Think of it as requiring multiple conditions to be met simultaneously (e.g., User is logged in AND has permission).",
  },
  OR: {
    name: "OR",
    formula: "A OR B",
    contextualExplanation:
      "Output is True if EITHER A OR B (or both) are True.",
    description:
      "The OR operation returns True if at least one of its inputs is True. It requires only one of several conditions to be met (e.g., Access granted if user is Admin OR is Owner).",
  },
  XOR: {
    name: "XOR",
    formula: "A XOR B",
    contextualExplanation: "Output is True if A and B are DIFFERENT.",
    description:
      "The XOR (Exclusive OR) operation returns True only if its inputs have different values (one True, one False). It excludes the case where both are True. Useful for toggling states or simple encryption.",
  },
  NAND: {
    name: "NAND",
    formula: "NOT (A AND B)",
    contextualExplanation:
      "Output is False only when BOTH A AND B are True (NOT AND).",
    description:
      "The NAND operation (NOT AND) returns False only when all inputs are True; otherwise, it returns True. It's the direct inverse of AND and is functionally complete (all other gates can be built from it).",
  },
  NOR: {
    name: "NOR",
    formula: "NOT (A OR B)",
    contextualExplanation:
      "Output is True only when BOTH A AND B are False (NOT OR).",
    description:
      "The NOR operation (NOT OR) returns True only when all inputs are False; otherwise, it returns False. It's the direct inverse of OR and is also functionally complete.",
  },
  XNOR: {
    name: "XNOR",
    formula: "NOT (A XOR B)",
    contextualExplanation: "Output is True if A and B are the SAME.",
    description:
      "The XNOR (Exclusive NOR) operation returns True only if its inputs have the same value (both True or both False). It's the direct inverse of XOR, often used for checking equivalence.",
  },
  NOTA: {
    name: "NOT A",
    formula: "NOT A",
    contextualExplanation: "Output is the OPPOSITE of A. Ignores B.",
    description:
      "The NOT operation takes a single input and inverts its value. True becomes False, and False becomes True. It's the most basic logic gate, often called an inverter.",
  },
  NOTB: {
    name: "NOT B",
    formula: "NOT B",
    contextualExplanation: "Output is the OPPOSITE of B. Ignores A.",
    description:
      "The NOT operation takes a single input and inverts its value. True becomes False, and False becomes True. It's the most basic logic gate, often called an inverter.",
  },
};

// --- Core Logic Functions ---

function calculateResult(op, a, b) {
  switch (op) {
    case "AND":
      return a && b;
    case "OR":
      return a || b;
    case "XOR":
      return a !== b;
    case "NAND":
      return !(a && b);
    case "NOR":
      return !(a || b);
    case "XNOR":
      return a === b;
    case "NOTA":
      return !a;
    case "NOTB":
      return !b;
    default:
      return false;
  }
}

// --- Update Functions ---

function updateLightVisual(isOn) {
  if (isOn) {
    lightBulbSVGElement.classList.remove("off");
    lightBulbSVGElement.classList.add("on");
  } else {
    lightBulbSVGElement.classList.remove("on");
    lightBulbSVGElement.classList.add("off");
  }
}

function updateStatusDisplay(lightIsOn) {
  const operationInfo = OPERATIONS[currentOperation];

  currentOperationSpan.textContent = operationInfo.name;
  switchAStatusSpan.textContent = isSwitchAUp ? "Up (True)" : "Down (False)";
  switchBStatusSpan.textContent = isSwitchBUp ? "Up (True)" : "Down (False)";
  lightStatusSpan.textContent = lightIsOn ? "ON (True)" : "OFF (False)";
  logicFormulaSpan.textContent = operationInfo.formula;
  contextualExplanationSpan.textContent = operationInfo.contextualExplanation; // Update context
}

function generateTruthTable() {
  const inputs = [
    { a: false, b: false },
    { a: false, b: true },
    { a: true, b: false },
    { a: true, b: true },
  ];

  let tableHTML = `
        <thead>
            <tr>
                <th>Switch A</th>
                <th>Switch B</th>
                <th>Result (Light)</th>
            </tr>
        </thead>
        <tbody>
    `;

  inputs.forEach((input) => {
    const result = calculateResult(currentOperation, input.a, input.b);
    const isCurrentRow = input.a === isSwitchAUp && input.b === isSwitchBUp;
    const rowClass = isCurrentRow ? "current-row" : "";

    tableHTML += `
            <tr class="${rowClass}">
                <td>${input.a ? "Up (True)" : "Down (False)"}</td>
                <td>${input.b ? "Up (True)" : "Down (False)"}</td>
                <td>${result ? "ON (True)" : "OFF (False)"}</td>
            </tr>
        `;
  });

  tableHTML += "</tbody>";
  truthTableBody.innerHTML = tableHTML;
}

// New function to update the general description
function updateOperationDescription() {
  operationDescriptionTextElement.textContent =
    OPERATIONS[currentOperation].description;
}

// Combined update function
function updateAll() {
  const lightResult = calculateResult(
    currentOperation,
    isSwitchAUp,
    isSwitchBUp
  );
  updateLightVisual(lightResult);
  updateStatusDisplay(lightResult);
  generateTruthTable();
  updateOperationDescription(); // Call the new update function
}

// --- Event Handlers ---

function handleSwitchToggle(switchId) {
  if (switchId === "A") {
    isSwitchAUp = !isSwitchAUp;
    switchAElement.classList.toggle("up");
    switchAElement.classList.toggle("down");
  } else if (switchId === "B") {
    isSwitchBUp = !isSwitchBUp;
    switchBElement.classList.toggle("up");
    switchBElement.classList.toggle("down");
  }
  updateAll();
}

function handleOperationChange(event) {
  currentOperation = event.target.value;
  localStorage.setItem("booleanDemoOperation", currentOperation); // Save preference
  updateAll();
}

// --- Initialization ---

function initialize() {
  // Restore last operation from localStorage
  const savedOperation = localStorage.getItem("booleanDemoOperation");
  if (savedOperation && OPERATIONS[savedOperation]) {
    currentOperation = savedOperation;
    // Check the corresponding radio button
    const radioToCheck = document.querySelector(
      `input[name="operation"][value="${currentOperation}"]`
    );
    if (radioToCheck) {
      radioToCheck.checked = true;
    } else {
      // Fallback if saved operation is invalid somehow
      currentOperation = "AND";
      document.querySelector(
        `input[name="operation"][value="AND"]`
      ).checked = true;
    }
  } else {
    // Ensure the default radio (AND) is checked if nothing is saved
    document.querySelector(
      `input[name="operation"][value="AND"]`
    ).checked = true;
  }

  // Add event listeners
  switchAElement.addEventListener("click", () => handleSwitchToggle("A"));
  switchBElement.addEventListener("click", () => handleSwitchToggle("B"));
  operationRadios.forEach((radio) =>
    radio.addEventListener("change", handleOperationChange)
  );

  // Perform initial update
  updateAll();
}

// Run initialization when the DOM is ready
document.addEventListener("DOMContentLoaded", initialize);
