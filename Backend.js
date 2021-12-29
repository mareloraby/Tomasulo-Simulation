var memory = [];
var executionTimes = [];
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
  { name: "F31", Q: "", V: 0 }

];




var clkCycle;
function incrementClk(){
    clkCycle = parseInt(document.getElementById('getClkCycle').innerHTML, 10);
    clkCycle = isNaN(clkCycle) ? 0 : clkCycle;
    clkCycle++;
    document.getElementById('getClkCycle').innerHTML = clkCycle;




    
}

// var myTable = document.getElementById('IQ');
// myTable.rows[1].cells[0].innerHTML = 'HIIII';
// console.log(document.getElementById('IQ'));
