import {exampleData, starData} from "./23-data";

type TCommand =
    {
        type: "hlf" | "tpl" | "inc" | "jmp" | "jie" | "jio";
        register?: "a" | "b";
        offset?: number;
    }

const parse = (data: string) => {
    const commandLines = data.split("\n").map(line => line.trim());
    return commandLines.map(line => {
        const matches = /^((hlf|tpl|inc) ([ab])|(jmp) ([+-]\d+)|(jie|jio) ([ab]), ([+-]\d+))$/.exec(line)
        if (!matches) {
            throw new Error(`Cannot parse line: ${line}`);
        }
        return {
            type: (matches[2] || matches[4] || matches[6]) as TCommand["type"],
            register: (matches[3] || matches[7]) as TCommand["register"] | undefined,
            offset: matches[8] ? parseInt(matches[8]) : matches[5] ? parseInt(matches[5]) : undefined,
        } as TCommand;
    });
}

const runCommands = (registers: Map<string, number>, commands: TCommand[]) => {
    let current = 0;
    let circleFinderSet = new Set<string>();
    const tick = () => {
        const key = `${current}|${registers.get("a")}|${registers.get("b")}`;
        if (circleFinderSet.has(key)) {
            throw new Error("Infinite Loop detected: key=" + key + "\n" + JSON.stringify(commands[current]));

        }
        circleFinderSet.add(key);
    }
    while (current < commands.length && current >= 0) {
        tick();
        const command = commands[current];
        switch (command.type) {
            case "hlf":
                registers.set(command.register, Math.floor(registers.get(command.register) / 2));
                current++;
                break;
            case "tpl":
                registers.set(command.register, registers.get(command.register) * 3);
                current++;
                break;
            case "inc":
                registers.set(command.register, registers.get(command.register) + 1);
                current++;
                break;
            case "jmp":
                current += command.offset;
                break;
            case "jie":
                if (registers.get(command.register) % 2 === 0) {
                    current += command.offset;
                } else {
                    current++;
                }
                break;
            case "jio":
                if (registers.get(command.register) === 1) {
                    current += command.offset;
                } else {
                    current++;
                }
                break;
            default:
                throw new Error(`Unknown command: ${JSON.stringify(command)}`);
        }
    }
}
const solve = (data: string) => {
    const commands = parse(data);
    const registers = new Map([["a", 0], ["b", 0]]);
    runCommands(registers, commands);
    console.log("Star 1:", registers);
    const registers2 = new Map([["a", 1], ["b", 0]]);
    runCommands(registers2, commands);
    console.log("Star 2:", registers2);
}

console.log("Advent of Code - 2015 - 23")
console.log("https://adventofcode.com/2015/day/23")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
