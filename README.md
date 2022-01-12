# Motivation
The aim of the project is to simulate the tomasulo algorithm for a floating-point MIPS-like
instruction pipeline, demonstrating out-of-order execution in the same way it was
presented in the lecture through a tabulated visualization. 

![Simulation](https://user-images.githubusercontent.com/42250266/149142658-dc77c837-ac59-440c-8a8b-d3bf8cf30107.jpg)

# Implementation
We use HTML and JS to create our simulator. We started with creating the tables with
HTML to have our simulator’s frontend ready. Then we represented them in the backend
using arrays like:-
-  Memory Table (Memory, 64 locations): holds the available memory
locations and their contents. The contents of the memory are generated
randomly with the start of the simulation.
- Execution Time Table (`executionTimes`): holds the amount of time
taken for each instruction operation to execute.
and JSON arrays like:-
- Instruction Queue (`InstructionQ`): contains the instructions in their
desired order of issuing, the cycle where they were issued, the start and
end of execution cycles, and the write back cycle.
- Add and Sub Reservation Table (`AddReserv`): contains 3 elements
representing 3 reservation stations present in the simulator. Each
reservation station holds an instruction opcode, a busy bit, vj, vk, qj, qk,
and the reservation station’s tag. The opcode can be “ADD” or “SUB”.
- Mul and Div Reservation Table (`MulReserv`): contains 2 elements
representing 2 reservation stations present in the simulator. Each
reservation station holds an instruction opcode, a busy bit, vj, vk, qj, qk,
and the reservation station’s tag. The opcode can be “MUL” or “DIV”.
- LD Reservation Table (`LDReserv`): contains 3 elements representing 3
reservation stations present in the simulator. Each reservation station
holds an address, a busy bit, and the reservation station’s tag.
- SD Reservation Table (`SDReserv`): contains 3 elements representing 3
reservation stations present in the simulator. Each reservation station
holds an address, a busy bit, v, q, and the reservation station’s tag.
- Register File Table (`Registers`): contains 32 elements representing 32
registers (0-31) present in the simulator. Each register holds q, v, and the
register name.


We then added input fields in the Execution Time HTML table (id=’ETs’) and the
Instruction Queue HTML table (id=’IQ’) in order to allow users to enter each
operator’s execution time, as well as entering the instructions they would like to run.
Moreover, we added 2 buttons, “start” and “next” to control the clock cycle. Each button’s
functionality is explained later.


## How to run:
Open Tomasulo.html in the browser, enter the instructions and the execution times, then
click “start” to start the simulation.
Click “next” to increment cycles. 

Memory and its content can be viewed in the browser's console.

## Team members:

- Hadeer ElHussen
- Mariam Tamer
- Maryam ElOraby
- Rawan Reda 
- Rowan Amgad 
