/**
 * Defines a command that can be run.
 */
export interface Command {
    /**
     * The name and aliases of the command.
     */
    names: string[]

    /**
     * The function to be called that executes the commands.
     * @param args The arguments to this command.
     * @returns The message to be sent to the player
     */
    run(args: string[], player: string): string;
}

const commands: Command[] = []

import fs from "fs";

fs.readdirSync("./out/src/commands").forEach(async file => {
    if (file.endsWith(".js")) {
        import("./commands/" + file).then(command => commands.push(command.command))
    }
})

import * as logger from "./logger.js"

import { Bot } from "mineflayer";

export function onMessage(bot: Bot, username: string, message: string) {
    if (!message.startsWith("!")) {
        return;
    }

    const input = message.slice(1).split(' ')
    const cmd = input[0]
    const args = input.length > 1 ? input.slice(1) : []

    const commandToRun = commands.find(command => command.names.includes(cmd))

    if (!commandToRun) {
        logger.log("bot", `Possible command "${cmd}" not found.`)
        return;
    }

    logger.log("bot", `Running command: ${cmd}`)
    bot.chat(commandToRun.run(args, username))
}