var addReserv_front = document.getElementById("ART");
var mulReserv_front = document.getElementById("MRT");
var LDReserv_front = document.getElementById("LRT");
var SDReserv_front = document.getElementById("SRT");
var regFile_front = document.getElementById("RF");
var IQ_front = document.getElementById("IQ");
var executionTimes;
var current = 0;
var instructionsQ = []; //[{op,dest,r1,r2,issue,exec,writeRes,time,reserIndex}]
var AddReserv = [
  { tag: "A1", oper: "", Vj: "", Vk: "", Qj: "", Qk: "", Busy: 0 },
  { tag: "A2", oper: "", Vj: "", Vk: "", Qj: "", Qk: "", Busy: 0 },
  { tag: "A3", oper: "", Vj: "", Vk: "", Qj: "", Qk: "", Busy: 0 },
]; //[{tag,oper,Vj,Vk,Qj,Qk,Busy}]
var MulReserv = [
  { tag: "M1", oper: "", Vj: "", Vk: "", Qj: "", Qk: "", Busy: 0 },
  { tag: "M2", oper: "", Vj: "", Vk: "", Qj: "", Qk: "", Busy: 0 },
]; //[{tag,oper,Vj,Vk,Qj,Qk,Busy}]
var LDReserv = [
  { tag: "L1", Address: "", Busy: 0 },
  { tag: "L2", Address: "", Busy: 0 },
  { tag: "L3", Address: "", Busy: 0 },
]; // [{tag,add,busy}]
var SDReserv = [
  { tag: "S1", Address: "", V: "", Q: "", Busy: 0 },
  { tag: "S2", Address: "", V: "", Q: "", Busy: 0 },
  { tag: "S3", Address: "", V: "", Q: "", Busy: 0 },
]; // [{tag,add,V,Q,Busy}]
var Registers = [
  { name: "F0", Q: "", V: "1" },
  { name: "F1", Q: "", V: "2" },
  { name: "F2", Q: "", V: "3" },
  { name: "F3", Q: "", V: "4" },
  { name: "F4", Q: "", V: "5" },
  { name: "F5", Q: "", V: "6" },
  { name: "F6", Q: "", V: "7" },
  { name: "F7", Q: "", V: "8" },
  { name: "F8", Q: "", V: "9" },
  { name: "F9", Q: "", V: "10" },
  { name: "F10", Q: "", V: "11" },
  { name: "F11", Q: "", V: "12" },
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
var memory = [64];

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
        time: -8,
        reserIndex: -1,
        result: "",
        state: 0,
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
  next();
  reflectOnFront();
}

function next() {
  incrementClk();
  issue();
  execute();
  writeResult();
  reflectOnFront();
}
//MUL R3, R1, R2
function issue() {
  //    if insturction available
  if (instructionsQ.length > 0) {
    //If reservation station free (no structural hazard)
    if (
      current < instructionsQ.length &&
      canIssue(instructionsQ[current].op) != -1
    ) {
      //[{op,dest,r1,r2,issue,exec,writeRes}]
      //Issue instr & sends operands (renames registers).
      //Send operands to reservation station if they are in registers
      //If operands are not available in registers then keep track of Rs that will produce the operand (achieves renaming to avoid WAR and WAW)
      switch (instructionsQ[current].op) {
        case "LD":
          instructionsQ[current].issue = clkCycle;
          var x = LDReservAvailable();
          LDReserv[x].Busy = 1;
          LDReserv.Address = instructionsQ[current].r1;
          instructionsQ[current].reserIndex = x;
          break;
        case "SD":
          instructionsQ[current].issue = clkCycle;
          var x = SDReservAvailable();
          SDReserv[x].Busy = 1;
          SDReserv[x].Address = instructionsQ[current].r1;
          if (availableRegister(instructionsQ[current].dest)) {
            var r = parseInt(instructionsQ[current].dest.substring(1), 10);
            console.log("line 163 r " + r);
            SDReserv[x].V = Registers[r].V;
          } else {
            var r = parseInt(instructionsQ[current].dest.substring(1), 10);
            SDReserv[x].Q = Registers[r].Q;
          }
          console.log(Registers);
          instructionsQ[current].reserIndex = x;
          break;
        //  ADD R5, R3, R4
        //[{op,dest,r1,r2,issue,exec,writeRes,time}]
        case "ADD":
        case "SUB":
          instructionsQ[current].issue = clkCycle;
          //[{tag,oper,Vj,Vk,Qj,Qk,Busy}]
          var x = AddReservAvailable(); // 0
          AddReserv[x].Busy = 1;
          AddReserv[x].oper = instructionsQ[current].op;

          var r = parseInt(instructionsQ[current].r1.substring(1), 10);
          if (availableRegister(instructionsQ[current].r1)) {
            AddReserv[x].Vj = Registers[r].V;
          } else {
            AddReserv[x].Qj = Registers[r].Q;
          }
          r = parseInt(instructionsQ[current].r2.substring(1), 10);
          if (availableRegister(instructionsQ[current].r2)) {
            AddReserv[x].Vk = Registers[r].V;
          } else {
            AddReserv[x].Qk = Registers[r].Q;
          }
          r = parseInt(instructionsQ[current].dest.substring(1), 10);
          Registers[r].Q = AddReserv[x].tag;
          Registers[r].V = "";
          instructionsQ[current].reserIndex = x;
          break;
        //MUL R3, R1, R2
        //[{op,dest,r1,r2,issue,exec,writeRes,time}]
        case "MUL":
        case "DIV":
          instructionsQ[current].issue = clkCycle;
          var x = MulReservAvailable();
          console.log("x " + x);
          MulReserv[x].Busy = 1;
          MulReserv[x].oper = instructionsQ[current].op;
          var r = parseInt(instructionsQ[current].r1.substring(1), 10);
          if (availableRegister(instructionsQ[current].r1)) {
            MulReserv[x].Vj = Registers[r].V;
          } else {
            MulReserv[x].Qj = Registers[r].Q;
          }
          r = parseInt(instructionsQ[current].r2.substring(1), 10);
          if (availableRegister(instructionsQ[current].r2)) {
            MulReserv[x].Vk = Registers[r].V;
          } else {
            MulReserv[x].Qk = Registers[r].Q;
          }
          r = parseInt(instructionsQ[current].dest.substring(1), 10);
          Registers[r].Q = MulReserv[x].tag;
          Registers[r].V = "";
          instructionsQ[current].reserIndex = x;
          break;
      }
      current++;
    }
  }
}
// Mul F0 F1 F2
// Add F3 F0 F2
function execute() {
  for (var i = 0; i < current; i++) {
    if (parseInt(instructionsQ[i].issue) != parseInt(clkCycle)) {
      var index = instructionsQ[i].reserIndex;
      if (parseInt(instructionsQ[i].time) == clkCycle)
        instructionsQ[i].exec += " : " + clkCycle;
      switch (instructionsQ[i].op) {
        case "LD":
          return LDReservAvailable();
        case "SD":
          return SDReservAvailable();
        case "ADD":
          if (
            AddReserv[index].Vj != "" &&
            AddReserv[index].Vk != "" &&
            instructionsQ[i].exec == 0
          ) {
            instructionsQ[i].exec = clkCycle;

            instructionsQ[i].time =
              parseInt(clkCycle) + parseInt(executionTimes.ADDSUBet) - 1;
            instructionsQ[i].result =
              parseInt(AddReserv[index].Vj + "", 10) +
              parseInt(AddReserv[index].Vk + "", 10);
          }
          break;
        case "SUB":
          if (
            AddReserv[index].Vj != "" &&
            AddReserv[index].Vk != "" &&
            instructionsQ[i].exec == 0
          ) {
            instructionsQ[i].exec = clkCycle;

            instructionsQ[i].time =
              parseInt(clkCycle) + parseInt(executionTimes.ADDSUBet) - 1;
            instructionsQ[i].result =
              parseInt(AddReserv[index].Vj + "", 10) -
              parseInt(AddReserv[index].Vk + "", 10);
          }
          break;
        case "MUL":
          if (
            MulReserv[index].Vj != "" &&
            MulReserv[index].Vk != "" &&
            instructionsQ[i].exec == ""
          ) {
            instructionsQ[i].exec = clkCycle;

            instructionsQ[i].time =
              parseInt(clkCycle) + parseInt(executionTimes.MULet) - 1;
            instructionsQ[i].result =
              parseInt(MulReserv[index].Vj + "", 10) *
              parseInt(MulReserv[index].Vk + "", 10);
          }
          break;
        case "DIV":
          return MulReservAvailable();
      }
    }
  }
}

//[{op,dest,r1,r2,issue,exec,writeRes,time,reserIndex,result}]
// in the write back cycle:
// 1- remove from reser table //
// 2- write back to register file //
// 3- write back to tags in the reser tables //
// 4- update writeRes in the IQ //

function writeResult() {
  for (var i = 0; i < current; i++) {
    if (instructionsQ[i].time + 1 === clkCycle) {
      var index = instructionsQ[i].reserIndex;
      switch (instructionsQ[i].op) {
        case "LD":
          return LDReservAvailable();
        case "SD":
          return SDReservAvailable();
        case "ADD":
        case "SUB":
          var tag = AddReserv[index].tag;
          searchReservationTables(tag, instructionsQ[i].result);
          var r = parseInt(instructionsQ[i].dest.substring(1), 10);
          Registers[r].Q = "";
          Registers[r].V = instructionsQ[i].result;
          AddReserv[index].Vj = "";
          AddReserv[index].Vk = "";
          AddReserv[index].Qj = "";
          AddReserv[index].Qk = "";
          AddReserv[index].oper = "";
          AddReserv[index].Busy = 0;
          instructionsQ[i].writeRes = clkCycle;
          break;
        case "MUL":
        case "DIV":
          var tag = MulReserv[index].tag;
          searchReservationTables(tag, instructionsQ[i].result);
          var r = parseInt(instructionsQ[i].dest.substring(1), 10);
          Registers[r].Q = "";
          Registers[r].V = instructionsQ[i].result;
          MulReserv[index].Vj = "";
          MulReserv[index].Vk = "";
          MulReserv[index].Qj = "";
          MulReserv[index].Qk = "";
          MulReserv[index].oper = "";
          MulReserv[index].Busy = 0;
          instructionsQ[i].writeRes = clkCycle;
          break;
      }
      // the first inst issued will be executed :)
    }
  }
}

function searchReservationTables(tag, result) {
  for (var i = 0; i < 3; i++) {
    if (AddReserv[i].Qj === tag) {
      AddReserv[i].Qj = "";
      AddReserv[i].Vj = result;
    }
    if (AddReserv[i].Qk === tag) {
      AddReserv[i].Qk = "";
      AddReserv[i].Vk = result;
    }
  }
  for (var i = 0; i < 2; i++) {
    if (MulReserv[i].Qj === tag) {
      MulReserv[i].Qj = "";
      MulReserv[i].Vj = result;
    }
    if (MulReserv[i].Qk === tag) {
      MulReserv[i].Qk = "";
      MulReserv[i].Vk = result;
    }
  }
  for (var i = 0; i < 3; i++) {
    if (SDReserv[i].Q === tag) {
      SDReserv[i].Q = "";
      SDReserv[i].V = result;
    }
  }
}

function AddReservAvailable() {
  for (var i = 0; i < 3; i++) {
    if (AddReserv[i].Busy === 0) {
      return i;
    }
  }
  return -1;
}

function MulReservAvailable() {
  for (var i = 0; i < 2; i++) {
    if (MulReserv[i].Busy === 0) {
      return i;
    }
  }
  return -1;
}

function LDReservAvailable() {
  for (var i = 0; i < 3; i++) {
    if (LDReserv[i].Busy === 0) {
      return i;
    }
  }
  return -1;
}

function SDReservAvailable() {
  for (var i = 0; i < 3; i++) {
    if (SDReserv[i].Busy === 0) {
      return i;
    }
  }
  return -1;
}

function availableRegister(register) {
  var r = parseInt(register.substring(1), 10);
  if (Registers[r].V !== "") return true;
  return false;
}

function canIssue(op) {
  switch (op) {
    case "LD":
      return LDReservAvailable();
    case "SD":
      return SDReservAvailable();
    case "ADD":
    case "SUB":
      return AddReservAvailable();
    case "MUL":
    case "DIV":
      return MulReservAvailable();
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

function reflectOnFront() {
  // AddReserv
  for (var i = 1; i < 4; i++) {
    addReserv_front.rows[i].cells[1].innerHTML = AddReserv[i - 1].oper;
    addReserv_front.rows[i].cells[2].innerHTML = AddReserv[i - 1].Vj;
    addReserv_front.rows[i].cells[3].innerHTML = AddReserv[i - 1].Vk;
    addReserv_front.rows[i].cells[4].innerHTML = AddReserv[i - 1].Qj;
    addReserv_front.rows[i].cells[5].innerHTML = AddReserv[i - 1].Qk;
    addReserv_front.rows[i].cells[6].innerHTML = AddReserv[i - 1].Busy;
  }
  // MuLReserv
  for (var i = 1; i < 3; i++) {
    mulReserv_front.rows[i].cells[1].innerHTML = MulReserv[i - 1].oper;
    mulReserv_front.rows[i].cells[2].innerHTML = MulReserv[i - 1].Vj;
    mulReserv_front.rows[i].cells[3].innerHTML = MulReserv[i - 1].Vk;
    mulReserv_front.rows[i].cells[4].innerHTML = MulReserv[i - 1].Qj;
    mulReserv_front.rows[i].cells[5].innerHTML = MulReserv[i - 1].Qk;
    mulReserv_front.rows[i].cells[6].innerHTML = MulReserv[i - 1].Busy;
  }
  // SDReserv
  for (var i = 1; i < 4; i++) {
    LDReserv_front.rows[i].cells[1].innerHTML = LDReserv[i - 1].Address;
    LDReserv_front.rows[i].cells[2].innerHTML = LDReserv[i - 1].Busy;
  }
  // LDReserv
  for (var i = 1; i < 4; i++) {
    SDReserv_front.rows[i].cells[1].innerHTML = SDReserv[i - 1].Address;
    SDReserv_front.rows[i].cells[2].innerHTML = SDReserv[i - 1].V;
    SDReserv_front.rows[i].cells[3].innerHTML = SDReserv[i - 1].Q;
    SDReserv_front.rows[i].cells[4].innerHTML = SDReserv[i - 1].Busy;
  }
  // LDReserv
  for (var i = 1; i < 33; i++) {
    regFile_front.rows[i].cells[1].innerHTML = Registers[i - 1].Q;
    regFile_front.rows[i].cells[2].innerHTML = Registers[i - 1].V;
  }

  // IQ
  for (var i = 1; i < instructionsQ.length + 1; i++) {
    IQ_front.rows[i].cells[4].innerHTML = instructionsQ[i - 1].issue;
    IQ_front.rows[i].cells[5].innerHTML = instructionsQ[i - 1].exec;
    IQ_front.rows[i].cells[6].innerHTML = instructionsQ[i - 1].writeRes;
  }
}
