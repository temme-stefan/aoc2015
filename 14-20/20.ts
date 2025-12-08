import {starData, exampleData} from "./20-data";

const divisorsCache = new Map<number, Set<number>>([[1, new Set([1])]]);

const divisors = (n: number): Set<number> => {
    if (divisorsCache.has(n)) {
        return divisorsCache.get(n)!;
    }

    // Finde kleinsten Primfaktor
    let smallestFactor = n;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            smallestFactor = i;
            break;
        }
    }

    if (smallestFactor === n) {
        // n ist Primzahl
        const result = new Set([1, n]);
        divisorsCache.set(n, result);
        return result;
    }

    // Rekursiv: divisors(n) = union von divisors(smallestFactor) * divisors(n/smallestFactor)
    const largeFactor = n / smallestFactor;
    const divsSmall = divisors(smallestFactor);
    const divsLarge = divisors(largeFactor);

    const result = new Set<number>();

    // Kartesisches Produkt: alle Kombinationen von Teilern
    for (const d1 of divsSmall) {
        for (const d2 of divsLarge) {
            result.add(d1 * d2);
        }
    }

    divisorsCache.set(n, result);
    return result;
}

const div2 = (n: number): Set<number> => {
    return new Set([...divisors(n)].filter(d => n / d <= 50));
};

const solve = (data: string) => {
    const target = parseInt(data) / 10;
    let house = 1;
    while (true) {
        const divs = divisors(house);
        const presents = [...divs].reduce((sum, d) => sum + d, 0);
        if (presents >= target) {
            console.log(`House ${house} receives at least ${target * 10} presents (${presents * 10}).`);
            break;
        }
        house++;
    }
    let target2 = parseInt(data) / 11;
    while (true) {
        const divs = div2(house);
        const presents = [...divs].reduce((sum, d) => sum + d, 0);
        if (presents >= target2) {
            console.log(`(Part 2) House ${house} receives at least ${target2 * 11} presents (${presents * 11}).`);
            break;
        }
        house++;
    }
}
console.log("Advent of Code - 2015 - 20")
console.log("https://adventofcode.com/2015/day/20")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
