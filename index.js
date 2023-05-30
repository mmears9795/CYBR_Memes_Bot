import fetch from 'node-fetch';

import { Client, Intents, Guild, BitField } from 'discord.js';

import dotenv from 'dotenv';

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let prevMeme = "";

let prevPrevMeme = "";

bot.on("ready", () => {
    console.log("The bot is ready");
});
    
bot.on('messageCreate', async message => {
        if(!message.content.startsWith("!" || message.author.bot)) return;
    
        const args = message.content.slice(1).split(/ + /);
        const command = args.shift().toLocaleLowerCase();

        if(command === 'meme') {
            try {
                bot.user.setActivity("!meme", {type: 'WATCHING'});
            
                let MemeLink = await getMeme();

                while (MemeLink === prevMeme || MemeLink === prevPrevMeme) {
                    console.log(MemeLink);
                    MemeLink = await getMeme();
                }

                message.channel.send("Here is your meme! If you want yours added, post them in <#865447493792825344>")

                message.channel.send(await MemeLink);

                prevPrevMeme = prevMeme;
                prevMeme = MemeLink;


            } catch(error) {
                console.log(error);
                message.channel.send("Please try the command again!");
            }
        }

});

async function getMeme() {
    try {
        const url = "https://thecyberenterprise.com/api/random_meme.php";
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
            }
        });
        const data = await response.json();
        
        return data.memePath;
    } catch (error) {
    console.log(error);
    getMeme();
    }
}

bot.login(process.env.DISCORD_BOT_TOKEN);