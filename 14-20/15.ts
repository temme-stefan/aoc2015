import {exampleData, starData} from "./15-data";

const pattern = /(.+): capacity ([-\d]+), durability ([-\d]+), flavor ([-\d]+), texture ([-\d]+), calories ([-\d]+)/

type TIngredient = {
    capacity: number
    durability: number
    flavor: number
    texture: number
    calories: number
    name: string
}
const parseInput = (data: string): TIngredient[] => {
    return data.split("\n").map(line => {
        const [, name, capacity, durability, flavor, texture, calories] = line.match(pattern)!
        return {
            capacity: parseInt(capacity),
            durability: parseInt(durability),
            flavor: parseInt(flavor),
            texture: parseInt(texture),
            calories: parseInt(calories),
            name
        };
    });

}

type TReceipt = [TIngredient, number][];

const receiptScore = (receipt: TReceipt) => {
    if (receipt == null){
        debugger
    }
    const scores = ["capacity", "durability", "flavor", "texture"].map(key => receipt.reduce((a, b) => a + b[0][key]! * b[1], 0));
    return scores.reduce((a, b) => a * (b < 0 ? 0 : b), 1);
}

const getCalories = (receipt: TReceipt) => {
    return receipt.reduce((a, b) => a + b[0].calories * b[1], 0)
}

const findBestRecipe = (ingredients: TIngredient[], current: number, availableSpoons, currentReceipt: TReceipt, useCalories=false): TReceipt => {
    const ingredient = ingredients[current];
    if (current == ingredients.length - 1) {
        //last ingredient
        currentReceipt.push([ingredient, availableSpoons]);
        return currentReceipt;
    }

    let max = -1;
    let maxReceipt = null;
    for (let i = 0; i <= availableSpoons; i++) {
        const receipe = findBestRecipe(ingredients, current + 1, availableSpoons - i, [...currentReceipt,[ingredient,i]],useCalories);
        if (!receipe) {
            continue;
        }
        const score = receiptScore(receipe);
        const calories = getCalories(receipe);
        if (score>max && (!useCalories || calories==500)) {
            max=score;
            maxReceipt = receipe;
        }
    }
    return maxReceipt;
}

const solve = (data: string) => {
    const ingredients = parseInput(data);
    const best = findBestRecipe(ingredients, 0, 100, []);
    const bestReducedCalories = findBestRecipe(ingredients,0,100,[],true);
    console.log(`\nBest recipe (score ${receiptScore(best)})\n${best.map(i=>`${i[0].name}: ${i[1]} spoons`).join("\n")}`);
    console.log(`\nBest recipe reduced Calories(score ${receiptScore(bestReducedCalories)})\n${bestReducedCalories.map(i=>`${i[0].name}: ${i[1]} spoons`).join("\n")}`);
}
console.log("Advent of Code - 2015 - 15")
console.log("https://adventofcode.com/2015/day/15")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
