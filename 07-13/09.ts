import {exampleData, starData} from "./09-data";

const travelingSalesMan = (distances: Map<string, Map<string, number>>, findLongest: boolean = false): number => {
    const locations = Array.from(distances.keys());
    const permute = (arr: string[]): string[][] => {
        if (arr.length === 0) return [[]];
        const result: string[][] = [];
        for (let i = 0; i < arr.length; i++) {
            const current = arr[i];
            const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
            const remainingPermuted = permute(remaining);
            for (const perm of remainingPermuted) {
                result.push([current, ...perm]);
            }
        }
        return result;
    };

    const allRoutes = permute(locations);
    let bestDistance = findLongest ? 0 : Infinity;

    for (const route of allRoutes) {
        let totalDistance = 0;
        for (let i = 0; i < route.length - 1; i++) {
            const from = route[i];
            const to = route[i + 1];
            totalDistance += distances.get(from)!.get(to)!;
        }
        if (findLongest) {
            if (totalDistance > bestDistance) {
                bestDistance = totalDistance;
            }
        } else {
            if (totalDistance < bestDistance) {
                bestDistance = totalDistance;
            }
        }
    }

    return bestDistance;
}

const parseInput = (data: string): Map<string, Map<string, number>> => {
    const distances: Map<string, Map<string, number>> = new Map();
    const lines = data.split("\n");
    for (const line of lines) {
        const match = line.match(/^(\w+) to (\w+) = (\d+)$/);
        if (match) {
            const from = match[1];
            const to = match[2];
            const distance = parseInt(match[3], 10);

            if (!distances.has(from)) {
                distances.set(from, new Map());
            }
            if (!distances.has(to)) {
                distances.set(to, new Map());
            }
            distances.get(from)!.set(to, distance);
            distances.get(to)!.set(from, distance);
        }
    }
    return distances;
}
const solve = (data: string) => {
    const map = parseInput(data);
    const shortest = travelingSalesMan(map, false);
    console.log(`  Part 1: The shortest distance is ${shortest}`);
    const longest = travelingSalesMan(map, true);
    console.log(`  Part 2: The longest distance is ${longest}`);
}
console.log("Advent of Code - 2015 - 9")
console.log("https://adventofcode.com/2015/day/9")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
