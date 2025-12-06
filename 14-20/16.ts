import {exampleData, starData} from "./16-data";

const parse = (data: string) => {
    return data.split('\n').map(line => {
        const [, sue, props] = line.match(/^Sue (\d+): (.*)$/);
        const attributes = Object.fromEntries(props.split(", ").map(p => {
            const [, key, value] = p.match(/(\w+): (\d)/);
            return [key, parseInt(value)];
        }));
        return {sue: parseInt(sue), attributes};
    })
}
type TSue = ReturnType<typeof parse>[0];

const ticker = {
    children: 3,
    cats: 7,
    samoyeds: 2,
    pomeranians: 3,
    akitas: 0,
    vizslas: 0,
    goldfish: 5,
    trees: 3,
    cars: 2,
    perfumes: 1
}

const settings = {
    children: "equal",
    cats: "greater",
    samoyeds: "equal",
    pomeranians: "less",
    akitas: "equal",
    vizslas: "equal",
    goldfish: "less",
    trees: "greater",
    cars: "equal",
    perfumes: "equal"
}
const match = (sue: TSue, memories: typeof ticker,useSettings =false): boolean => {
    let matches = true;

    for (const [key, value] of Object.entries(memories)) {
        if (Object.hasOwn(sue.attributes, key)) {
            if (useSettings) {
                switch (settings[key as keyof typeof settings]) {
                    case "equal":
                        matches = matches && sue.attributes[key] === value;
                        break;
                    case "greater":
                        matches = matches && sue.attributes[key] > value;
                        break;
                    case "less":
                        matches = matches && sue.attributes[key] < value;
                        break;
                }
            }
            else {
                matches = matches && sue.attributes[key] === value;
            }
        }
    }
    return matches;
}
const solve = (data: string) => {
    const sues = parse(data);
    const matchingSue1 = sues.find(sue => match(sue, ticker));
    const matchingSue2 = sues.find(sue => match(sue, ticker,true));
    console.log(`Matching Sues: ${matchingSue1?.sue ??"None"}` );
    console.log(`Matching Sues with settings: ${matchingSue2?.sue ??"None"}` );
}
console.log("Advent of Code - 2015 - 16")
console.log("https://adventofcode.com/2015/day/16")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
