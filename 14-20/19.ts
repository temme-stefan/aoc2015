import {exampleData, starData} from "./19-data";

const parse = (data: string) => {
    const [reps, molecule] = data.split('\n\n');
    const replacements = new Map<string, string[]>();
    const reverseReplacemnts = new Map<string, string[]>();
    reps.split('\n').forEach((line) => {
        const [from, to] = line.split(' => ');
        if (!replacements.has(from)) {
            replacements.set(from, []);
        }
        replacements.get(from)!.push(to);
        if (!reverseReplacemnts.has(to)) {
            reverseReplacemnts.set(to, []);
        }
        reverseReplacemnts.get(to)!.push(from);
    })
    return {replacements, reverseReplacements: reverseReplacemnts, molecule};
}

const getReplacements = (molecule: string, replacements: Map<string, string[]>): Set<string> => {
    const results: Set<string> = new Set();
    for (const [from, tos] of replacements.entries()) {
        let startIndex = 0;
        while (true) {
            const index = molecule.indexOf(from, startIndex);
            if (index === -1) break;
            for (const to of tos) {
                const newMolecule = molecule.slice(0, index) + to + molecule.slice(index + from.length);
                results.add(newMolecule);
            }
            startIndex = index + 1;
        }
    }
    return results;
}
const solve = (data: string) => {
    const {replacements, molecule, reverseReplacements} = parse(data);
    const newMolecules = getReplacements(molecule, replacements);
    console.log(`There are ${newMolecules.size} distinct molecules after one replacement.`);

// Teil 2: Random Restart Greedy
    let minSteps = Infinity;

    for (let attempt = 0; attempt < 10000 && !Number.isFinite(minSteps); attempt++) {
        let current = molecule;
        let steps = 0;

        while (current !== 'e' && steps < 1000) {
            const sortedReplacements = Array.from(reverseReplacements.entries())
                .sort(() => Math.random() - 0.5); // Zufällige Reihenfolge

            let replaced = false;
            for (const [from, tos] of sortedReplacements) {
                const index = current.indexOf(from);
                if (index !== -1) {
                    const to = tos[Math.floor(Math.random() * tos.length)]; // Zufällige Alternative
                    current = current.slice(0, index) + to + current.slice(index + from.length);
                    steps++;
                    replaced = true;
                    break;
                }
            }

            if (!replaced) break;
        }

        if (current === 'e') {
            minSteps = Math.min(minSteps, steps);
        }
    }

    console.log(`Minimum number of steps: ${minSteps}`);
}

console.log("Advent of Code - 2015 - 19")
console.log("https://adventofcode.com/2015/day/19")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
