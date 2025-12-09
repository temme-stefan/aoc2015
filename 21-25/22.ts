type TBoss = { hp: number, damage: number };
type TPlayer22 = { hp: number, damage: number, mana: number, armor: number };
type TEffect = { name: string, timer: number, cost: number };

const availableEffects = [
    {name: "Shield", timer: 6, cost: 113},
    {name: "Poison", timer: 6, cost: 173},
    {name: "Recharge", timer: 5, cost: 229},
    {name: "Magic Missile", timer: 0, cost: 53},
    {name: "Drain", timer: 0, cost: 73},
].sort((a, b) => a.cost - b.cost);

const handleEffects = (player: TPlayer22, boss: TBoss, effects: TEffect[]) => {
    for (let i = effects.length - 1; i >= 0; i--) {
        const effect = effects[i];
        switch (effect.name) {
            case "Shield":
                player.armor = 7;
                effect.timer--;
                break;
            case "Poison":
                boss.hp -= 3;
                effect.timer--;
                break;
            case "Recharge":
                player.mana += 101;
                effect.timer--;
                break;
            default:
                console.warn('Unknown effect:', effect.name);
                break;

        }
        if (effect.timer <= 0) {
            if (effect.name === "Shield") {
                player.armor = 0;
            }
            effects.splice(i, 1);
        }
    }
}

type TResult = {
    winner: 'player' | 'boss' | 'none',
    player: TPlayer22,
    boss: TBoss,
    effects?: TEffect[],
    reason: string,
    spendMana?: number,
    playedEffects?: string[]
}

const doFight = (player: TPlayer22, boss: TBoss, effects: TEffect[], spendMana: number, playedEffects:string[], hard:boolean) => {
    let result: TResult[] = [];
    for (const effect of availableEffects) {
        //Players turn first
        const p = {...player}
        const b = {...boss}
        const runningEffects: TEffect[] = effects.map(e => ({...e}));
        const played = [...playedEffects, effect.name];
        let mana = spendMana;
        if (hard){
            p.hp--;
            if (p.hp <= 0) {
                result.push({
                    winner: 'boss',
                    player: p,
                    boss: b,
                    reason: "player hp <= 0 (hard mode)"
                })
                continue;
            }
        }

        handleEffects(p, b, runningEffects);
        if (effect.cost > player.mana) {
            result.push({
                winner: 'boss',
                player: p,
                boss: b,
                reason: "not enough mana"
            })
            continue;
        }
        p.mana -= effect.cost;
        mana += effect.cost;
        switch (effect.name) {
            case "Magic Missile":
                b.hp -= 4;
                break;
            case "Drain":
                b.hp -= 2;
                p.hp += 2;
                break;
            case "Shield":
            case "Poison":
            case "Recharge":
                if (runningEffects.find(e => e.name === effect.name)) {
                    result.push({
                        winner: 'boss',
                        player: p,
                        boss: b,
                        reason: "effect already running"
                    })
                    continue;
                } else {
                    runningEffects.push({...effect});
                }
                break;
            default:
                console.warn('Unknown effect:', effect.name);
                break;
        }
        //Boss turn second
        if (b.hp <= 0) {
            result.push({
                winner: 'player',
                player: p,
                boss: b,
                reason: "boss hp <= 0",
                spendMana: mana,
                playedEffects: played
            })
            continue;
        }
        handleEffects(p, b, runningEffects);
        if (b.hp <= 0) {
            result.push({
                winner: 'player',
                player: p,
                boss: b,
                reason: "boss hp <= 0",
                spendMana: mana,
                playedEffects: played
            })
            continue;
        }
        const damage = Math.max(1, b.damage - p.armor);
        p.hp -= damage;
        if (p.hp <= 0) {
            result.push({
                winner: 'boss',
                player: p,
                boss: b,
                reason: "player hp <= 0"
            })
            continue;
        }
        result.push({
            winner: 'none',
            player: p,
            boss: b,
            effects: runningEffects,
            reason: "next turn",
            spendMana: mana,
            playedEffects: played
        });
    }
    return result;
}

const fight22 = (player: TPlayer22, boss: TBoss, hard:boolean=false) => {
    const states = [{
        player: {...player},
        boss: {...boss},
        effects: [] as TEffect[],
        manaSpent: 0,
        playedEffects: [] as string[]
    }];
    let min = Number.MAX_SAFE_INTEGER;
    while (states.length > 0) {
        const {player, boss, effects, manaSpent, playedEffects} = states.shift();
        if (manaSpent>min) {
            continue;
        }
        const result = doFight(player, boss, effects, manaSpent, playedEffects, hard)
        const winnerPartion = Map.groupBy(result, r => r.winner);
        const playerWins = winnerPartion.get('player') || [];
        const noneWins = winnerPartion.get('none') || [];
        for (const playerWin of playerWins) {
            // console.log("Player win found:", playerWin.playedEffects, "spending mana:", playerWin.spendMana);
            if (playerWin.spendMana < min) {
                min = playerWin.spendMana;
                console.log ("New minimum found:", min, "with effects:", playerWin.playedEffects);
            }


        }
        states.push(...noneWins.map(w => ({
            player: w.player,
            boss: w.boss,
            effects: w.effects || [],
            manaSpent: w.spendMana || 0,
            playedEffects: w.playedEffects || []
        })));
    }
    console.log("Minimum mana to win:"+(hard?" hard ":""), min);


}
console.log("Advent of Code - 2015 - 22")
console.log("https://adventofcode.com/2015/day/22")
console.time("Example");
console.log("Example")
const player = {hp: 10, damage: 0, mana: 250, armor: 0};
const boss1 = {hp: 13, damage: 8};
fight22(player, boss1);
const boss2 = {hp: 14, damage: 8};
fight22(player, boss2);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
const playerStar = {hp: 50, damage: 0, mana: 500, armor: 0};
const bossStar = {hp: 71, damage: 10};
fight22(playerStar, bossStar);
fight22(playerStar, bossStar, true);
console.timeEnd("Stardata");
