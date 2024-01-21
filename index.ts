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
    const { player } = heartbeat;
    if (!player) return;

    // if we're dead, respawn
    if (player.hp <= 0) {
      return player.respawn();
    }

    // run to the right
    return player.move({
      x: player.position.x + 10,
      y: 0,
    });
  },
});
