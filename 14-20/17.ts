import {exampleData, starData} from "./17-data";


const parse = (data: string) => {
    return data.split("\n").map(line => Number(line.trim()));
}
const solve = (data: string, target: number) => {
    const containers = parse(data);
    let combinations = 0;
    const totalContainers = containers.length;
    const maxCombination = 1 << totalContainers;
    let minCounterValue = Number.MAX_SAFE_INTEGER;
    let minCounter = 0;
    for (let i = 0; i < maxCombination; i++) {
        let sum = 0;
        let count =0;
        for (let j = 0; j < totalContainers; j++) {
            if ((i & (1 << j)) !== 0) {
                sum += containers[j];
                count++;
            }
        }
        if (sum === target) {
            combinations++;
            if (count<minCounterValue) {
                minCounterValue = count;
                minCounter = 1;
            }
            else if (count===minCounterValue) {
                minCounter++;
            }
        }
    }
    console.log(`Total combinations to fill ${target} liters: ${combinations}\nMinimum containers to fill ${target} liters: ${minCounterValue} (ways: ${minCounter})`);
}
console.log("Advent of Code - 2015 - 17")
console.log("https://adventofcode.com/2015/day/17")
console.time("Example");
console.log("Example")
solve(exampleData, 25);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData, 150);
console.timeEnd("Stardata");
