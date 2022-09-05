import { Command } from "../new_chat_commands";
import { getSavedData } from "../saved_data";

export const command: Command = {
    names: ["lastseen"],

    run(args, username) {
        const savedData = getSavedData();
        const playerData = savedData.players.find(savedPlayer => savedPlayer.name === (args[0] || username))

        if (!playerData) {
            if (args[0]) {
                return "I've never seen that player before."
            }
            else {
                // Should never happen?
                return "There was an error trying to find you in my database :("
            }
        }

        return playerData.lastSeen.toUTCString()
    }
}