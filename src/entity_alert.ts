import { Bot } from "mineflayer";
import { log } from "./logger";

export function onTick(bot: Bot) {
    for (let entityId in bot.entities) {
        if ((process.env.CREEPER_ALERT || process.env.DISCONNECT_ON_CREEPER_NEARBY) && bot.entities[entityId].mobType === "Creeper") {
            if (process.env.CREEPER_ALERT) {
                log("alert", "There is a creeper nearby!")
            }

            if (process.env.DISCONNECT_ON_CREEPER_NEARBY) {
                log("alert", "Quitting because of nearby creeper...")
                bot.quit()
                process.exit(0)
            }
        }

        if ((process.env.PLAYER_ALERT || process.env.DISCONNECT_ON_PLAYER_NEARBY) && bot.entities[entityId].name === "player" && bot.entities[entityId].username !== bot.player.username) {
            if (process.env.PLAYER_ALERT) {
                log("alert", "There is a player nearby!")
            }

            if (process.env.DISCONNECT_ON_PLAYER_NEARBY) {
                log("alert", "Quitting because of nearby player...")
                bot.quit()
                process.exit(0)
            }
        }
    }
}