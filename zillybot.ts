#!/usr/bin/env node

import prompt from 'prompt'
import mineflayer from 'mineflayer';

import * as logger from './src/logger';
import { initHooks } from './src/hooks';

require('dotenv').config()

prompt.start()

class ChatPrompt {
  private bot?: mineflayer.Bot

  setBot (bot: mineflayer.Bot) {
    this.bot = bot
  }

  getInput () {
    prompt.get(['chat'], (err, result) => {
      if (err) {
        logger.logAndThrow(err)
      }

      if (!this.bot) {
        logger.logAndThrow(new Error("Chat requested but bot is not set?"))
      }

      // Never used prompt before. Not sure what RevalidatorScheme is for but it appears ChillerDragon assumed it to always be string
      this.bot.chat(result.chat as string)
      this.getInput()
    })
  }
}

function reconnect(msg: string, chatPrompt: ChatPrompt) {
  const delay = 10
  logger.log('bot', `Got disconnect: ${msg}`)
  logger.log('bot', `reconnecting in ${delay} seconds ...`)
  setTimeout(() => {
    connect(chatPrompt)
  }, 1000 * delay)
}

function connect(chatPrompt: ChatPrompt) {
  if (!process.env.SERVER_IP) {
    logger.logAndThrow(new Error("Server ip not set in environment variables?"))
  }

  if (!process.env.MC_USERNAME) {
    logger.logAndThrow(new Error("Minecraft username not set in environment variables?"))
  }

  // Password technically optional as mineflayer will join in offline mode without it.
  // Not sure if intentional but I'll keep it.

  if (!process.env.MC_PASSWORD) {
    logger.log('bot', "Password is not specified in environment variables. Offline mode will be used.")
  }

  const bot = mineflayer.createBot({
    host: process.env.SERVER_IP,
    username: process.env.MC_USERNAME,
    password: process.env.MC_PASSWORD,
    // port: 25565,
    // version: false,
    auth: process.env.MC_PASSWORD ? 'microsoft': "offline"
  })

  logger.log('bot', `connecting to ${process.env.SERVER_IP} ...`)

  initHooks(bot)
  // bot.once('disconnect', () => reconnect(chatPrompt))
  bot.on('kicked', (reason) => reconnect(reason, chatPrompt))
  bot.on('error', (reason) => reconnect(reason.message, chatPrompt))

  chatPrompt.setBot(bot)
}

const chatPrompt = new ChatPrompt()
connect(chatPrompt)
chatPrompt.getInput()
