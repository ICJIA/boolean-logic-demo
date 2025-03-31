// --- DOM Elements ---
const switchAElement = document.getElementById("switchA");
const switchBElement = document.getElementById("switchB");
const lightBulbSVGElement = document.getElementById("lightBulbSVG");
const operationRadios = document.querySelectorAll('input[name="operation"]');
const truthTableBody = document.getElementById("truthTable");
const operationDescriptionTextElement = document.getElementById(
  "operationDescriptionText"
);
const contextualExplanationSpan = document.getElementById(
  "contextualExplanation"
);

// Circuit and Code Elements
const circuitDiagramElement = document.getElementById("circuitDiagram");
const circuitDiagramTitleElement = document.getElementById(
  "circuitDiagramTitle"
);
const jsCodeElement = document.getElementById("jsCode");
const pythonCodeElement = document.getElementById("pythonCode");
const cppCodeElement = document.getElementById("cppCode");
const javaCodeElement = document.getElementById("javaCode");
const jsTabBtn = document.getElementById("jsTabBtn");
const pythonTabBtn = document.getElementById("pythonTabBtn");
const cppTabBtn = document.getElementById("cppTabBtn");
const javaTabBtn = document.getElementById("javaTabBtn");

// Status Display Elements
const currentOperationSpan = document.getElementById("currentOperation");
const switchAStatusSpan = document.getElementById("switchAStatus");
const switchBStatusSpan = document.getElementById("switchBStatus");
const lightStatusSpan = document.getElementById("lightStatus");
const logicFormulaSpan = document.getElementById("logicFormula");

// --- State Variables ---
let isSwitchAUp = false;
let isSwitchBUp = true;
let currentOperation = "AND";

// --- Quiz State ---
let currentQuizQuestion = 0;
let quizScore = 0;
let quizQuestions = [];

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
  contextualExplanationSpan.textContent = operationInfo.contextualExplanation;
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

function updateOperationDescription() {
  operationDescriptionTextElement.textContent =
    OPERATIONS[currentOperation].description;
}

// --- Circuit Diagram Drawing ---
function drawCircuitDiagram() {
  const result = calculateResult(currentOperation, isSwitchAUp, isSwitchBUp);

  // Clear previous diagram
  circuitDiagramElement.innerHTML = "";

  // Update the diagram title
  circuitDiagramTitleElement.textContent = `Interactive Circuit Diagram: ${currentOperation}`;

  // Calculate positions for better alignment - adjusted for wider container
  const canvasWidth = 600; // Increased total width for the diagram area
  const inputX = 60; // X position of inputs moved right
  const gateX = 300; // X position of the gate (centered)
  const outputX = 500; // X position of output moved right
  const topRowY = 60; // Y position of top row (A)
  const bottomRowY = 130; // Y position of bottom row (B)
  const gateY = 95; // Y position of gate (centered vertically)

  const inputAStyle = `padding: 5px; border: 1px solid #334e68; border-radius: 3px; background: ${
    isSwitchAUp ? "#bbf7d0" : "#fecaca"
  }`;
  const inputBStyle = `padding: 5px; border: 1px solid #334e68; border-radius: 3px; background: ${
    isSwitchBUp ? "#bbf7d0" : "#fecaca"
  }`;
  const outputStyle = `padding: 5px; border: 1px solid #334e68; border-radius: 3px; background: ${
    result ? "#bbf7d0" : "#fecaca"
  }`;

  // Input A
  const inputA = document.createElement("div");
  inputA.className = "circuit-element";
  inputA.style.top = `${topRowY - 10}px`;
  inputA.style.left = `${inputX}px`;
  inputA.innerHTML = `<div style="${inputAStyle}">A: ${
    isSwitchAUp ? "True" : "False"
  }</div>`;
  circuitDiagramElement.appendChild(inputA);

  // Input B
  const inputB = document.createElement("div");
  inputB.className = "circuit-element";
  inputB.style.top = `${bottomRowY - 10}px`;
  inputB.style.left = `${inputX}px`;
  inputB.innerHTML = `<div style="${inputBStyle}">B: ${
    isSwitchBUp ? "True" : "False"
  }</div>`;
  circuitDiagramElement.appendChild(inputB);

  // Line from A to vertical connector
  const lineA = document.createElement("div");
  lineA.className = "circuit-line";
  lineA.style.width = `${gateX - inputX - 70}px`;
  lineA.style.top = `${topRowY}px`;
  lineA.style.left = `${inputX + 70}px`;
  circuitDiagramElement.appendChild(lineA);

  // Line from B to vertical connector
  const lineB = document.createElement("div");
  lineB.className = "circuit-line";
  lineB.style.width = `${gateX - inputX - 70}px`;
  lineB.style.top = `${bottomRowY}px`;
  lineB.style.left = `${inputX + 70}px`;
  circuitDiagramElement.appendChild(lineB);

  // Gate
  const gate = document.createElement("div");
  gate.className = "circuit-gate";
  gate.style.top = `${gateY - 30}px`; // Center the 60px height gate
  gate.style.left = `${gateX - 40}px`; // Center the gate (half of the width)

  // Handle special cases for NOT gates
  if (currentOperation === "NOTA" || currentOperation === "NOTB") {
    gate.textContent = currentOperation;
    gate.style.width = "60px";

    if (currentOperation === "NOTA") {
      // No line from B to gate for NOTA
      lineB.remove();
    } else {
      // No line from A to gate for NOTB
      lineA.remove();
    }
  } else {
    gate.textContent = currentOperation;
    gate.style.width = "80px";

    // Vertical line connecting A and B inputs
    const verticalLine = document.createElement("div");
    verticalLine.className = "circuit-line";
    verticalLine.style.width = "2px";
    verticalLine.style.height = `${bottomRowY - topRowY}px`;
    verticalLine.style.top = `${topRowY}px`;
    verticalLine.style.left = `${gateX - 70}px`;
    circuitDiagramElement.appendChild(verticalLine);

    // Short horizontal line from vertical connector to gate (for A)
    const lineAtoGate = document.createElement("div");
    lineAtoGate.className = "circuit-line";
    lineAtoGate.style.width = "30px";
    lineAtoGate.style.top = `${topRowY}px`;
    lineAtoGate.style.left = `${gateX - 70}px`;
    circuitDiagramElement.appendChild(lineAtoGate);

    // Short horizontal line from vertical connector to gate (for B)
    const lineBtoGate = document.createElement("div");
    lineBtoGate.className = "circuit-line";
    lineBtoGate.style.width = "30px";
    lineBtoGate.style.top = `${bottomRowY}px`;
    lineBtoGate.style.left = `${gateX - 70}px`;
    circuitDiagramElement.appendChild(lineBtoGate);
  }
  circuitDiagramElement.appendChild(gate);

  // Line from gate to output
  const lineOutput = document.createElement("div");
  lineOutput.className = "circuit-line";
  lineOutput.style.width = `${outputX - gateX - 40}px`;
  lineOutput.style.top = `${gateY}px`;
  lineOutput.style.left = `${gateX + 40}px`; // Position after the gate
  circuitDiagramElement.appendChild(lineOutput);

  // Output
  const output = document.createElement("div");
  output.className = "circuit-element";
  output.style.top = `${gateY - 10}px`;
  output.style.left = `${outputX}px`;
  output.innerHTML = `<div style="${outputStyle}">Output: ${
    result ? "True" : "False"
  }</div>`;
  circuitDiagramElement.appendChild(output);
}

// --- Code Example Functions ---
function updateCodeExamples() {
  const dynamicCodeExamples = {
    AND: {
      js: `// JavaScript AND operator
let switchA = ${isSwitchAUp}; // ${isSwitchAUp ? "true" : "false"}
let switchB = ${isSwitchBUp}; // ${isSwitchBUp ? "true" : "false"}
let result = switchA && switchB;
console.log(result); // ${isSwitchAUp && isSwitchBUp}

// In a function:
function logicalAND(a, b) {
    return a && b;
}

// With ES6 arrow function:
const andOperation = (a, b) => a && b;

// With ternary operator:
const andResult = switchA && switchB ? "true" : "false";`,

      python: `# Python AND operator
switch_a = ${isSwitchAUp} # ${isSwitchAUp ? "True" : "False"}
switch_b = ${isSwitchBUp} # ${isSwitchBUp ? "True" : "False"}
result = switch_a and switch_b
print(result) # ${isSwitchAUp && isSwitchBUp ? "True" : "False"}

# In a function:
def logical_and(a, b):
    return a and b

# As a lambda expression:
and_lambda = lambda a, b: a and b

# Using operator module:
import operator
result = operator.and_(switch_a, switch_b)`,

      cpp: `// C++ AND operator
#include <iostream>
using namespace std;

int main() {
    bool switchA = ${isSwitchAUp ? "true" : "false"};
    bool switchB = ${isSwitchBUp ? "true" : "false"};
    
    bool result = switchA && switchB;
    cout << "Result: " << (result ? "true" : "false") << endl;
    
    return 0;
}

// In a function:
bool logicalAND(bool a, bool b) {
    return a && b;
}`,

      java: `// Java AND operator
public class BooleanLogic {
    public static void main(String[] args) {
        boolean switchA = ${isSwitchAUp ? "true" : "false"};
        boolean switchB = ${isSwitchBUp ? "true" : "false"};
        
        boolean result = switchA && switchB;
        System.out.println("Result: " + result); // ${
          isSwitchAUp && isSwitchBUp
        }
    }
    
    // In a method:
    public static boolean logicalAND(boolean a, boolean b) {
        return a && b;
    }
}`,
    },

    OR: {
      js: `// JavaScript OR operator
let switchA = ${isSwitchAUp}; // ${isSwitchAUp ? "true" : "false"}
let switchB = ${isSwitchBUp}; // ${isSwitchBUp ? "true" : "false"}
let result = switchA || switchB;
console.log(result); // ${isSwitchAUp || isSwitchBUp}

// In a function:
function logicalOR(a, b) {
    return a || b;
}`,
      python: `# Python OR operator
switch_a = ${isSwitchAUp} # ${isSwitchAUp ? "True" : "False"}
switch_b = ${isSwitchBUp} # ${isSwitchBUp ? "True" : "False"}
result = switch_a or switch_b
print(result) # ${isSwitchAUp || isSwitchBUp ? "True" : "False"}

# In a function:
def logical_or(a, b):
    return a or b`,
      cpp: `// C++ OR operator
#include <iostream>
using namespace std;

int main() {
    bool switchA = ${isSwitchAUp ? "true" : "false"};
    bool switchB = ${isSwitchBUp ? "true" : "false"};
    
    bool result = switchA || switchB;
    cout << "Result: " << (result ? "true" : "false") << endl;
    
    return 0;
}

// In a function:
bool logicalOR(bool a, bool b) {
    return a || b;
}`,
      java: `// Java OR operator
public class BooleanLogic {
    public static void main(String[] args) {
        boolean switchA = ${isSwitchAUp ? "true" : "false"};
        boolean switchB = ${isSwitchBUp ? "true" : "false"};
        
        boolean result = switchA || switchB;
        System.out.println("Result: " + result); // ${
          isSwitchAUp || isSwitchBUp
        }
    }
    
    // In a method:
    public static boolean logicalOR(boolean a, boolean b) {
        return a || b;
    }
}`,
    },

    XOR: {
      js: `// JavaScript XOR implementation (no direct operator)
let switchA = ${isSwitchAUp}; // ${isSwitchAUp ? "true" : "false"}
let switchB = ${isSwitchBUp}; // ${isSwitchBUp ? "true" : "false"}
let result = switchA !== switchB;
console.log(result); // ${isSwitchAUp !== isSwitchBUp}

// In a function:
function logicalXOR(a, b) {
    return a !== b;
}`,
      python: `# Python XOR implementation using !=
switch_a = ${isSwitchAUp} # ${isSwitchAUp ? "True" : "False"}
switch_b = ${isSwitchBUp} # ${isSwitchBUp ? "True" : "False"}
result = switch_a != switch_b
print(result) # ${isSwitchAUp !== isSwitchBUp ? "True" : "False"}

# In a function:
def logical_xor(a, b):
    return a != b
    
# You can also use the ^ bitwise operator
result_bitwise = switch_a ^ switch_b`,
      cpp: `// C++ XOR implementation
#include <iostream>
using namespace std;

int main() {
    bool switchA = ${isSwitchAUp ? "true" : "false"};
    bool switchB = ${isSwitchBUp ? "true" : "false"};
    
    // XOR using != operator
    bool result = switchA != switchB;
    cout << "Result: " << (result ? "true" : "false") << endl;
    
    // XOR using ^ bitwise operator
    bool resultBitwise = switchA ^ switchB;
    cout << "Bitwise result: " << (resultBitwise ? "true" : "false") << endl;
    
    return 0;
}`,
      java: `// Java XOR implementation
public class BooleanLogic {
    public static void main(String[] args) {
        boolean switchA = ${isSwitchAUp ? "true" : "false"};
        boolean switchB = ${isSwitchBUp ? "true" : "false"};
        
        // XOR using != operator 
        boolean result = switchA != switchB;
        System.out.println("Result: " + result); // ${
          isSwitchAUp !== isSwitchBUp
        }
        
        // XOR using ^ bitwise operator
        boolean resultBitwise = switchA ^ switchB;
        System.out.println("Bitwise result: " + resultBitwise);
    }
}`,
    },
  };

  // Update code blocks with the current operation's code
  jsCodeElement.textContent =
    dynamicCodeExamples[currentOperation].js || "// Code example not available";
  pythonCodeElement.textContent =
    dynamicCodeExamples[currentOperation].python ||
    "# Code example not available";
  cppCodeElement.textContent =
    dynamicCodeExamples[currentOperation].cpp ||
    "// C++ example not available for this operation";
  javaCodeElement.textContent =
    dynamicCodeExamples[currentOperation].java ||
    "// Java example not available for this operation";

  // Highlight the code blocks
  hljs.highlightElement(jsCodeElement);
  hljs.highlightElement(pythonCodeElement);
  hljs.highlightElement(cppCodeElement);
  hljs.highlightElement(javaCodeElement);
}

// --- Code Tab Switching ---
function setupCodeTabs() {
  jsTabBtn.addEventListener("click", () => {
    setActiveTab("js");
  });

  pythonTabBtn.addEventListener("click", () => {
    setActiveTab("python");
  });

  cppTabBtn.addEventListener("click", () => {
    setActiveTab("cpp");
  });

  javaTabBtn.addEventListener("click", () => {
    setActiveTab("java");
  });
}

function setActiveTab(language) {
  // Remove active class from all tabs
  [jsTabBtn, pythonTabBtn, cppTabBtn, javaTabBtn].forEach((btn) => {
    btn.classList.remove("active");
  });

  // Hide all code blocks
  document.querySelectorAll(".code-content pre").forEach((el) => {
    el.style.display = "none";
  });

  // Set active tab
  document.getElementById(`${language}TabBtn`).classList.add("active");

  // Show selected code block
  document.getElementById(`${language}Code`).parentElement.style.display =
    "block";
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
  updateOperationDescription();
  drawCircuitDiagram();
  updateCodeExamples();
}

// --- Keyboard Navigation Support ---
function setupKeyboardSupport() {
  switchAElement.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSwitchToggle("A");
    }
  });

  switchBElement.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSwitchToggle("B");
    }
  });

  // Allow arrow key navigation between radio buttons
  document.addEventListener("keydown", (e) => {
    if (document.activeElement.getAttribute("name") === "operation") {
      const operations = Array.from(operationRadios);
      const currentIndex = operations.indexOf(document.activeElement);

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % operations.length;
        operations[nextIndex].focus();
        operations[nextIndex].checked = true;
        handleOperationChange({ target: operations[nextIndex] });
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex =
          (currentIndex - 1 + operations.length) % operations.length;
        operations[prevIndex].focus();
        operations[prevIndex].checked = true;
        handleOperationChange({ target: operations[prevIndex] });
      }
    }
  });
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

  // Update ARIA state
  if (switchId === "A") {
    switchAElement.setAttribute("aria-pressed", isSwitchAUp ? "true" : "false");
  } else if (switchId === "B") {
    switchBElement.setAttribute("aria-pressed", isSwitchBUp ? "true" : "false");
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

  // Initialize ARIA states
  switchAElement.setAttribute("aria-pressed", "false");
  switchBElement.setAttribute("aria-pressed", "true");

  // Add event listeners
  switchAElement.addEventListener("click", () => handleSwitchToggle("A"));
  switchBElement.addEventListener("click", () => handleSwitchToggle("B"));
  operationRadios.forEach((radio) =>
    radio.addEventListener("change", handleOperationChange)
  );

  // Setup keyboard support
  setupKeyboardSupport();

  // Setup code tabs
  setupCodeTabs();

  // Perform initial update
  updateAll();
}

// Run initialization when the DOM is ready
document.addEventListener("DOMContentLoaded", initialize);
