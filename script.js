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
const loadingIndicatorElement = document.getElementById("loadingIndicator");

// Code Elements
const jsCodeElement = document.getElementById("jsCode");
const pythonCodeElement = document.getElementById("pythonCode");
const cppCodeElement = document.getElementById("cppCode");
const javaCodeElement = document.getElementById("javaCode");
const rubyCodeElement = document.getElementById("rubyCode");
const swiftCodeElement = document.getElementById("swiftCode");
const goCodeElement = document.getElementById("goCode");
const rustCodeElement = document.getElementById("rustCode");
const jsTabBtn = document.getElementById("jsTabBtn");
const pythonTabBtn = document.getElementById("pythonTabBtn");
const cppTabBtn = document.getElementById("cppTabBtn");
const javaTabBtn = document.getElementById("javaTabBtn");
const rubyTabBtn = document.getElementById("rubyTabBtn");
const swiftTabBtn = document.getElementById("swiftTabBtn");
const goTabBtn = document.getElementById("goTabBtn");
const rustTabBtn = document.getElementById("rustTabBtn");

// Status Display Elements
const currentOperationSpan = document.getElementById("currentOperation");
const switchAStatusSpan = document.getElementById("switchAStatus");
const switchBStatusSpan = document.getElementById("switchBStatus");
const lightStatusSpan = document.getElementById("lightStatus");
const logicFormulaSpan = document.getElementById("logicFormula");

// Mode Toggles (will be created in the UI later)
let truthTableModeToggle;
let autoDemoToggle;

// --- State Variables ---
let isSwitchAUp = false;
let isSwitchBUp = true;
let currentOperation = "AND";
let isInTruthTableMode = false;
let isAutoDemoRunning = false;
let autoDemoInterval = null;
let autoDemoOperationIndex = 0;
let autoDemoStateIndex = 0;

// --- Quiz State ---
let currentQuizQuestion = 0;
let quizScore = 0;
let quizQuestions = [];

// --- Constants for Auto Demo ---
const AUTO_DEMO_INTERVAL = 2000; // milliseconds
const AUTO_DEMO_OPERATIONS = [
  "AND",
  "OR",
  "XOR",
  "NAND",
  "NOR",
  "XNOR",
  "NOTA",
  "NOTB",
];
const AUTO_DEMO_STATES = [
  { a: false, b: false },
  { a: false, b: true },
  { a: true, b: false },
  { a: true, b: true },
];

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

  // Update the binary example
  updateBinaryExample();
}

// Add this new function to update the binary example
function updateBinaryExample() {
  const binaryA = document.getElementById("binaryA");
  const binaryB = document.getElementById("binaryB");
  const binaryOperator = document.getElementById("binaryOperator");
  const binaryResult = document.getElementById("binaryResult");
  const binaryExplanation = document.getElementById("binaryExplanation");

  // Set binary values based on switch states
  const a = isSwitchAUp ? 1 : 0;
  const b = isSwitchBUp ? 1 : 0;

  // Update binary values
  binaryA.textContent = a;
  binaryB.textContent = b;

  // Set operator symbol and result based on current operation
  let operator = "&";
  let result = 0;
  let explanation = "In binary, AND returns 1 only if both bits are 1.";

  switch (currentOperation) {
    case "AND":
      operator = "&";
      result = a & b;
      explanation = "In binary, AND returns 1 only if both bits are 1.";
      break;
    case "OR":
      operator = "|";
      result = a | b;
      explanation = "In binary, OR returns 1 if either bit is 1.";
      break;
    case "XOR":
      operator = "^";
      result = a ^ b;
      explanation = "In binary, XOR returns 1 if the bits are different.";
      break;
    case "NAND":
      operator = "~&";
      result = (a & b) === 0 ? 1 : 0;
      explanation = "In binary, NAND is the inverse of AND.";
      break;
    case "NOR":
      operator = "~|";
      result = (a | b) === 0 ? 1 : 0;
      explanation = "In binary, NOR is the inverse of OR.";
      break;
    case "XNOR":
      operator = "~^";
      result = a === b ? 1 : 0;
      explanation = "In binary, XNOR returns 1 if the bits are the same.";
      break;
    case "NOTA":
      operator = "~";
      result = a === 0 ? 1 : 0;
      explanation = "In binary, NOT inverts the bit (0→1, 1→0).";
      break;
    case "NOTB":
      operator = "~";
      result = b === 0 ? 1 : 0;
      explanation = "In binary, NOT inverts the bit (0→1, 1→0).";
      break;
  }

  binaryOperator.textContent = operator;
  binaryResult.textContent = result;
  binaryExplanation.textContent = explanation;
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
                <th>#</th>
                <th>Switch A</th>
                <th>Switch B</th>
                <th>Result (Light)</th>
            </tr>
        </thead>
        <tbody>
    `;

  inputs.forEach((input, index) => {
    const result = calculateResult(currentOperation, input.a, input.b);
    const isCurrentRow = input.a === isSwitchAUp && input.b === isSwitchBUp;
    const rowClass = isCurrentRow ? "current-row" : "";
    // Add row number (index + 1) and data attributes to store state
    tableHTML += `
            <tr class="${rowClass}" data-a="${input.a}" data-b="${input.b}">
                <td>${index + 1}</td>
                <td>${input.a ? "Up (True)" : "Down (False)"}</td>
                <td>${input.b ? "Up (True)" : "Down (False)"}</td>
                <td>${result ? "ON (True)" : "OFF (False)"}</td>
            </tr>
        `;
  });

  // Add a fifth row for a summary
  tableHTML += `
        <tr class="table-footer">
            <td>5</td>
            <td colspan="3">Complete Truth Table for ${currentOperation}</td>
        </tr>
    `;

  tableHTML += "</tbody>";
  truthTableBody.innerHTML = tableHTML;

  // Add click event listeners to truth table rows (excluding the footer)
  document
    .querySelectorAll("#truthTable tbody tr:not(.table-footer)")
    .forEach((row) => {
      row.addEventListener("click", handleTruthTableRowClick);
    });
}

// Add this new function to handle truth table row clicks
function handleTruthTableRowClick(event) {
  const row = event.currentTarget;
  const switchAValue = row.getAttribute("data-a") === "true";
  const switchBValue = row.getAttribute("data-b") === "true";

  // Update switch states
  isSwitchAUp = switchAValue;
  isSwitchBUp = switchBValue;

  // Update switch visuals
  switchAElement.classList.toggle("up", isSwitchAUp);
  switchAElement.classList.toggle("down", !isSwitchAUp);
  switchBElement.classList.toggle("up", isSwitchBUp);
  switchBElement.classList.toggle("down", !isSwitchBUp);

  // Update ARIA states
  switchAElement.setAttribute("aria-pressed", isSwitchAUp ? "true" : "false");
  switchBElement.setAttribute("aria-pressed", isSwitchBUp ? "true" : "false");

  // Update everything
  updateAll();
}

function updateOperationDescription() {
  operationDescriptionTextElement.textContent =
    OPERATIONS[currentOperation].description;
}

// --- Code Example Functions ---
function updateCodeExamples() {
  const dynamicCodeExamples = {
    AND: {
      js: `// JavaScript AND operator (&&)
let switchA = ${isSwitchAUp}; // ${isSwitchAUp ? "true" : "false"}
let switchB = ${isSwitchBUp}; // ${isSwitchBUp ? "true" : "false"}
let result = switchA && switchB;
console.log(result); // ${isSwitchAUp && isSwitchBUp}

// In a function:
function logicalAND(a, b) {
    return a && b;
}`,
      python: `# Python AND operator
switch_a = ${isSwitchAUp} # ${isSwitchAUp ? "True" : "False"}
switch_b = ${isSwitchBUp} # ${isSwitchBUp ? "True" : "False"}
result = switch_a and switch_b
print(result) # ${isSwitchAUp && isSwitchBUp ? "True" : "False"}

# In a function:
def logical_and(a, b):
    return a and b`,
      cpp: `// C++ AND operator (&&)
#include <iostream>
using namespace std;

int main() {
    bool switchA = ${isSwitchAUp ? "true" : "false"};
    bool switchB = ${isSwitchBUp ? "true" : "false"};
    
    bool result = switchA && switchB;
    cout << "Result: " << (result ? "true" : "false") << endl;
    
    return 0;
}`,
      java: `// Java AND operator (&&)
public class BooleanLogic {
    public static void main(String[] args) {
        boolean switchA = ${isSwitchAUp ? "true" : "false"};
        boolean switchB = ${isSwitchBUp ? "true" : "false"};
        
        boolean result = switchA && switchB;
        System.out.println("Result: " + result); // ${
          isSwitchAUp && isSwitchBUp
        }
    }
}`,
      ruby: `# Ruby AND operator (&&)
switch_a = ${isSwitchAUp} # ${isSwitchAUp ? "true" : "false"}
switch_b = ${isSwitchBUp} # ${isSwitchBUp ? "true" : "false"}
result = switch_a && switch_b
puts "Result: #{result}" # ${isSwitchAUp && isSwitchBUp}

# In a function:
def logical_and(a, b)
  a && b
end`,
      swift: `// Swift AND operator (&&)
let switchA = ${isSwitchAUp} // ${isSwitchAUp ? "true" : "false"}
let switchB = ${isSwitchBUp} // ${isSwitchBUp ? "true" : "false"}
let result = switchA && switchB
print("Result: \\(result)") // ${isSwitchAUp && isSwitchBUp}

// In a function:
func logicalAND(_ a: Bool, _ b: Bool) -> Bool {
    return a && b
}`,
      go: `// Go AND operator (&&)
package main

import "fmt"

func main() {
    switchA := ${isSwitchAUp ? "true" : "false"}
    switchB := ${isSwitchBUp ? "true" : "false"}
    
    result := switchA && switchB
    fmt.Printf("Result: %t\\n", result) // ${isSwitchAUp && isSwitchBUp}
}

// In a function:
func logicalAND(a bool, b bool) bool {
    return a && b
}`,
      rust: `// Rust AND operator (&&)
fn main() {
    let switch_a = ${isSwitchAUp ? "true" : "false"};
    let switch_b = ${isSwitchBUp ? "true" : "false"};
    
    let result = switch_a && switch_b;
    println!("Result: {}", result); // ${isSwitchAUp && isSwitchBUp}
}

// In a function:
fn logical_and(a: bool, b: bool) -> bool {
    a && b
}`,
    },

    OR: {
      js: `// JavaScript OR operator (||)
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
      cpp: `// C++ OR operator (||)
#include <iostream>
using namespace std;

int main() {
    bool switchA = ${isSwitchAUp ? "true" : "false"};
    bool switchB = ${isSwitchBUp ? "true" : "false"};
    
    bool result = switchA || switchB;
    cout << "Result: " << (result ? "true" : "false") << endl;
    
    return 0;
}`,
      java: `// Java OR operator (||)
public class BooleanLogic {
    public static void main(String[] args) {
        boolean switchA = ${isSwitchAUp ? "true" : "false"};
        boolean switchB = ${isSwitchBUp ? "true" : "false"};
        
        boolean result = switchA || switchB;
        System.out.println("Result: " + result); // ${
          isSwitchAUp || isSwitchBUp
        }
    }
}`,
      ruby: `# Ruby OR operator (||)
switch_a = ${isSwitchAUp} # ${isSwitchAUp ? "true" : "false"}
switch_b = ${isSwitchBUp} # ${isSwitchBUp ? "true" : "false"}
result = switch_a || switch_b
puts "Result: #{result}" # ${isSwitchAUp || isSwitchBUp}

# In a function:
def logical_or(a, b)
  a || b
end`,
      swift: `// Swift OR operator (||)
let switchA = ${isSwitchAUp} // ${isSwitchAUp ? "true" : "false"}
let switchB = ${isSwitchBUp} // ${isSwitchBUp ? "true" : "false"}
let result = switchA || switchB
print("Result: \\(result)") // ${isSwitchAUp || isSwitchBUp}

// In a function:
func logicalOR(_ a: Bool, _ b: Bool) -> Bool {
    return a || b
}`,
      go: `// Go OR operator (||)
package main

import "fmt"

func main() {
    switchA := ${isSwitchAUp ? "true" : "false"}
    switchB := ${isSwitchBUp ? "true" : "false"}
    
    result := switchA || switchB
    fmt.Printf("Result: %t\\n", result) // ${isSwitchAUp || isSwitchBUp}
}

// In a function:
func logicalOR(a bool, b bool) bool {
    return a || b
}`,
      rust: `// Rust OR operator (||)
fn main() {
    let switch_a = ${isSwitchAUp ? "true" : "false"};
    let switch_b = ${isSwitchBUp ? "true" : "false"};
    
    let result = switch_a || switch_b;
    println!("Result: {}", result); // ${isSwitchAUp || isSwitchBUp}
}

// In a function:
fn logical_or(a: bool, b: bool) -> bool {
    a || b
}`,
    },

    XOR: {
      js: `// JavaScript XOR operation (different values)
let switchA = ${isSwitchAUp}; // ${isSwitchAUp ? "true" : "false"}
let switchB = ${isSwitchBUp}; // ${isSwitchBUp ? "true" : "false"}
let result = switchA !== switchB;
console.log(result); // ${isSwitchAUp !== isSwitchBUp}

// In a function:
function logicalXOR(a, b) {
    return a !== b;
}`,
      python: `# Python XOR operation
switch_a = ${isSwitchAUp} # ${isSwitchAUp ? "True" : "False"}
switch_b = ${isSwitchBUp} # ${isSwitchBUp ? "True" : "False"}
# Python doesn't have a dedicated XOR operator for boolean values
result = (switch_a or switch_b) and not (switch_a and switch_b)
print(result) # ${isSwitchAUp !== isSwitchBUp ? "True" : "False"}

# Alternative using the ^ operator (bitwise XOR)
result = bool(switch_a ^ switch_b)
print(result) # ${isSwitchAUp !== isSwitchBUp ? "True" : "False"}`,
      cpp: `// C++ XOR operation (^)
#include <iostream>
using namespace std;

int main() {
    bool switchA = ${isSwitchAUp ? "true" : "false"};
    bool switchB = ${isSwitchBUp ? "true" : "false"};
    
    // In C++, the ^ operator is a bitwise operator but works for booleans
    bool result = switchA ^ switchB;
    cout << "Result: " << (result ? "true" : "false") << endl;
    
    return 0;
}`,
      java: `// Java XOR operation (^)
public class BooleanLogic {
    public static void main(String[] args) {
        boolean switchA = ${isSwitchAUp ? "true" : "false"};
        boolean switchB = ${isSwitchBUp ? "true" : "false"};
        
        // In Java, the ^ operator is the XOR operator for booleans
        boolean result = switchA ^ switchB;
        System.out.println("Result: " + result); // ${
          isSwitchAUp !== isSwitchBUp
        }
    }
}`,
      ruby: `# Ruby XOR operation
switch_a = ${isSwitchAUp} # ${isSwitchAUp ? "true" : "false"}
switch_b = ${isSwitchBUp} # ${isSwitchBUp ? "true" : "false"}
# Ruby uses ^ for XOR
result = switch_a ^ switch_b
puts "Result: #{result}" # ${isSwitchAUp !== isSwitchBUp}

# In a function:
def logical_xor(a, b)
  a ^ b
end`,
      swift: `// Swift XOR operation
let switchA = ${isSwitchAUp} // ${isSwitchAUp ? "true" : "false"}
let switchB = ${isSwitchBUp} // ${isSwitchBUp ? "true" : "false"}
// Swift doesn't have a direct XOR operator for booleans
let result = switchA != switchB
print("Result: \\(result)") // ${isSwitchAUp !== isSwitchBUp}

// In a function:
func logicalXOR(_ a: Bool, _ b: Bool) -> Bool {
    return a != b
}`,
      go: `// Go XOR implementation
package main

import "fmt"

func main() {
    switchA := ${isSwitchAUp ? "true" : "false"}
    switchB := ${isSwitchBUp ? "true" : "false"}
    
    // Go doesn't have a direct XOR for booleans
    result := (switchA || switchB) && !(switchA && switchB)
    fmt.Printf("Result: %t\\n", result) // ${isSwitchAUp !== isSwitchBUp}
}

// In a function:
func logicalXOR(a bool, b bool) bool {
    return (a || b) && !(a && b)
}`,
      rust: `// Rust XOR implementation
fn main() {
    let switch_a = ${isSwitchAUp ? "true" : "false"};
    let switch_b = ${isSwitchBUp ? "true" : "false"};
    
    // Rust uses != for XOR with booleans
    let result = switch_a != switch_b;
    println!("Result: {}", result); // ${isSwitchAUp !== isSwitchBUp}
}

// In a function:
fn logical_xor(a: bool, b: bool) -> bool {
    a != b
}`,
    },

    NAND: {
      js: `// JavaScript NAND operator
let switchA = ${isSwitchAUp}; // ${isSwitchAUp ? "true" : "false"}
let switchB = ${isSwitchBUp}; // ${isSwitchBUp ? "true" : "false"}
let result = !(switchA && switchB);
console.log(result); // ${!(isSwitchAUp && isSwitchBUp)}

// In a function:
function logicalNAND(a, b) {
    return !(a && b);
}`,
      python: `# Python NAND operator
switch_a = ${isSwitchAUp} # ${isSwitchAUp ? "True" : "False"}
switch_b = ${isSwitchBUp} # ${isSwitchBUp ? "True" : "False"}
result = not (switch_a and switch_b)
print(result) # ${!(isSwitchAUp && isSwitchBUp) ? "True" : "False"}

# In a function:
def logical_nand(a, b):
    return not (a && b)`,
      cpp: `// C++ NAND operator
#include <iostream>
using namespace std;

int main() {
    bool switchA = ${isSwitchAUp ? "true" : "false"};
    bool switchB = ${isSwitchBUp ? "true" : "false"};
    
    bool result = !(switchA && switchB);
    cout << "Result: " << (result ? "true" : "false") << endl;
    
    return 0;
}`,
      java: `// Java NAND operator
public class BooleanLogic {
    public static void main(String[] args) {
        boolean switchA = ${isSwitchAUp ? "true" : "false"};
        boolean switchB = ${isSwitchBUp ? "true" : "false"};
        
        boolean result = !(switchA && switchB);
        System.out.println("Result: " + result); // ${!(
          isSwitchAUp && isSwitchBUp
        )}
    }
}`,
      ruby: `# Ruby NAND operator
switch_a = ${isSwitchAUp} # ${isSwitchAUp ? "true" : "false"}
switch_b = ${isSwitchBUp} # ${isSwitchBUp ? "true" : "false"}
result = !(switch_a && switch_b)
puts "Result: #{result}" # ${!(isSwitchAUp && isSwitchBUp)}

# In a function:
def logical_nand(a, b)
  !(a && b)
end`,
      swift: `// Swift NAND operator
let switchA = ${isSwitchAUp} // ${isSwitchAUp ? "true" : "false"}
let switchB = ${isSwitchBUp} // ${isSwitchBUp ? "true" : "false"}
let result = !(switchA && switchB)
print("Result: \\(result)") // ${!(isSwitchAUp && isSwitchBUp)}

// In a function:
func logicalNAND(_ a: Bool, _ b: Bool) -> Bool {
    return !(a && b)
}`,
      go: `// Go NAND implementation
package main

import "fmt"

func main() {
    switchA := ${isSwitchAUp ? "true" : "false"}
    switchB := ${isSwitchBUp ? "true" : "false"}
    
    result := !(switchA && switchB)
    fmt.Printf("Result: %t\\n", result) // ${!(isSwitchAUp && isSwitchBUp)}
}

// In a function:
func logicalNAND(a bool, b bool) bool {
    return !(a && b)
}`,
      rust: `// Rust NAND implementation
fn main() {
    let switch_a = ${isSwitchAUp ? "true" : "false"};
    let switch_b = ${isSwitchBUp ? "true" : "false"};
    
    let result = !(switch_a && switch_b);
    println!("Result: {}", result); // ${!(isSwitchAUp && isSwitchBUp)}
}

// In a function:
fn logical_nand(a: bool, b: bool) -> bool {
    !(a && b)
}`,
    },

    NOR: {
      js: `// JavaScript NOR operator
let switchA = ${isSwitchAUp}; // ${isSwitchAUp ? "true" : "false"}
let switchB = ${isSwitchBUp}; // ${isSwitchBUp ? "true" : "false"}
let result = !(switchA || switchB);
console.log(result); // ${!(isSwitchAUp || isSwitchBUp)}

// In a function:
function logicalNOR(a, b) {
    return !(a || b);
}`,
      python: `# Python NOR operator
switch_a = ${isSwitchAUp} # ${isSwitchAUp ? "True" : "False"}
switch_b = ${isSwitchBUp} # ${isSwitchBUp ? "True" : "False"}
result = not (switch_a or switch_b)
print(result) # ${!(isSwitchAUp || isSwitchBUp) ? "True" : "False"}

# In a function:
def logical_nor(a, b):
    return not (a || b)`,
      cpp: `// C++ NOR operator
#include <iostream>
using namespace std;

int main() {
    bool switchA = ${isSwitchAUp ? "true" : "false"};
    bool switchB = ${isSwitchBUp ? "true" : "false"};
    
    bool result = !(switchA || switchB);
    cout << "Result: " << (result ? "true" : "false") << endl;
    
    return 0;
}`,
      java: `// Java NOR operator
public class BooleanLogic {
    public static void main(String[] args) {
        boolean switchA = ${isSwitchAUp ? "true" : "false"};
        boolean switchB = ${isSwitchBUp ? "true" : "false"};
        
        boolean result = !(switchA || switchB);
        System.out.println("Result: " + result); // ${!(
          isSwitchAUp || isSwitchBUp
        )}
    }
}`,
      ruby: `# Ruby NOR operator
switch_a = ${isSwitchAUp} # ${isSwitchAUp ? "true" : "false"}
switch_b = ${isSwitchBUp} # ${isSwitchBUp ? "true" : "false"}
result = !(switch_a || switch_b)
puts "Result: #{result}" # ${!(isSwitchAUp || isSwitchBUp)}

# In a function:
def logical_nor(a, b)
  !(a || b)
end`,
      swift: `// Swift NOR operator
let switchA = ${isSwitchAUp} // ${isSwitchAUp ? "true" : "false"}
let switchB = ${isSwitchBUp} // ${isSwitchBUp ? "true" : "false"}
let result = !(switchA || switchB)
print("Result: \\(result)") // ${!(isSwitchAUp || isSwitchBUp)}

// In a function:
func logicalNOR(_ a: Bool, _ b: Bool) -> Bool {
    return !(a || b)
}`,
      go: `// Go NOR implementation
package main

import "fmt"

func main() {
    switchA := ${isSwitchAUp ? "true" : "false"}
    switchB := ${isSwitchBUp ? "true" : "false"}
    
    result := !(switchA || switchB)
    fmt.Printf("Result: %t\\n", result) // ${!(isSwitchAUp || isSwitchBUp)}
}

// In a function:
func logicalNOR(a bool, b bool) bool {
    return !(a || b)
}`,
      rust: `// Rust NOR implementation
fn main() {
    let switch_a = ${isSwitchAUp ? "true" : "false"};
    let switch_b = ${isSwitchBUp ? "true" : "false"};
    
    let result = !(switch_a || switch_b);
    println!("Result: {}", result); // ${!(isSwitchAUp || isSwitchBUp)}
}

// In a function:
fn logical_nor(a: bool, b: bool) -> bool {
    !(a || b)
}`,
    },

    XNOR: {
      js: `// JavaScript XNOR implementation
let switchA = ${isSwitchAUp}; // ${isSwitchAUp ? "true" : "false"}
let switchB = ${isSwitchBUp}; // ${isSwitchBUp ? "true" : "false"}
let result = switchA === switchB;
console.log(result); // ${isSwitchAUp === isSwitchBUp}

// In a function:
function logicalXNOR(a, b) {
    return a === b;
}`,
      python: `# Python XNOR implementation
switch_a = ${isSwitchAUp} # ${isSwitchAUp ? "True" : "False"}
switch_b = ${isSwitchBUp} # ${isSwitchBUp ? "True" : "False"}
result = switch_a == switch_b
print(result) # ${isSwitchAUp === isSwitchBUp ? "True" : "False"}

# In a function:
def logical_xnor(a, b):
    return a == b`,
      cpp: `// C++ XNOR implementation
#include <iostream>
using namespace std;

int main() {
    bool switchA = ${isSwitchAUp ? "true" : "false"};
    bool switchB = ${isSwitchBUp ? "true" : "false"};
    
    bool result = switchA == switchB;
    cout << "Result: " << (result ? "true" : "false") << endl;
    
    return 0;
}`,
      java: `// Java XNOR implementation
public class BooleanLogic {
    public static void main(String[] args) {
        boolean switchA = ${isSwitchAUp ? "true" : "false"};
        boolean switchB = ${isSwitchBUp ? "true" : "false"};
        
        boolean result = switchA == switchB;
        System.out.println("Result: " + result); // ${
          isSwitchAUp === isSwitchBUp
        }
    }
}`,
      ruby: `# Ruby XNOR implementation
switch_a = ${isSwitchAUp} # ${isSwitchAUp ? "true" : "false"}
switch_b = ${isSwitchBUp} # ${isSwitchBUp ? "true" : "false"}
result = switch_a == switch_b
puts "Result: #{result}" # ${isSwitchAUp === isSwitchBUp}

# In a function:
def logical_xnor(a, b)
  a == b
end`,
      swift: `// Swift XNOR implementation
let switchA = ${isSwitchAUp} // ${isSwitchAUp ? "true" : "false"}
let switchB = ${isSwitchBUp} // ${isSwitchBUp ? "true" : "false"}
let result = switchA == switchB
print("Result: \\(result)") // ${isSwitchAUp === isSwitchBUp}

// In a function:
func logicalXNOR(_ a: Bool, _ b: Bool) -> Bool {
    return a == b
}`,
      go: `// Go XNOR implementation
package main

import "fmt"

func main() {
    switchA := ${isSwitchAUp ? "true" : "false"}
    switchB := ${isSwitchBUp ? "true" : "false"}
    
    result := switchA == switchB
    fmt.Printf("Result: %t\\n", result) // ${isSwitchAUp === isSwitchBUp}
}

// In a function:
func logicalXNOR(a bool, b bool) bool {
    return a == b
}`,
      rust: `// Rust XNOR implementation
fn main() {
    let switch_a = ${isSwitchAUp ? "true" : "false"};
    let switch_b = ${isSwitchBUp ? "true" : "false"};
    
    let result = switch_a == switch_b;
    println!("Result: {}", result); // ${isSwitchAUp === isSwitchBUp}
}

// In a function:
fn logical_xnor(a: bool, b: bool) -> bool {
    a == b
}`,
    },

    NOTA: {
      js: `// JavaScript NOT operator for A
let switchA = ${isSwitchAUp}; // ${isSwitchAUp ? "true" : "false"}
let result = !switchA;
console.log(result); // ${!isSwitchAUp}

// In a function:
function logicalNOTA(a) {
    return !a;
}`,
      python: `# Python NOT operator for A
switch_a = ${isSwitchAUp} # ${isSwitchAUp ? "True" : "False"}
result = not switch_a
print(result) # ${!isSwitchAUp ? "True" : "False"}

# In a function:
def logical_not_a(a):
    return not a`,
      cpp: `// C++ NOT operator for A
#include <iostream>
using namespace std;

int main() {
    bool switchA = ${isSwitchAUp ? "true" : "false"};
    
    bool result = !switchA;
    cout << "Result: " << (result ? "true" : "false") << endl;
    
    return 0;
}`,
      java: `// Java NOT operator for A
public class BooleanLogic {
    public static void main(String[] args) {
        boolean switchA = ${isSwitchAUp ? "true" : "false"};
        
        boolean result = !switchA;
        System.out.println("Result: " + result); // ${!isSwitchAUp}
    }
}`,
      ruby: `# Ruby NOT operator for A
switch_a = ${isSwitchAUp} # ${isSwitchAUp ? "true" : "false"}
result = !switch_a
puts "Result: #{result}" # ${!isSwitchAUp}

# In a function:
def logical_not_a(a)
  !a
end`,
      swift: `// Swift NOT operator for A
let switchA = ${isSwitchAUp} // ${isSwitchAUp ? "true" : "false"}
let result = !switchA
print("Result: \\(result)") // ${!isSwitchAUp}

// In a function:
func logicalNOTA(_ a: Bool) -> Bool {
    return !a
}`,
      go: `// Go NOT operator for A
package main

import "fmt"

func main() {
    switchA := ${isSwitchAUp ? "true" : "false"}
    
    result := !switchA
    fmt.Printf("Result: %t\\n", result) // ${!isSwitchAUp}
}

// In a function:
func logicalNOTA(a bool) bool {
    return !a
}`,
      rust: `// Rust NOT operator for A
fn main() {
    let switch_a = ${isSwitchAUp ? "true" : "false"};
    
    let result = !switch_a;
    println!("Result: {}", result); // ${!isSwitchAUp}
}

// In a function:
fn logical_not_a(a: bool) -> bool {
    !a
}`,
    },

    NOTB: {
      js: `// JavaScript NOT operator for B
let switchB = ${isSwitchBUp}; // ${isSwitchBUp ? "true" : "false"}
let result = !switchB;
console.log(result); // ${!isSwitchBUp}

// In a function:
function logicalNOTB(b) {
    return !b;
}`,
      python: `# Python NOT operator for B
switch_b = ${isSwitchBUp} # ${isSwitchBUp ? "True" : "False"}
result = not switch_b
print(result) # ${!isSwitchBUp ? "True" : "False"}

# In a function:
def logical_not_b(b):
    return not b`,
      cpp: `// C++ NOT operator for B
#include <iostream>
using namespace std;

int main() {
    bool switchB = ${isSwitchBUp ? "true" : "false"};
    
    bool result = !switchB;
    cout << "Result: " << (result ? "true" : "false") << endl;
    
    return 0;
}`,
      java: `// Java NOT operator for B
public class BooleanLogic {
    public static void main(String[] args) {
        boolean switchB = ${isSwitchBUp ? "true" : "false"};
        
        boolean result = !switchB;
        System.out.println("Result: " + result); // ${!isSwitchBUp}
    }
}`,
      ruby: `# Ruby NOT operator for B
switch_b = ${isSwitchBUp} # ${isSwitchBUp ? "true" : "false"}
result = !switch_b
puts "Result: #{result}" # ${!isSwitchBUp}

# In a function:
def logical_not_b(b)
  !b
end`,
      swift: `// Swift NOT operator for B
let switchB = ${isSwitchBUp} // ${isSwitchBUp ? "true" : "false"}
let result = !switchB
print("Result: \\(result)") // ${!isSwitchBUp}

// In a function:
func logicalNOTB(_ b: Bool) -> Bool {
    return !b
}`,
      go: `// Go NOT operator for B
package main

import "fmt"

func main() {
    switchB := ${isSwitchBUp ? "true" : "false"}
    
    result := !switchB
    fmt.Printf("Result: %t\\n", result) // ${!isSwitchBUp}
}

// In a function:
func logicalNOTB(b bool) bool {
    return !b
}`,
      rust: `// Rust NOT operator for B
fn main() {
    let switch_b = ${isSwitchBUp ? "true" : "false"};
    
    let result = !switch_b;
    println!("Result: {}", result); // ${!isSwitchBUp}
}

// In a function:
fn logical_not_b(b: bool) -> bool {
    !b
}`,
    },
  };

  // Add a safe check before trying to access properties
  const examples = dynamicCodeExamples[currentOperation] || {
    js: `// Code example not available for ${currentOperation}`,
    python: `# Code example not available for ${currentOperation}`,
    cpp: `// C++ example not available for ${currentOperation}`,
    java: `// Java example not available for ${currentOperation}`,
  };

  // Update code blocks with the current operation's code
  jsCodeElement.textContent = examples.js;
  pythonCodeElement.textContent = examples.python;
  cppCodeElement.textContent = examples.cpp;
  javaCodeElement.textContent = examples.java;
  rubyCodeElement.textContent =
    examples.ruby || "# Ruby code example not available";
  swiftCodeElement.textContent =
    examples.swift || "// Swift code example not available";
  goCodeElement.textContent = examples.go || "// Go code example not available";
  rustCodeElement.textContent =
    examples.rust || "// Rust code example not available";

  // Highlight the code blocks
  hljs.highlightElement(jsCodeElement);
  hljs.highlightElement(pythonCodeElement);
  hljs.highlightElement(cppCodeElement);
  hljs.highlightElement(javaCodeElement);
  hljs.highlightElement(rubyCodeElement);
  hljs.highlightElement(swiftCodeElement);
  hljs.highlightElement(goCodeElement);
  hljs.highlightElement(rustCodeElement);
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

  rubyTabBtn.addEventListener("click", () => {
    setActiveTab("ruby");
  });

  swiftTabBtn.addEventListener("click", () => {
    setActiveTab("swift");
  });

  goTabBtn.addEventListener("click", () => {
    setActiveTab("go");
  });

  rustTabBtn.addEventListener("click", () => {
    setActiveTab("rust");
  });
}

function setActiveTab(language) {
  // Remove active class from all tabs
  [
    jsTabBtn,
    pythonTabBtn,
    cppTabBtn,
    javaTabBtn,
    rubyTabBtn,
    swiftTabBtn,
    goTabBtn,
    rustTabBtn,
  ].forEach((btn) => {
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

// Loading indicator functions
function showLoading() {
  loadingIndicatorElement.style.display = "block";
}

function hideLoading() {
  loadingIndicatorElement.style.display = "none";
}

// Combined update function
function updateAll() {
  showLoading();

  // Small timeout to ensure UI updates happen smoothly
  setTimeout(() => {
    const lightResult = calculateResult(
      currentOperation,
      isSwitchAUp,
      isSwitchBUp
    );
    updateLightVisual(lightResult);
    updateStatusDisplay(lightResult);
    generateTruthTable();
    updateOperationDescription();

    updateCodeExamples();

    // Hide loading after a slight delay for better visual effect
    setTimeout(hideLoading, 300);
  }, 10);
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
    // If auto demo is running, don't process keyboard events
    if (isAutoDemoRunning) return;

    // Toggle switches with number keys
    if (e.key === "1") {
      handleSwitchToggle("A");
    } else if (e.key === "2") {
      handleSwitchToggle("B");
    }

    // Toggle truth table mode with 't'
    if (e.key === "t" && e.target === document.body) {
      toggleTruthTableMode();
    }

    // Toggle auto demo with 'a'
    if (e.key === "a" && e.target === document.body) {
      toggleAutoDemo();
    }

    // Radio button navigation
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

// --- Truth Table Mode Functions ---
function toggleTruthTableMode() {
  isInTruthTableMode = !isInTruthTableMode;

  if (truthTableModeToggle) {
    truthTableModeToggle.checked = isInTruthTableMode;
  }

  // Save preference
  localStorage.setItem("booleanDemoTruthTableMode", isInTruthTableMode);

  // Update UI for truth table mode
  document.body.classList.toggle("truth-table-mode", isInTruthTableMode);

  // Update text on toggle button if it exists
  const toggleLabel = document.querySelector(".truth-table-toggle span");
  if (toggleLabel) {
    toggleLabel.textContent = isInTruthTableMode
      ? "Exit Truth Table Mode"
      : "Truth Table Mode";
  }
}

// --- Auto Demo Functions ---
function toggleAutoDemo() {
  isAutoDemoRunning = !isAutoDemoRunning;

  if (autoDemoToggle) {
    autoDemoToggle.checked = isAutoDemoRunning;
  }

  if (isAutoDemoRunning) {
    startAutoDemo();
  } else {
    stopAutoDemo();
  }

  // Update text on toggle button if it exists
  const toggleLabel = document.querySelector(".auto-demo-toggle span");
  if (toggleLabel) {
    toggleLabel.textContent = isAutoDemoRunning
      ? "Stop Auto Demo"
      : "Start Auto Demo";
  }
}

function startAutoDemo() {
  // Clear any existing interval
  if (autoDemoInterval) {
    clearInterval(autoDemoInterval);
  }

  // Set initial state
  autoDemoOperationIndex = 0;
  autoDemoStateIndex = 0;

  // Update to first demo state
  updateToDemoState();

  // Start interval
  autoDemoInterval = setInterval(() => {
    // Move to next state
    autoDemoStateIndex = (autoDemoStateIndex + 1) % AUTO_DEMO_STATES.length;

    // If we've gone through all states for this operation, move to next operation
    if (autoDemoStateIndex === 0) {
      autoDemoOperationIndex =
        (autoDemoOperationIndex + 1) % AUTO_DEMO_OPERATIONS.length;
    }

    // Update UI
    updateToDemoState();
  }, AUTO_DEMO_INTERVAL);

  // Show indication that demo is running
  document.body.classList.add("demo-running");
}

function stopAutoDemo() {
  if (autoDemoInterval) {
    clearInterval(autoDemoInterval);
    autoDemoInterval = null;
  }

  // Remove indication that demo is running
  document.body.classList.remove("demo-running");
}

function updateToDemoState() {
  // Get current operation and state
  const operation = AUTO_DEMO_OPERATIONS[autoDemoOperationIndex];
  const state = AUTO_DEMO_STATES[autoDemoStateIndex];

  // Set operation
  currentOperation = operation;
  const operationRadio = document.querySelector(
    `input[name="operation"][value="${operation}"]`
  );
  if (operationRadio) {
    operationRadio.checked = true;
  }

  // Set switch states
  isSwitchAUp = state.a;
  isSwitchBUp = state.b;

  // Update switch visuals
  switchAElement.classList.toggle("up", isSwitchAUp);
  switchAElement.classList.toggle("down", !isSwitchAUp);
  switchBElement.classList.toggle("up", isSwitchBUp);
  switchBElement.classList.toggle("down", !isSwitchBUp);

  // Update ARIA states
  switchAElement.setAttribute("aria-pressed", isSwitchAUp ? "true" : "false");
  switchBElement.setAttribute("aria-pressed", isSwitchBUp ? "true" : "false");

  // Update rest of UI
  updateAll();
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

// --- Copy Code Button ---
function setupCopyCodeButtons() {
  // Create copy buttons for each code block
  document.querySelectorAll(".code-content pre").forEach((pre, index) => {
    const codeBlock = pre.querySelector("code");
    const language = codeBlock.id.replace("Code", "");

    // Create button
    const copyButton = document.createElement("button");
    copyButton.className = "copy-button";
    copyButton.setAttribute("aria-label", `Copy ${language} code to clipboard`);
    copyButton.innerHTML = '<span class="copy-icon">📋</span> Copy';

    // Add to pre element
    pre.appendChild(copyButton);

    // Add click handler
    copyButton.addEventListener("click", () => {
      const code = codeBlock.textContent;
      navigator.clipboard
        .writeText(code)
        .then(() => {
          // Change button text temporarily
          copyButton.innerHTML = '<span class="copy-icon">✅</span> Copied!';
          copyButton.classList.add("copied");

          // Reset after 2 seconds
          setTimeout(() => {
            copyButton.innerHTML = '<span class="copy-icon">📋</span> Copy';
            copyButton.classList.remove("copied");
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          copyButton.innerHTML = '<span class="copy-icon">❌</span> Error';

          // Reset after 2 seconds
          setTimeout(() => {
            copyButton.innerHTML = '<span class="copy-icon">📋</span> Copy';
          }, 2000);
        });
    });
  });
}

// --- Create Mode Toggles UI ---
function createModeToggles() {
  // Create container for mode toggles
  const togglesContainer = document.createElement("div");
  togglesContainer.className = "mode-toggles";
  togglesContainer.setAttribute("aria-label", "Display mode options");

  // Create truth table mode toggle
  const truthTableToggleLabel = document.createElement("label");
  truthTableToggleLabel.className = "mode-toggle truth-table-toggle";

  truthTableModeToggle = document.createElement("input");
  truthTableModeToggle.type = "checkbox";
  truthTableModeToggle.checked = isInTruthTableMode;
  truthTableModeToggle.addEventListener("change", () => {
    toggleTruthTableMode();
  });

  const truthTableToggleText = document.createElement("span");
  truthTableToggleText.textContent = isInTruthTableMode
    ? "Exit Truth Table Mode"
    : "Truth Table Mode";
  truthTableToggleText.setAttribute(
    "title",
    "Focus on truth table display (shortcut: t)"
  );

  truthTableToggleLabel.appendChild(truthTableModeToggle);
  truthTableToggleLabel.appendChild(truthTableToggleText);

  // Create auto demo toggle
  const autoDemoToggleLabel = document.createElement("label");
  autoDemoToggleLabel.className = "mode-toggle auto-demo-toggle";

  autoDemoToggle = document.createElement("input");
  autoDemoToggle.type = "checkbox";
  autoDemoToggle.checked = isAutoDemoRunning;
  autoDemoToggle.addEventListener("change", () => {
    toggleAutoDemo();
  });

  const autoDemoToggleText = document.createElement("span");
  autoDemoToggleText.textContent = "Start Auto Demo";
  autoDemoToggleText.setAttribute(
    "title",
    "Automatically cycle through operations and states (shortcut: a)"
  );

  autoDemoToggleLabel.appendChild(autoDemoToggle);
  autoDemoToggleLabel.appendChild(autoDemoToggleText);

  // Add toggles to container
  togglesContainer.appendChild(truthTableToggleLabel);
  togglesContainer.appendChild(autoDemoToggleLabel);

  // Add to page - after the operation selection
  const controlsSection = document.querySelector(".controls");
  if (controlsSection) {
    controlsSection.after(togglesContainer);
  }
}

// --- Enhance Loading Animation ---
function enhanceLoadingAnimation() {
  // Add pulsing effect to loading indicator
  loadingIndicatorElement.innerHTML = `
    <div class="loading-pulse"></div>
    <div class="loading-text">Updating...</div>
  `;
}

// --- Initialization ---
function initialize() {
  // Force dark mode for all users
  document.body.classList.add("force-dark");

  // Update the year in the footer
  const currentYearSpan = document.getElementById("currentYear");
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Restore preferences from localStorage
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

  // Restore truth table mode preference
  const savedTruthTableMode = localStorage.getItem("booleanDemoTruthTableMode");
  if (savedTruthTableMode === "true") {
    isInTruthTableMode = true;
    document.body.classList.add("truth-table-mode");
  }

  // Initialize ARIA states
  switchAElement.setAttribute("aria-pressed", "false");
  switchBElement.setAttribute("aria-pressed", "true");

  // Add ARIA labels for better accessibility
  document.querySelectorAll(".truth-table-area").forEach((table) => {
    table.setAttribute("role", "region");
    table.setAttribute(
      "aria-label",
      "Truth table showing all possible input combinations and results"
    );
  });

  // Removed circuit diagram container code

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

  // Setup copy code buttons
  setupCopyCodeButtons();

  // Create mode toggles
  createModeToggles();

  // Enhance loading animation
  enhanceLoadingAnimation();

  // Perform initial update
  updateAll();
}

// --- Keyboard Shortcuts Modal (removed) ---

// Run initialization when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initialize();
});
