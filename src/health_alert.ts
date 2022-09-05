import { Bot } from "mineflayer";
import { log } from "./logger";

export function onHealthChange(bot: Bot) {
    if (currentHealth === -1) {
        currentHealth = bot.health
        return;
    }


    if (bot.health < currentHealth) {

        if (process.env.ATTACK_ALERT) {
            log("alert", "You are being attacked!")
        }

        if (process.env.DISCONNECT_ON_ATTACK) {
            log("alert", "Quitting because of attack...")
            bot.quit()
            process.exit(0)
        }
    }

    currentHealth = bot.health
}

/**
 * Last recorded health
 */
let currentHealth: number = -1;

export function recordHealth(health: number) {
    currentHealth = health
}