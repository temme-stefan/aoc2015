import {exampleData, starData} from "./07-data";

// Maske für 16-Bit unsigned integer
const MASK_16BIT = 0xFFFF;

// AND Operation
const and = (a: number, b: number) => (a & b) & MASK_16BIT;

// OR Operation
const or = (a: number, b: number) => (a | b) & MASK_16BIT;

// NOT Operation (wichtig: invertiert alle 32 Bits, daher Maske nötig)
const not = (a: number) => (~a) & MASK_16BIT;

// LSHIFT (Left Shift)
const lshift = (a: number, shift: number) => (a << shift) & MASK_16BIT;

// RSHIFT (Right Shift)
const rshift = (a: number, shift: number) => (a >>> shift) & MASK_16BIT;

const commandPattern = /^((\d+|[a-z]+)|(\d+|[a-z]+) (AND|OR) (\d+|[a-z]+)|(\d+|[a-z]+) (LSHIFT|RSHIFT) (\d+)|NOT (\d+|[a-z]+))$/
const runCircuit = (instructions: string[][]) => {
    const registers = new Map<string, number>();
    const getValue = (part: string): number | undefined => {
        const isNumeric = /^\d+$/.test(part);
        return isNumeric ? Number(part) & MASK_16BIT : registers.get(part);
    }

    const resolveWire = (wire: string): number => {
        if (registers.has(wire)) {
            return registers.get(wire)!;
        }

        const instruction = instructions.find(([_, target]) => target === wire);
        if (!instruction) {
            throw new Error(`No instruction for wire ${wire}`);
        }

        const [command] = instruction;
        const parts = commandPattern.exec(command);

        if (!parts) {
            throw new Error(`Invalid command ${command}`);
        }

        let value: number;

        if (command.includes("AND")) {
            const left = getValue(parts[3]) ?? resolveWire(parts[3]);
            const right = getValue(parts[5]) ?? resolveWire(parts[5]);
            value = and(left, right);
        } else if (command.includes("OR")) {
            const left = getValue(parts[3]) ?? resolveWire(parts[3]);
            const right = getValue(parts[5]) ?? resolveWire(parts[5]);
            value = or(left, right);
        } else if (command.includes("LSHIFT")) {
            const left = getValue(parts[6]) ?? resolveWire(parts[6]);
            value = lshift(left, parseInt(parts[8]!));
        } else if (command.includes("RSHIFT")) {
            const left = getValue(parts[6]) ?? resolveWire(parts[6]);
            value = rshift(left, parseInt(parts[8]!));
        } else if (command.includes("NOT")) {
            const operand = getValue(parts[9]) ?? resolveWire(parts[9]);
            value = not(operand);
        } else {
            value = getValue(parts[2]) ?? resolveWire(parts[2]);
        }

        registers.set(wire, value);
        return value;
    }

    // Finde alle Ziel-Wires und löse sie auf
    const wires = instructions.map(([_, target]) => target);
    wires.forEach(wire => resolveWire(wire));
    return registers;
}
const solve = (data: string) => {
    const instructions = data.split("\n").map(line => line.trim().split(" -> "));
    const registers = runCircuit(instructions);

    if (registers.has('a')) {
        console.log("Wire a:", registers.get('a'));
        const bCommand = instructions.find(([_, target]) => target === 'b');
        bCommand[0] = `${registers.get('a')}`;
        const newRegisters = runCircuit(instructions);
        console.log("After overriding b with a, Wire a:", newRegisters.get('a'));

    }
    else{
        console.log(new Map([...registers.entries()].sort((a, b) => a[0].localeCompare(b[0]))));
    }



}
console.log("Advent of Code - 2015 - 7")
console.log("https://adventofcode.com/2015/day/7")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
