import _ from "lodash";

interface SavedData {
    players: Player[];
    deaths: number;
    mails: Mail[];
}

function validateSavedData (obj: any): obj is SavedData {
    if (obj.players.length !== 0) {
        for (let player of (obj.players as any[])) {
            if (!validatePlayer(player)) {
                return false;
            }
        }
    }

    if (typeof obj.deaths !== "number") return false;
    if (obj.mails.length !== 0 && !((obj.mails as any[]).find(player => !validateMail(player)))) return false;

    return true;
}

interface Player {
    name: string;
    uuid: string;
    firstSeen: Date;
    lastSeen: Date;
    deaths: number;
    kills: number;
}

function validatePlayer (obj: any): obj is Player {
    if (typeof obj.name !== "string") return false;
    if (typeof obj.uuid !== "string") return false;
    if (new Date(obj.firstSeen).toString() === "Invalid Date") return false;
    if (new Date(obj.lastSeen).toString() === "Invalid Date") return false;
    if (typeof obj.deaths !== "number") return false;
    if (typeof obj.kills !== "number") return false;

    return true;
}

interface Mail {
    by: string;
    to: string;
    contents: string;
    read: boolean;
    sentOn: Date;
}

function validateMail (obj: any): obj is Mail {
    // Would've made `by` and `to` Player objects but that causes an infinite recursion lol
    if (typeof obj.by !== "string") return false;
    if (typeof obj.to !== "string") return false;

    if (typeof obj.contents !== "string") return false;
    if (typeof obj.read !== "boolean") return false;
    if (new Date(obj.sentOn).toString() === "Invalid Date") return false;

    return true;
}

import fs from "fs";
import { logAndThrow } from "./logger";

let cache: SavedData | undefined;

fs.access("./saved_data.json", (err) => {
    if (err) {
        cache = {
            players: [],
            deaths: 0,
            mails: []
        };

        fs.writeFileSync("./saved_data.json", JSON.stringify(cache, null, "\t"));
    }
    else {
        // @ts-ignore-error | We know saved data exists at this point so eh
        import("../saved_data.json").then(data => {
            data = data.default;

            if (!validateSavedData(data)) {
                logAndThrow(new Error("Could not validate saved data!"));
            }

            data = getSavedDataWithDate(data);

            cache = data;
        }).catch(err => {
            logAndThrow(err);
        });
    }
});

export function getSavedData (): SavedData {
    // If we haven't cached the saved data yet just yolo and send *something*
    // @ts-ignore-error | It's already handled if saved_data.json doesn't exist
    return cache || (fs.existsSync("./saved_data.json") && JSON.parse(fs.readFileSync("./saved_data.json").toString())) || { players: [], deaths: 0, mails: [] };
}

export function setSavedData (data: SavedData) {
    if (!validateSavedData(data)) {
        debugger;
        logAndThrow(new Error("Tried to write invalid data to disk!"));
    }

    fs.writeFileSync("./saved_data.json", JSON.stringify(getSavedDataWithoutDate(data), null, "\t"));
    cache = data;
}

function getSavedDataWithoutDate (data: SavedData) {
    // Dang javascript!!!
    // This has to be here so javascript will not overwrite the original variable.
    // Why is that even a thing?
    const mut = _.cloneDeep(data)

    // Change back Date type to number type

    mut.players.map(player => {
        // @ts-expect-error | Who needs typechecking when you can just ignore errors lmao
        player.firstSeen = player.firstSeen.getTime();

        // @ts-expect-error | Who needs typechecking when you can just ignore errors lmao
        player.lastSeen = player.lastSeen.getTime();
    });

    mut.mails.map(mail => {
        // @ts-expect-error | Who needs typechecking when you can just ignore errors lmao
        mail.sentOn = mail.sentOn.getTime();
    });

    return mut;
}

function getSavedDataWithDate (data: SavedData) {
    const mut = _.cloneDeep(data)

    // Change number type to Date
    mut.players.map(player => {
        player.firstSeen = new Date(player.firstSeen);
        player.lastSeen = new Date(player.lastSeen);
    });

    mut.mails.map(mail => {
        mail.sentOn = new Date(mail.sentOn);
    });

    return mut;
}