var executionTimes;

var instructionsQ = [];
var AddReserv = [];
var MulReserv = [];
var LDReserv = [];
var SDReserv = [];
var Registers = [
  { name: "F0", Q: "", V: 0 },
  { name: "F1", Q: "", V: 0 },
  { name: "F2", Q: "", V: 0 },
  { name: "F3", Q: "", V: 0 },
  { name: "F4", Q: "", V: 0 },
  { name: "F5", Q: "", V: 0 },
  { name: "F6", Q: "", V: 0 },
  { name: "F7", Q: "", V: 0 },
  { name: "F8", Q: "", V: 0 },
  { name: "F9", Q: "", V: 0 },
  { name: "F10", Q: "", V: 0 },
  { name: "F11", Q: "", V: 0 },
  { name: "F12", Q: "", V: 0 },
  { name: "F13", Q: "", V: 0 },
  { name: "F14", Q: "", V: 0 },
  { name: "F15", Q: "", V: 0 },
  { name: "F16", Q: "", V: 0 },
  { name: "F17", Q: "", V: 0 },
  { name: "F18", Q: "", V: 0 },
  { name: "F19", Q: "", V: 0 },
  { name: "F20", Q: "", V: 0 },
  { name: "F21", Q: "", V: 0 },
  { name: "F22", Q: "", V: 0 },
  { name: "F23", Q: "", V: 0 },
  { name: "F24", Q: "", V: 0 },
  { name: "F25", Q: "", V: 0 },
  { name: "F26", Q: "", V: 0 },
  { name: "F27", Q: "", V: 0 },
  { name: "F28", Q: "", V: 0 },
  { name: "F29", Q: "", V: 0 },
  { name: "F30", Q: "", V: 0 },
  { name: "F31", Q: "", V: 0 },
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


  //Save instruction table
  for (var i = 1; i < document.getElementById("IQ").rows.length; i++) {
    if (
      document
        .getElementById("IQ")
        .rows[i].cells[0].getElementsByTagName("select")[0].value != "OP"
    ) {
      var newrow = {
        OP: document
          .getElementById("IQ")
          .rows[i].cells[0].getElementsByTagName("select")[0].value,
        dest: ""+  document
        .getElementById("IQ")
        .rows[i].cells[1].innerHTML,
        R1: "",
        R2: "",
        Issue: 0,
        Exec: 0,
        writeRes: 0,
      };

      instructionsQ = instructionsQ.push(newrow);
    }

    document
    .getElementById("IQ")
    .rows[i].cells[0].getElementsByTagName("select")[0].disabled=true;

    document
    .getElementById("IQ")
    .rows[i].cells[1].getElementsByTagName("input")[0].disabled=true;
  }

  document.getElementsByName("LD")[0].disabled = true;
  document.getElementsByName("SD")[0].disabled = true;
  document.getElementsByName("ADDSUB")[0].disabled = true;
  document.getElementsByName("MUL")[0].disabled = true;
  document.getElementsByName("DIV")[0].disabled = true;

  console.log(executionTimes.SDet);
}

function next() {
  incrementClk();
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
