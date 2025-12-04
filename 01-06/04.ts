import crypto from 'crypto';
import {exampleData, exampleData2, starData} from "./04-data";

const checkNumberOfLeadingZeros = (secret: string, n: number,validHashPrefix): boolean => {
    const hash = crypto.createHash('md5').update(secret+n).digest('hex');
    return hash.startsWith(validHashPrefix);
}

const solve = (data: string) => {
    let number = 0;
    let validHashPrefix = '00000';
    while (!checkNumberOfLeadingZeros(data,number,validHashPrefix)) {
        number++;
    }
    const star1 = number;
    validHashPrefix = validHashPrefix + '0';
    while (!checkNumberOfLeadingZeros(data,number,validHashPrefix)) {
        number++;
    }
    console.log(`The lowest number to produce Santa-hash is: ${star1}, harder version: ${number}`);
}
console.log("Advent of Code - 2015 - 4")
console.log("https://adventofcode.com/2015/day/4")
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
