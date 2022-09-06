import * as logger from './logger';
import * as helpers from './helpers';
import * as chatCommands from './new_chat_commands';

import { Bot } from 'mineflayer';
import { onHealthChange } from './health_alert';
import { onTick } from './entity_alert';

import * as savedData from "./saved_data"

export function initHooks(bot: Bot) {
  bot.on('chat', (username, message) => {
    logger.log('chat', `<${username}> ${message}`)
    if (username === bot.username) return
    if (message === 'chat test') bot.chat('uwu test')

    chatCommands.onMessage(bot, username, message)
  })

  bot.on('whisper', (username, message) => {
    logger.log('whisper', `${username}: ${message}`)
    bot.chat('I am a bot. My code is here: https://github.com/ChillerDragon/zillybot-mc')
  })

  bot.on("playerDeath", data => {
    if (data.victim.type !== "player") return;

    const currentData = savedData.getSavedData();

    if (data.victim.id === bot.player.uuid) {
      currentData.deaths++
      savedData.setSavedData(currentData)
    }
    else {
      let player = currentData.players.find(player => player.uuid === bot.player.uuid);

      if (!player) {
        // We need to get the player info, obviously
      }
    }
  })

  // bot.on('message', (message) => {
  //   console.log(message)
  // })

  bot.on('messagestr', (messagestr, _position, message) => {
    if (message.translate === 'chat.type.text') return

    logger.log('message', messagestr)
  })

  if ((process.env.ATTACK_ALERT === "TRUE") || (process.env.DISCONNECT_ON_ATTACK === "TRUE")) {
    bot.on("health", () => {
      onHealthChange(bot)
    })
  }

  if (process.env.CREEPER_ALERT === "TRUE" || process.env.DISCONNECT_ON_CREEPER_NEARBY === "TRUE" || process.env.PLAYER_ALERT === "TRUE" || process.env.DISCONNECT_ON_PLAYER_NEARBY === "TRUE") {
    bot.on("physicsTick", () => {
      onTick(bot)
    })
  }

  bot.on('playerJoined', (player) => {
    if (player.username === bot.username) return;
    
    const currentData = savedData.getSavedData()
    let playerData = currentData.players.find(savedPlayer => savedPlayer.uuid === player.uuid);

    if (!playerData) {
      playerData = {
        name: player.username,
        uuid: player.uuid,
        deaths: 0,
        firstSeen: new Date(),
        kills: 0,
        lastSeen: new Date()
      }

      currentData.players.push(playerData)
    }
    else {
      playerData.lastSeen = new Date()
    }

    savedData.setSavedData(currentData)
  })

  // bot.on('playerLeft', (player) => {
  //   logger.log('server', `${player.username} left the game`)
  // })

  bot.once('spawn', () => {
    helpers.printPlayerList(bot)
  })

  bot.once('login', () => {
    logger.log('bot', 'connected to server.')
  })
}