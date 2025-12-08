type TOpponent = {
    hitPoints: number,
    damage: number,
    armor: number,
}
type TPlayer = TOpponent & {
    cost: number,
    equipment: TEquipment[]
}
type TEquipment = {
    name: string,
    cost: number,
    damage: number,
    armor: number
}

const weapons: TEquipment[] = [
    {name: "Dagger", cost: 8, damage: 4, armor: 0},
    {name: "Shortsword", cost: 10, damage: 5, armor: 0},
    {name: "Warhammer", cost: 25, damage: 6, armor: 0},
    {name: "Longsword", cost: 40, damage: 7, armor: 0},
    {name: "Greataxe", cost: 74, damage: 8, armor: 0}
];

const armor: TEquipment[] = [
    {name: "Leather", cost: 13, damage: 0, armor: 1},
    {name: "Chainmail", cost: 31, damage: 0, armor: 2},
    {name: "Splintmail", cost: 53, damage: 0, armor: 3},
    {name: "Bandedmail", cost: 75, damage: 0, armor: 4},
    {name: "Platemail", cost: 102, damage: 0, armor: 5}
];
const rings: TEquipment[] = [
    {name: "Damage + 1", cost: 25, damage: 1, armor: 0},
    {name: "Damage + 2", cost: 50, damage: 2, armor: 0},
    {name: "Damage + 3", cost: 100, damage: 3, armor: 0},
    {name: "Defense + 1", cost: 20, damage: 0, armor: 1},
    {name: "Defense + 2", cost: 40, damage: 0, armor: 2},
    {name: "Defense + 3", cost: 80, damage: 0, armor: 3}
]



const fight = (player: TPlayer, boss: TOpponent): boolean => {
    const playerDamagePerTurn = Math.max(1, player.damage - boss.armor);
    const bossDamagePerTurn = Math.max(1, boss.damage - player.armor);
    const playerTurnsToWin = Math.ceil(boss.hitPoints / playerDamagePerTurn);
    const bossTurnsToWin = Math.ceil(player.hitPoints / bossDamagePerTurn);
    return playerTurnsToWin <= bossTurnsToWin;
}

const getPlayer = (equipment: TEquipment[]): TPlayer => {
    const sum = equipment.reduce((a, e) => ({
        cost: a.cost + e.cost,
        damage: a.damage + e.damage,
        armor: a.armor + e.armor
    }), {cost: 0, damage: 0, armor: 0})
    return {hitPoints: 100, ...sum, equipment};
}
const findBestEquipment = (boss: TOpponent) => {
    const players: TPlayer[] = [];
    for (const weapon of weapons) {
        // No armor
        players.push(getPlayer([weapon]));
        // With armor
        for (const arm of armor) {
            players.push(getPlayer([weapon, arm]));
            // With rings
            for (let i = 0; i < rings.length; i++) {
                players.push(getPlayer([weapon, arm, rings[i]]));
                for (let j = i + 1; j < rings.length; j++) {
                    players.push(getPlayer([weapon, arm, rings[i], rings[j]]));
                }
            }
        }
        // No armor, with rings
        for (let i = 0; i < rings.length; i++) {
            players.push(getPlayer([weapon, rings[i]]));
            for (let j = i + 1; j < rings.length; j++) {
                players.push(getPlayer([weapon, rings[i], rings[j]]));
            }
        }
    }
    players.sort((a, b) => a.cost - b.cost);
    for (const player of players) {
        if (fight(player, boss)) {
            console.log(`Player wins with cost ${player.cost} (Damage: ${player.damage}, Armor: ${player.armor}), Equipment: ${player.equipment.map(e => e.name).join(', ')}`);
            break;
        }
    }
    players.reverse();
    for (const player of players) {
        if (!fight(player, boss)) {
            console.log(`Boss wins with cost ${player.cost} (Damage: ${player.damage}, Armor: ${player.armor}), Equipment: ${player.equipment.map(e => e.name).join(', ')}`);
            break;
        }
    }
}

console.log("Advent of Code - 2015 - 21")
console.log("https://adventofcode.com/2015/day/21")
const examplePlayer = {hitPoints: 8, damage: 5, armor: 5};
const exampleBoss = {hitPoints: 12, damage: 7, armor: 2};
console.log("Example Fight:", fight(examplePlayer, exampleBoss) ? "Player wins" : "Boss wins");

console.time("Stardata");
console.log("Stardata")
const boss = {hitPoints: 104, damage: 8, armor: 1};
findBestEquipment(boss)
console.timeEnd("Stardata");
