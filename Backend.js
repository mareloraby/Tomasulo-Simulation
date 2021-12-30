

var executionTimes;
var instructionsQ = []; //[{op,dest,r1,r2,issue,exec,writeRes}]
var AddReserv = [
  { tag: "A1", oper: "", Vj: "", Vk: "", Qj: "", Qk: "", Busy: 0 },
  { tag: "A2", oper: "", Vj: "", Vk: "", Qj: "", Qk: "", Busy: 0 },
  { tag: "A3", oper: "", Vj: "", Vk: "", Qj: "", Qk: "", Busy: 0 },
]; //[{tag,oper,Vj,Vk,Qj,Qk,Busy}]
var MulReserv = [
  { tag: "M1", oper: "", Vj: "", Vk: "", Qj: "", Qk: "", Busy: 0 },
  { tag: "M2", oper: "", Vj: "", Vk: "", Qj: "", Qk: "", Busy: 0 },
]; //[{tag,oper,Vj,Vk,Qj,Qk,Busy}]
var LDReserv = [];
var SDReserv = [];
var Registers = [
  { name: "F0", Q: "", V: "" },
  { name: "F1", Q: "", V: "" },
  { name: "F2", Q: "", V: "" },
  { name: "F3", Q: "", V: "" },
  { name: "F4", Q: "", V: "" },
  { name: "F5", Q: "", V: "" },
  { name: "F6", Q: "", V: "" },
  { name: "F7", Q: "", V: "" },
  { name: "F8", Q: "", V: "" },
  { name: "F9", Q: "", V: "" },
  { name: "F10", Q: "", V: "" },
  { name: "F11", Q: "", V: "" },
  { name: "F12", Q: "", V: "" },
  { name: "F13", Q: "", V: "" },
  { name: "F14", Q: "", V: "" },
  { name: "F15", Q: "", V: "" },
  { name: "F16", Q: "", V: "" },
  { name: "F17", Q: "", V: "" },
  { name: "F18", Q: "", V: "" },
  { name: "F19", Q: "", V: "" },
  { name: "F20", Q: "", V: "" },
  { name: "F21", Q: "", V: "" },
  { name: "F22", Q: "", V: "" },
  { name: "F23", Q: "", V: "" },
  { name: "F24", Q: "", V: "" },
  { name: "F25", Q: "", V: "" },
  { name: "F26", Q: "", V: "" },
  { name: "F27", Q: "", V: "" },
  { name: "F28", Q: "", V: "" },
  { name: "F29", Q: "", V: "" },
  { name: "F30", Q: "", V: "" },
  { name: "F31", Q: "", V: "" },
];
var memory = [];

function start() {
  document.getElementById("startBtn").style.visibility = "hidden";
  document.getElementById("nextBtn").style.visibility = "visible";

  executionTimes = {
    LDet: document.getElementsByName("LD")[0].value,
    SDet: document.getElementsByName("SD")[0].value,
    ADDSUBet: document.getElementsByName("ADDSUB")[0].value,
    MULet: document.getElementsByName("MUL")[0].value,
    DIVet: document.getElementsByName("DIV")[0].value,
  };

  //Save instructions
  for (var i = 1; i < 11; i++) {
    if (
      document
        .getElementById("IQ")
        .rows[i].cells[0].getElementsByTagName("select")[0].value !== "OP"
    ) {
      var newrow = {
        op: document
          .getElementById("IQ")
          .rows[i].cells[0].getElementsByTagName("select")[0].value,
        dest: document
          .getElementById("IQ")
          .rows[i].cells[1].getElementsByTagName("input")[0].value,
        r1: document
          .getElementById("IQ")
          .rows[i].cells[2].getElementsByTagName("input")[0].value,
        r2: document
          .getElementById("IQ")
          .rows[i].cells[3].getElementsByTagName("input")[0].value,
        issue: 0,
        exec: 0,
        writeRes: 0,
      };

      instructionsQ.push(newrow);
    }

    document
      .getElementById("IQ")
      .rows[i].cells[0].getElementsByTagName("select")[0].disabled = true;

    document
      .getElementById("IQ")
      .rows[i].cells[1].getElementsByTagName("input")[0].disabled = true;

    document
      .getElementById("IQ")
      .rows[i].cells[2].getElementsByTagName("input")[0].disabled = true;

    document
      .getElementById("IQ")
      .rows[i].cells[3].getElementsByTagName("input")[0].disabled = true;
  }

  document.getElementsByName("LD")[0].disabled = true;
  document.getElementsByName("SD")[0].disabled = true;
  document.getElementsByName("ADDSUB")[0].disabled = true;
  document.getElementsByName("MUL")[0].disabled = true;
  document.getElementsByName("DIV")[0].disabled = true;

  console.log(instructionsQ);
}

function next() {
  incrementClk();
}

function issue() {
  //    if insturction available
  if (instructionsQ.length > 0) {
    //If reservation station free (no structural hazard)
    if (canIssue(instructionsQ[0].op)) {

      //Issue instr & sends operands (renames registers).
      //Send operands to reservation station if they are in registers
      //If operands are not available in registers then keep track of Rs that will produce the operand (achieves renaming to avoid WAR and WAW)
    }
  }
}

function canIssue(op) {
  switch (op) {
    case "LD":
      return LDReserv.length != 3;
    case "SD":
      return SDReserv.length != 3;
    case "ADD":
    case "SUB":
      return AddReserv.length != 3;
    case "MUL":
    case "DIV":
      return MulReserv.length != 2;
  }
}

var clkCycle;
function incrementClk() {
  clkCycle = parseInt(document.getElementById("getClkCycle").innerHTML, 10);
  clkCycle = isNaN(clkCycle) ? 0 : clkCycle;
  clkCycle++;
  document.getElementById("getClkCycle").innerHTML = clkCycle;
}

// var myTable = document.getElementById('IQ');
// myTable.rows[1].cells[0].innerHTML = 'HIIII';
// console.log(document.getElementById('IQ'));

/*pop(): Remove an item from the end of an array.
push(): Add items to the end of an array.
shift(): Remove an item from the beginning of an array.
unshift(): Add items to the beginning of an array.*/
