import {exampleData, exampleData2, starData} from "./05-data";

const parse = (data: string) => {
    return data.split("\n");
}

const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
const repeating = /([a-z])\1/;
const forbidden = ['ab', 'cd', 'pq', 'xy'];
const isNice = (s: string): boolean => {
    const vowelCount = Array.from(s).filter(c => vowels.has(c)).length;
    if (vowelCount >= 3) {
        if (repeating.test(s)) {
            return !forbidden.some(pattern => s.includes(pattern));
        }
    }
    return false;
}

const nonOverlappingPair = /([a-z]{2}).*?\1/;
const repeatingWithOneBetween = /([a-z]).\1/;
const isNice2 = (s: string): boolean => {
    return nonOverlappingPair.test(s) && repeatingWithOneBetween.test(s);
}
const solve = (data: string) => {
    const strings = parse(data);
    const niceStrings = strings.filter(isNice);
    const nice2Strings = strings.filter(isNice2);
    console.log(`Number of nice strings (star 1): ${niceStrings.length}`);
    console.log(`Number of nice strings (star 2): ${nice2Strings.length}`);
}
console.log("Advent of Code - 2015 - 5")
console.log("https://adventofcode.com/2015/day/5")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Example2");
console.log("Example2")
solve(exampleData2);
console.timeEnd("Example2")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
