import {exampleData, starData} from "./14-data";

const pattern = /(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds./;

const parse = (data: string) => {
    return data.split("\n").map(line => {
        const match = line.match(pattern);
        if (!match) throw new Error("Invalid line: " + line);
        return {
            name: match[1],
            speed: parseInt(match[2]),
            flyTime: parseInt(match[3]),
            restTime: parseInt(match[4]),
        };
    });
}
type TReindeer = ReturnType<typeof parse>[0];

const doRace = (reindeers: TReindeer[], raceTime: number) => {
    const distances = reindeers.map(reindeer => {
        const cycleTime = reindeer.flyTime + reindeer.restTime;
        const fullCycles = Math.floor(raceTime / cycleTime);
        const remainingTime = raceTime % cycleTime;
        const flyingTime = fullCycles * reindeer.flyTime + Math.min(remainingTime, reindeer.flyTime);
        const distance = flyingTime * reindeer.speed;
        return {distance, reindeer};
    });
    return distances;
}
const solve = (data: string, raceTime: number) => {
    const reindeers = parse(data);
    const distances = doRace(reindeers, raceTime);
    const maxDistance = Math.max(...distances.map(d => d.distance));
    console.log("Max distance:", maxDistance);
    const scoreBoard= new Map<string,number>(reindeers.map(reindeer => [reindeer.name,0]));
    for(let t=1;t<=raceTime;t++) {
        const distancesAtT = doRace(reindeers, t);
        const maxDistanceAtT = Math.max(...distancesAtT.map(d => d.distance));
        // Alle Rentiere, die die maximale Distanz haben, bekommen einen Punkt
        const leaders = distancesAtT.filter(d => d.distance === maxDistanceAtT);
        leaders.forEach(leader => {
            scoreBoard.set(leader.reindeer.name, scoreBoard.get(leader.reindeer.name)! + 1);
        });
    }
    console.log(scoreBoard);
    const winner = Array.from(scoreBoard.entries()).reduce((a,b)=>a[1]<b[1]?b:a);
    console.log("Winner:",winner[0],"with",winner[1],"points");
}
console.log("Advent of Code - 2015 - 14")
console.log("https://adventofcode.com/2015/day/14")
console.time("Example");
console.log("Example")
solve(exampleData, 1000);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData, 2503);
console.timeEnd("Stardata");
