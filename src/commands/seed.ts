import { Command } from "../new_chat_commands";

export const command: Command = {
    names: ["seed"],

    run() {
        if (process.env.SEED) {
            return `the seed is: ${process.env.SEED}`
        }
        else {
            return "Sorry, I don't know the seed. :/"
        }
    }
}