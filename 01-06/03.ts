import {exampleData, exampleData2, starData} from "./03-data";

const solve = (data: string) => {
    let x=0;
    let y=0;
    const houses = new Set<string>();
    const santas =[{x:0, y:0}, {x:0, y:0}];
    const star2Houses = new Set<string>(["0_0"]);
    for (let i = 0; i < data.length; i++) {
        const char = data[i];
        const currentSanta = santas[i % 2];
        switch(char) {
            case '^':
                y++;
                currentSanta.y++;
                break;
            case 'v':
                y--;
                currentSanta.y--;
                break;
            case '<':
                x--;
                currentSanta.x--;
                break;
            case '>':
                x++;
                currentSanta.x++;
                break;
        }
        houses.add(`${x}_${y}`);
        star2Houses.add(`${currentSanta.x}_${currentSanta.y}`);
    }
    console.log(`Elf visits ${houses.size} houses, the two santas are visiting ${star2Houses.size} houses`);
}
console.log("Advent of Code - 2015 - 3")
console.log("https://adventofcode.com/2015/day/3")
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
