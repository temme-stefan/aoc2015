import {exampleData, starData} from "./12-data";


const getSum = (obj: any, redFilter=false): number => {
    if (typeof obj === 'number') {
        return obj;
    }
    if (typeof obj === 'string') {
        return 0;
    }
    if (Array.isArray(obj)) {
        return obj.reduce((acc, item) => acc + getSum(item, redFilter), 0);
    }
    if (typeof obj === 'object' && obj !== null) {
        if (redFilter && Object.values(obj).includes("red")) {
            return 0;
        }
        return (Object.values(obj) as any[]).reduce((acc, item) => (acc + getSum(item, redFilter)),0    );
    }
    return 0;
}

const solve = (data: string) => {
    const parsed = JSON.parse(data);
    // console.log(parsed);
    const getSumResult = getSum(parsed);
    console.log("Part 1:", getSumResult);
    const getSumRedFilteredResult = getSum(parsed, true);
    console.log("Part 2:", getSumRedFilteredResult);


}
console.log("Advent of Code - 2015 - 12")
console.log("https://adventofcode.com/2015/day/12")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
