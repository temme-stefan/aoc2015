import {exampleData, starData} from "./06-data";

const parser = /^(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)$/
const parse = (data: string) => {
    return data.split("\n").map(line => {
        if (parser.test(line)) {
            const [, action, x1, y1, x2, y2] = parser.exec(line)!;
            return {
                action,
                x1: parseInt(x1),
                y1: parseInt(y1),
                x2: parseInt(x2),
                y2: parseInt(y2),
            }
        }
    });
}
type TCommand = ReturnType<typeof parse>[0];
const solve = (data: string) => {
    const commands: TCommand[] = parse(data);
    const grid = Array.from({length: 1000}, () => Array.from({length: 1000}, () => 0));
    for (const command of commands) {
        for (let x = command!.x1; x <= command!.x2; x++) {
            for (let y = command!.y1; y <= command!.y2; y++) {
                switch (command!.action) {
                    case "turn on":
                        grid[x][y]++;
                        break;
                    case "turn off":
                        grid[x][y] = Math.max(0, grid[x][y] - 1);
                        break;
                    case "toggle":
                        grid[x][y]+=2
                        break;
                }

            }
        }
    }
    const lit = grid.flat().filter(l=>l>0).length;
    const totalBrightness = grid.flat().reduce((a,b)=>a+b,0);

    console.log(`Lit lights: ${lit}, total brightness: ${totalBrightness}`);
}
console.log("Advent of Code - 2015 - 6")
console.log("https://adventofcode.com/2015/day/6")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
