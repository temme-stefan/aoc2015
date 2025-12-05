import {exampleData, starData} from "./08-data";

const pattern = /^"(([a-z]|\\\\|\\"|\\x[0-9a-f]{2})*)"$/
const innerPattern = /([a-z]|\\\\|\\"|\\x[0-9a-f]{2})/g

const decode = (line: string): string => {
    if (!pattern.test(line)) {
        console.error("Pattern not matched:", line);
        return;
    }

    const match = pattern.exec(line);
    const inner = match![1];
    const parsed = inner.replace(innerPattern, (m1) => {
        let result = m1;
        switch (true) {
            case /\\\\/.test(m1):
                result = "\\";
                break;
            case /\\"/.test(m1):
                result = "\"";
                break;
            case /\\x[0-9a-f]{2}/.test(m1):
                const hex = m1.slice(2);
                const charCode = parseInt(hex, 16);
                result = String.fromCharCode(charCode);
                break;
        }
        return result;
    });
    return parsed;
}

const encode = (line: string): string => {
    let encoded = '"';
    for (const char of line) {
        switch (char) {
            case '\\':
                encoded += '\\\\';
                break;
            case '"':
                encoded += '\\"';
                break;
            default:
                encoded += char;
                break;
        }
    }
    encoded += '"';
    return encoded;
}
const solve = (data: string) => {
    let delta = 0;
    let delta2 = 0;
    data.split('\n').forEach(line => {
        const decoded = decode(line)
        delta += (line.length - decoded.length);
        const encoded = encode(line);
        delta2 += (encoded.length - line.length);
    });
    console.log(`Delta:\ndecoded: ${delta}\nencoded: ${delta2}`);
}
console.log("Advent of Code - 2015 - 8")
console.log("https://adventofcode.com/2015/day/8")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
