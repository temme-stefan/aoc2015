type TBoss = { hp: number, damage: number };
type TPlayer22 = { hp: number, damage: number, mana: number, armor: number };
type TEffect = { name: string, timer: number, cost: number };

const availableEffects = [
    {name: "Magic Missile", timer: 0, cost: 53},
    {name: "Drain", timer: 0, cost: 73},
    {name: "Shield", timer: 6, cost: 113},
    {name: "Poison", timer: 6, cost: 173},
    {name: "Recharge", timer: 5, cost: 229}
];

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

const doFight = (player: TPlayer22, boss: TBoss, effects: TEffect[], spendMana: number, playedEffects: string[], hard: boolean) => {
    let result: TResult[] = [];
    for (const effect of availableEffects) {
        //Players turn first
        const p = {...player}
        const b = {...boss}
        const runningEffects: TEffect[] = effects.map(e => ({...e}));
        const played = [...playedEffects, effect.name];
        let mana = spendMana;
        if (hard) {
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

const fight22 = (player: TPlayer22, boss: TBoss, hard: boolean = false) => {
    let states = [{
        player: {...player},
        boss: {...boss},
        effects: [] as TEffect[],
        manaSpent: 0,
        playedEffects: [] as string[]
    }];
    let min = Number.MAX_SAFE_INTEGER;
    // Minimales Mana um Boss zu besiegen (untere Schranke)
    const minPossibleMana = (boss: TBoss, effects: TEffect[]) => {
        // Berechne Schaden durch laufende Poison-Effekte
        const poisonEffect = effects.find(e => e.name === "Poison");
        const poisonDamage = poisonEffect ? poisonEffect.timer * 3 : 0;

        // Verbleibende HP nach Poison
        const remainingHp = Math.max(0, boss.hp - poisonDamage);

        // Minimales Mana für verbleibenden Schaden (Magic Missile: 53 Mana für 4 Schaden)
        return Math.ceil(remainingHp / 4) * 53;
    }

    // Im Loop:
    while (states.length > 0) {
        const {player, boss, effects, manaSpent, playedEffects} = states.shift();
        if (manaSpent + minPossibleMana(boss, effects) >= min) {
            continue;
        }
        const result = doFight(player, boss, effects, manaSpent, playedEffects, hard)
        for (const res of result) {
            if (res.winner === 'player' && res.spendMana < min) {
                min = res.spendMana;
                console.log("New minimum found:", min, "with effects:", res.playedEffects);
                states = states.filter(({manaSpent,boss,effects })=> manaSpent + minPossibleMana(boss, effects) >= min);


            } else if (res.winner === 'none') {
                states.push({
                    player: res.player,
                    boss: res.boss,
                    effects: res.effects || [],
                    manaSpent: res.spendMana || 0,
                    playedEffects: res.playedEffects || []
                });
            }
        }
    }
    console.log("Minimum mana to win:" + (hard ? " hard " : ""), min);


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
console.timeLog("Stardata", "now Hard mode")
fight22(playerStar, bossStar, true);
console.timeEnd("Stardata");
