import {exampleData, starData} from "./25-data";

const start = 20151125;
const factor = 252533;
const mod = 33554393;

const next = (n:number) => (n * factor) % mod;

const parse = (data: string): [number, number] => {
    const match = data.match(/row (\d+), column (\d+)/);
    if (!match) throw new Error("Invalid input");
    return [Number(match[1]), Number(match[2])];
}
const solve = (data: string) => {
    const [row, col] = parse(data);
    const firstofColumn = (col * (col + 1)) / 2 ;
    let index = firstofColumn;
    for (let i = 1; i < row; i++) {
        index += col + i - 1;
    }
    let code = start;
    for (let i = 1; i < index; i++) {
        code = next(code);
    }


    console.log(data, "is " + code);
}
console.log("Advent of Code - 2015 - 25")
console.log("https://adventofcode.com/2015/day/25")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
