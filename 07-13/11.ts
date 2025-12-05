import {exampleData, starData} from "./11-data";

type TPassword = number[]

const letterToDigit = (char: string): number => {
    return char.charCodeAt(0) - 'a'.charCodeAt(0);
}

const digitToLetter = (digit: number): string => {
    return String.fromCharCode(digit + 'a'.charCodeAt(0));
}

const parsePassword = (password: string): TPassword => {
    return password.split('').map(letterToDigit).map(digit => {
        if (illegalLetters.has(digit)) {
            return digit+1;
        }
        return digit;
    });
}

const formatPassword = (password: TPassword): string => {
    return password.map(digitToLetter).join('');
}

const checkStraight = (password: TPassword) => {
    for (let i = 0; i < password.length - 2; i++) {
        if (password[i] + 1 === password[i + 1] && password[i] + 2 === password[i + 2]) {
            return true;
        }
    }
    return false;
}

const illegalLetters = new Set<number>([letterToDigit('i'), letterToDigit('o'), letterToDigit('l')]);

const checkConfusing = (password: TPassword) => {
    return !password.some(digit => illegalLetters.has(digit));
}

const checkPairs = (password: TPassword) => {
    let pairCount = 0;
    let i = 0;
    while (i < password.length - 1 && pairCount < 2) {
        if (password[i] === password[i + 1]) {
            pairCount++;
            i += 2; // Skip the next character to avoid overlapping pairs
        } else {
            i++;
        }
    }
    return pairCount >= 2;
}

const isValid = (password: TPassword): boolean => {
    return checkStraight(password) && checkConfusing(password) && checkPairs(password);
}

const smartIncrement = (password: TPassword): TPassword => {
    const nextPassword = [...password];
    for (let i = nextPassword.length - 1; i >= 0; i--) {
        nextPassword[i] = (nextPassword[i] + 1) % 26;
        if (illegalLetters.has(nextPassword[i])) {
            nextPassword[i]++;
        }
        if (nextPassword[i] !== 0) {
            break;
        }
    }
    return nextPassword;
}

const solve = (data: string) => {
    const pw = parsePassword(data.trim());
    let nextPassword: TPassword = pw;
    do {
        nextPassword = smartIncrement(nextPassword);
    } while (!isValid(nextPassword));
    console.log(`Next Password from "${data.trim()}" is "${formatPassword(nextPassword)}"`);
    do {
        nextPassword = smartIncrement(nextPassword);
    } while (!isValid(nextPassword));
    console.log(`Second next Password from "${data.trim()}" is "${formatPassword(nextPassword)}"`);
}
console.log("Advent of Code - 2015 - 11")
console.log("https://adventofcode.com/2015/day/11")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata");
solve(starData);
console.timeEnd("Stardata");
