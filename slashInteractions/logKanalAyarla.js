const {
	SlashCommandBuilder
} = require('@discordjs/builders');
const {
	Permissions
} = require('discord.js');

module.exports = {
	name: "log-kanal-ayarla",
	command: new SlashCommandBuilder().setName("log-kanal-ayarla").setDescription("Log kanalını ayarlarsınız.").addChannelOption(option => option.setName('channel').setDescription('Bir kanal seç.').setRequired(true)),
	async run(client, int, db) {
		let channel = int.options.getChannel("channel");

		if (!int.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) await int.reply({
			content: "Yetkili değilsin.",
			ephemeral: true
		})
		else if (client.channels.cache.get(channel.id).type != "GUILD_TEXT") await int.reply({
			content: "Bir yazı kanalı etiketleyin.",
			ephemeral: true
		})
		else {
			db.set(`${int.guild.id}_log_channel`, `${channel.id}`);
			await int.reply({
				content: "Ayarlandı.",
				ephemeral: true
			});
		};

	}
};