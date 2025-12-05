import {exampleData, starData} from "./13-data";


const getRoundTablePermutations = <T>(members:T[])=>{
    if (members.length === 0) return [[]];
    if (members.length === 1) return [[members[0]]];
    if (members.length === 2) return [[members[0], members[1]]];
    const permutations: T[][] = [];
    const firstMember = members[0];
    const restMembers = members.slice(1);
    for (let i = 0; i < restMembers.length; i++) {
        const secondMember = restMembers[i];
        const remainingMembers = restMembers.filter((_, idx) => idx !== i);
        const lastCandidates = remainingMembers.filter(m =>
            members.indexOf(m) > members.indexOf(secondMember)
        ).reverse(); //just to get some lexigraphical order
        for (const lastMember of lastCandidates) {
            const middleMembers = remainingMembers.filter(m => m !== lastMember);
            const middlePerms = getAllPermutations(middleMembers);

            for (const perm of middlePerms) {
                permutations.push([firstMember, secondMember, ...perm, lastMember]);
            }
        }
    }
    return permutations;
}
const getAllPermutations = <T>(members:T[])=>{
    if (members.length === 0) return [[]];
    if (members.length === 1) return [[members[0]]];
    const permutations: T[][] = [];
    for (let i = 0; i < members.length; i++) {
        const member = members[i];
        const remainingMembers = members.slice(0, i).concat(members.slice(i + 1));
        const remainingPermutations = getAllPermutations(remainingMembers);
        for (const perm of remainingPermutations) {
            permutations.push([member, ...perm]);
        }

    }
    return permutations;
}

const pattern = /^(\w+) would (gain|lose) (\d+) happiness units by sitting next to (\w+).$/;

const parse = (data:string) => {
    const happiness = new Map<string,Map<string,number>>();
    const lines = data.split('\n');
    for (const line of lines) {
        const parts = pattern.exec(line);
        if (!parts){
            throw new Error(`Invalid line: ${line}`);
        }
        const personA = parts[1];
        const gainOrLose = parts[2];
        const units = parseInt(parts[3]);
        const personB = parts[4];
        const value = gainOrLose === 'gain' ? units : -units;
        if (!happiness.has(personA)){
            happiness.set(personA, new Map<string,number>());
        }
        happiness.get(personA)!.set(personB, value);
    }
    return happiness;
}

const getHappiness = (permutation:string[], happinessMap:Map<string,Map<string,number>>):number=>{
    let totalHappiness = 0;
    const n = permutation.length;
    for (let i = 0; i < n; i++) {
        const person = permutation[i];
        const personRight = permutation[(i + 1) % n];
        const personLeft = permutation[(i - 1 + n) % n];
        const map = happinessMap.get(person)!;
        totalHappiness += map.get(personRight)!;
        totalHappiness += map.get(personLeft)!;
    }
    return totalHappiness;
}

const solve = (data: string) => {
    const happinessMap = parse(data);
    const members = [...happinessMap.keys()];
    const permutations = getRoundTablePermutations(members);
    const maxHappiness = permutations.reduce((max,permutation)=> Math.max(max,getHappiness(permutation,happinessMap)), Number.NEGATIVE_INFINITY);
    console.log("Max Happiness:", maxHappiness);
    const me = "Me";
    const myHappinessMap = new Map(members.map(m=>[m,0]));
    happinessMap.set(me, myHappinessMap);
    members.forEach((m)=>{
        happinessMap.get(m).set(me,0);
    })
    const permutationsWithMe = getRoundTablePermutations([...members, me]);
    const maxHappinessWithMe = permutationsWithMe.reduce((max,permutation)=> Math.max(max,getHappiness(permutation,happinessMap)), Number.NEGATIVE_INFINITY);
    console.log("Max Happiness:", maxHappinessWithMe);
}
console.log("Advent of Code - 2015 - 13")
console.log("https://adventofcode.com/2015/day/13")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");

