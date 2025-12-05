import {exampleData, starData} from "./10-data";


const parseInput = (data: string) => {
    const parts = [];
    let current = data[0];
    let count = 1;
    for (let i=1; i<data.length; i++){
        if (data[i]!=current){
            parts.push({symbol:current,count:count});
            current = data[i];
            count=1;
        }
        else{
            count++;
        }
    }
    parts.push({symbol:current,count:count});
    return parts;
}
type TPart = ReturnType<typeof parseInput>[0];

const mergeParts = (parts: TPart[]) : TPart[] => {
    const merged: TPart[] = [];
    for (const part of parts){
        if (merged.length>0 && merged[merged.length-1].symbol===part.symbol){
            merged[merged.length-1].count += part.count;
        }
        else{
            merged.push({...part});
        }
    }
    return merged;
}

const speakPart = (part: TPart) : TPart[] => {
    const countStr = part.count.toString();
    const result: TPart[] = [];
    for (const ch of countStr){
        result.push({symbol:ch,count:1});
    }
    result.push({symbol:part.symbol,count:1});
    return result;
}

const speakParts = (parts: TPart[],times :number) : TPart[] => {
    let newParts:TPart[] = null ;
    for (let i=0; i<times; i++){
        newParts = mergeParts((newParts??parts).map(part => speakPart(part)).flat());
    }
    return newParts;
}


const solve = (data: string, times:number) => {
    const parts = parseInput(data);
    const resultParts = speakParts(parts,times);
    const length = resultParts.reduce((sum,part) => sum + part.count,0);
    console.log(`${data} after ${times} times, length is ${length}`);

}
console.log("Advent of Code - 2015 - 10")
console.log("https://adventofcode.com/2015/day/10")
console.time("Example");
console.log("Example")
solve(exampleData,5);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData,40);
solve(starData,50);
console.timeEnd("Stardata");
