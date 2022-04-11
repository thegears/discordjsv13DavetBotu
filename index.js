const {
	JsonDatabase
} = require("wio.db");
const db = new JsonDatabase({
	databasePath: "./db.json"
});
const {
	REST
} = require('@discordjs/rest');
const {
	Routes
} = require('discord-api-types/v9');
const {
	Client,
	Intents,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	Collection,
	MessageSelectMenu
} = require("discord.js");
const config = require("./config.json");
const {
	readdirSync
} = require("fs");
const client = new Client({
	intents: 32767
});
const discordModals = require("discord-modals");
const {
	Modal,
	TextInputComponent,
	showModal
} = require("discord-modals");
discordModals(client);
client.login(config.token);

client.invites = new Collection();

// Slash Etkileşimleri
client.slashInteractions = new Collection();
let globalSlashCommands = [];
readdirSync("./slashInteractions/").forEach(f => {
	let cmd = require(`./slashInteractions/${f}`);
	client.slashInteractions.set(cmd.name, cmd);
	globalSlashCommands.push(cmd.command);
});
// Slash Etkileşimleri

// Slash Global Komutlar Ekleyelim ve Davet'leri çekelim
let rest = new REST({
	version: '9'
}).setToken(config.token);

client.on("ready", async () => {

	client.guilds.cache.forEach(async g => {
		guildInvites = await g.invites.fetch();

		client.invites.set(g.id, guildInvites.map(i => ({
			code: i.code,
			uses: i.uses
		})));
	});

	try {

		console.log(globalSlashCommands.map(a => a.name).join(",") + " komutları yükleniyor...");

		await rest.put(
			Routes.applicationCommands(client.user.id), {
				body: globalSlashCommands
			},
		);

		console.log("Komutlar yüklendi.Bot hazır.");
	} catch (error) {
		console.error(error);
	};

});
// Slash Global Komutlar Ekleyelim ve Davet'leri çekelim

// Events'ları çekelim
readdirSync("./events/").forEach(f => {
	let event = require(`./events/${f}`);

	client.on(`${event.name}`, (...args) => {
		event.run(...args, client, db);
	});
});
// Events'ları çekelim


client.on("interactionCreate", async int => {

	if (int.isCommand()) client.slashInteractions.get(int.commandName)?.run(client, int, db);
	else if (int.isContextMenu()) client.contextMenuInteractions.get(int.customId)?.run(client, int, db);
	else if (int.isSelectMenu()) client.selectMenuInteractions.get(int.customId)?.run(client, int, db);
	else client.buttonInteractions.get(int.customId)?.run(client, int, db);

});

client.on('modalSubmit', async (modal) => {

	client.modalInteractions.get(modal.customId)?.run(client, int, db);

});