import {exampleData, starData} from "./02-data";

const parse = (data: string) => {
    return data.split("\n").map(line => {
        const [l, w, h] = line.split("x").map(Number);
        return {l, w, h};
    });
}
const solve = (data: string) => {
    const presents = parse(data);
    let wrappingPaperTotal=0;
    let ribbonTotal=0;
    for (const {l,w,h} of presents) {
        const sides = [l*w, w*h, h*l];
        const minSide = Math.min(...sides);
        const surfaceArea = 2 * sides.reduce((a,b) => a + b, 0);
        const wrappingPaper = surfaceArea + minSide;
        wrappingPaperTotal += wrappingPaper;
        const maxDim = Math.max(l, w, h);
        const ribbon = 2 * (l + w + h - maxDim);
        const bow = l * w * h;
        ribbonTotal += ribbon + bow;
    }
    console.log(`Total wrapping paper needed: ${wrappingPaperTotal}, Total ribbon needed: ${ribbonTotal}`);
}
console.log("Advent of Code - 2015 - 2")
console.log("https://adventofcode.com/2015/day/2")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
