import * as logger from './logger';
import * as helpers from './helpers';
import * as chatCommands from './chat_commands';

import { Bot } from 'mineflayer';

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

  // bot.on('message', (message) => {
  //   console.log(message)
  // })

  bot.on('messagestr', (messagestr, _position, message) => {
    if (message.translate === 'chat.type.text') return

    logger.log('message', messagestr)
  })

  // bot.on('playerJoined', (player) => {
  //   logger.log('server', `${player.username} joined the game`)
  // })

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