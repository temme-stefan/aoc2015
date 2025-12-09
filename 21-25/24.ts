import {exampleData, starData} from "./24-data";

const parse = (data: string) => {
    return data.split("\n").map(line => Number(line)).sort((a, b) => b - a);
}
const getEntanglement = (box: Set<number>): number => {
    return [...box].reduce((a, b) => a * b, 1);
}

const getBoxesWithSize = (packages: number[], size: number): Set<number>[] => {
    const results = new Set<Set<number>>();
    const helper = (startIndex: number, currentSet: Set<number>, currentSum: number) => {
        if (currentSum === size) {
            results.add(new Set(currentSet));
            return;
        }
        if (currentSum > size) {
            return;
        }
        for (let i = startIndex; i < packages.length; i++) {
            currentSet.add(packages[i]);
            helper(i + 1, currentSet, currentSum + packages[i]);
            currentSet.delete(packages[i]);
        }
    }
    helper(0, new Set<number>(), 0);
    return [...results];
}

const equals = (setA: Set<number>, setB: Set<number>): boolean => {
    if (setA.size !== setB.size) return false;
    return setA.isSubsetOf(setB);
}
const getMinimumEntanglement = (validGroupings: [Set<number>, Set<number>, Set<number>][]) => {
    const {groups} = validGroupings.reduce(({size, groups}, group) => {
        if (group[0].size < size) {
            size = group[0].size;
            groups = [group];
        } else if (group[0].size == size) {
            groups.push(group);
        }
        return {size, groups};
    }, {size: Number.MAX_SAFE_INTEGER, groups: [] as [Set<number>, Set<number>, Set<number>][]});
    return = groups.reduce((min, group) => Math.min(min, getEntanglement(group[0])), Number.MAX_SAFE_INTEGER);
}
const validGroupingsSize3 = (boxes: Set<number>[], packages: number[]) => {
    const validGroupings: [Set<number>, Set<number>, Set<number>][] = [];
    outer: {
        for (let i = 0; i < boxes.length; i++) {
            const box1 = boxes[i];
            if (box1.size > (validGroupings[0]?.[0]?.size ?? Number.MAX_SAFE_INTEGER)) {
                break outer; // No need to continue, we already have smaller groups
            }
            inner: {
                for (let j = i + 1; j < boxes.length; j++) {
                    const box2 = boxes[j];
                    if (box1.intersection(box2).size == 0) {
                        const box3Cand = new Set(packages).difference(box1).difference(box2);
                        if (boxes.some(b => equals(b, box3Cand))) {
                            const group = [box1, box2, box3Cand].sort((a, b) => a.size - b.size == 0 ? getEntanglement(a) - getEntanglement(b) : (a.size - b.size));
                            validGroupings.push(group as [Set<number>, Set<number>, Set<number>]);
                            break inner;
                        }
                    }
                }
            }
        }
    }
    return validGroupings;
}

const validGroupingsSize4 = (boxes: Set<number>[], packages: number[]) => {
    const validGroupings: [Set<number>, Set<number>, Set<number>, Set<number>][] = [];
    outer: {
        for (let i = 0; i < boxes.length; i++) {
            const box1 = boxes[i];
            if (box1.size > (validGroupings[0]?.[0]?.size ?? Number.MAX_SAFE_INTEGER)) {
                break outer; // No need to continue, we already have smaller groups
            }
            inner: {
                for (let j = i + 1; j < boxes.length; j++) {
                    const box2 = boxes[j];
                    if (box1.intersection(box2).size != 0) {
                        continue;
                    }
                    for (let k = j + 1; k < boxes.length; k++) {
                        const box3 = boxes[k];
                        if (box1.intersection(box3).size != 0 || box2.intersection(box3).size != 0) {
                            continue;
                        }
                        const box4Cand = new Set(packages).difference(box1).difference(box2).difference(box3);
                        if (boxes.some(b => equals(b, box4Cand))) {
                            const group = [box1, box2, box3, box4Cand].sort((a, b) => a.size - b.size == 0 ? getEntanglement(a) - getEntanglement(b) : (a.size - b.size));
                            validGroupings.push(group as [Set<number>, Set<number>, Set<number>, Set<number>]);
                            break inner;
                        }
                    }
                }
            }
        }
    }
    return validGroupings;
}

const solve = (data: string, label: string) => {
    const packages = parse(data);
    const totalWeight = packages.reduce((a, b) => a + b, 0);

    const groupWeight = totalWeight / 3;
    const boxes = getBoxesWithSize(packages, groupWeight);
    console.timeLog(label, "Boxes found:", boxes.length);
    boxes.sort((a, b) => a.size - b.size);
    const validGroupings = validGroupingsSize3(boxes, packages);
    const minEntanglement = getMinimumEntanglement(validGroupings);
    console.log("Minimum Entanglement:", minEntanglement);

    const groupWeight2 = totalWeight / 4;
    const boxes2 = getBoxesWithSize(packages, groupWeight2);
    console.timeLog(label, "Boxes for 4 groups found:", boxes2.length);
    boxes2.sort((a, b) => a.size - b.size);
    const validGroupings2 = validGroupingsSize4(boxes2, packages);
    const minEntanglement2 = getMinimumEntanglement(validGroupings2);
    console.log("Minimum Entanglement (4 groups):", minEntanglement2);

}
console.log("Advent of Code - 2015 - 24")
console.log("https://adventofcode.com/2015/day/24")
console.time("Example");
console.log("Example")
solve(exampleData, "Example");
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData, "Stardata");
console.timeEnd("Stardata");
