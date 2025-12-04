import {exampleData, exampleData2, exampleData3, exampleData4, starData} from "./01-data";

const solve = (data: string) => {
    let level = 0;
    let basementPosition = -1;
    for (let i = 0; i < data.length; i++) {
        const char = data[i];
        if (char === '(') {
            level++;

        } else if (char === ')') {
            level--;
        }
        if(level === -1 && basementPosition === -1) {
            basementPosition = i + 1;
        }

    }
    console.log(`Level: ${level}, First to basement position: ${basementPosition}`);
}

console.log("Advent of Code - 2015 - 1")
console.log("https://adventofcode.com/2015/day/1")
const run = (label: string, data: string) => {
    console.time(label);
    console.log(label);
    solve(data);
    console.timeEnd(label);
}

run("Example 1", exampleData);
run("Example 2", exampleData2);
run("Example 3", exampleData3);
run("Example 4", exampleData4);
run("Stardata", starData);
