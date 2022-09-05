import { Command } from "../new_chat_commands";

const githubURL = "https://github.com/mygizli04/zillybot-mc";

export const command: Command = {
    names: ["help", "info"],

    run() {
        return `I am a bot. My code is here: ${githubURL}`
    }
}