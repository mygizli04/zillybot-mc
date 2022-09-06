# zillybot-mc

yet another crappy headless minecraft bot

Nothing to see here. The cool library that makes it all happen is https://github.com/PrismarineJS/mineflayer



## getting started

    cp env.example .env
    nano .env
    npm install
    npm start

### private data (ignore this, its just for me)

    git clone git@github.com:mygizli04/zillybot-mc-data.git data
    cd data
    ./setup.sh

## goals of the project

Building a headless client that can be used as interactive terminal client and as bot.

### interactive client

- [x] chatting
- [ ] show inventory
- [x] notify user about danger
    + [x] alert/disconnect on damage
    + [x] alert/disconnect on creeper nearby
    + [x] alert/disconnect on player nearby

### bot client

- [x] stay on server (auto reconnect)
- [ ] stay alive
    + [ ] auto eat
    + [ ] kill aura
    + [ ] no fall damage hack
- [x] log everything to a file
    + [ ] parse the logfile or use a database to get stats
- [ ] chat commands about stats
    + [x] !lastseen
    + [x] !firstseen
    + [ ] !deaths
    + [ ] !kills
    + [x] !seed
    + [ ] !mail
- [ ] bridge minecraft chat to irc

## features

- show playerlist on join
- interactive chat
- chat logfile

![chat](img/chat.png)
