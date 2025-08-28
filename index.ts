import { connect } from "programming-game";
import { config } from "dotenv";

config({
  path: ".env",
});

const assertEnv = (key: string): string => {
  const val = process.env[key];
  if (!val) {
    throw new Error(
      `Missing env var ${key}, please check your .env file, you can get these values from https://programming-game.com/dashboard`
    );
  }
  return val;
};

connect({
  credentials: {
    id: assertEnv("USER_ID"),
    key: assertEnv("API_KEY"),
  },
  onTick(heartbeat) {
    const { player, units } = heartbeat;
    if (!player) return;

    // if we're dead, respawn
    if (player.hp <= 0) {
      return player.respawn();
    }

    // if we're low on health, retreat back to town
    if (player.hp < player.stats.maxHp / 2) {
      return player.move({ x: 0, y: 0 });
    }

    // if we're low on calories, eat
    if (player.calories < 2500) {
      // const food = player.inventory.chickenMeat.find(item => item.type === "food");
      if (player.inventory.chickenMeat) {
        return player.eat("chickenMeat");
      }
      if (player.inventory.ratMeat) {
        return player.eat("ratMeat");
      }
      if (player.inventory.snakeMeat) {
        return player.eat("snakeMeat");
      }
    }

    // if we're heavy sell down
    // can't get weight, jsut sell for now
    const npc = Object.values(units)
      .find(unit => unit.type === "npc");

    let aid_digestion = player.inventory.aid_digestion;

    if (npc) {
      if (aid_digestion && aid_digestion > 1) {
        return player.sell({ items: { aid_digestion: aid_digestion - 1 }, to: npc });
      }

      let feathers = player.inventory.feather;

      if (feathers) {
        return player.sell({ items: { feather: feathers }, to: npc });
      }
    }
    
    if (player.inventory.aid_digestion && player.inventory.aid_digestion > 1) {
      return player.move({ x: 0, y: 0 });
    }


    // fight any nearby monsters
    const monster = Object.values(units)
      .find(unit => unit.type === "monster");
    
    if (monster) {
      if (player.tp >= 40) {
        return player.useWeaponSkill(({skill: "headbutt", target: monster}));
      }
      return player.attack(monster);
    }

    // run to the right
    return player.move({
      x: player.position.x + 10,
      y: 0,
    });
  },
});
