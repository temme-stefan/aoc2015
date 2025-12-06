import {exampleData, starData} from "./18-data";

const parse = (data: string) => {
    const lines = data.split("\n").map(line => line.trim().split(""));
    return lines.map(line => line.map(c => c === "#"));
}
type TLightMap = ReturnType<typeof parse>;

const countAdjacentOn = (map: TLightMap, x: number, y: number): number => {
    return [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
        .map(([dx, dy]) => [x + dx, y + dy])
        .filter(([nx, ny]) => nx >= 0 && ny >= 0 && ny < map.length && nx < map[0].length)
        .reduce((acc, [nx, ny]) => acc + (map[ny][nx] ? 1 : 0), 0);
}
const stepLightMap = (lightMap: boolean[][], cornerAlwaysOn = false) => {
    const newMap: TLightMap = [];
    for (let y = 0; y < lightMap.length; y++) {
        newMap[y] = [];
        for (let x = 0; x < lightMap[0].length; x++) {
            const adjacentOn = countAdjacentOn(lightMap, x, y);
            if (lightMap[y][x]) {
                newMap[y][x] = (adjacentOn === 2 || adjacentOn === 3);
            } else {
                newMap[y][x] = (adjacentOn === 3);
            }
        }
    }
    if (cornerAlwaysOn) {
        cornerOn(newMap);
    }
    return newMap;
}
const cornerOn = (map: TLightMap) => {
    map[0][0] = true;
    map[0][map[0].length - 1] = true;
    map[map.length - 1][0] = true;
    map[map.length - 1][map[0].length - 1] = true;
}
const solve = (data: string, steps: number) => {
    let lightMap = parse(data);
    let lightMap2 = lightMap.map(r=>[...r]);
    // Set corners always on for lightMap2
    cornerOn(lightMap2);

    for (let step = 0; step < steps; step++) {
        lightMap = stepLightMap(lightMap);
        lightMap2 = stepLightMap(lightMap2, true);
    }
    console.log(`Lights on after ${steps}: ${lightMap.flat().filter(Boolean).length}\nLights on after ${steps} with corners always on: ${lightMap2.flat().filter(Boolean).length}`);
}
console.log("Advent of Code - 2015 - 18")
console.log("https://adventofcode.com/2015/day/18")
console.time("Example");
console.log("Example")
solve(exampleData, 5);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData, 100);
console.timeEnd("Stardata");
