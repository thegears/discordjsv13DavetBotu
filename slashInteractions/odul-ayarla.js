const {
	SlashCommandBuilder
} = require('@discordjs/builders');
const {
	Permissions
} = require('discord.js');

module.exports = {
	name: "odul-ayarla",
	command: new SlashCommandBuilder().setName("odul-ayarla").setDescription("Belirlediğiniz davet sayısına ulaşana belirlediğniniz rolü verir.").addIntegerOption(option => option.setName("count").setDescription("Ulaşılması gereken davet sayısı").setRequired(true)).addRoleOption(option => option.setName("role").setDescription("Ödül rolü").setRequired(true)),
	async run(client, int, db) {
		let count = int.options.getInteger("count");
		let role = int.options.getRole("role");

		if (!int.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) await int.reply({
			content: "Yetkili değilsin.",
			ephemeral: true
		})
		else if (isNaN(count)) await int.reply({
			content: "Bir sayı girin.",
			ephemeral: true
		})
		else {
			db.set(`${int.guild.id}_count_${count}_role`, `${role.id}`);

			await int.reply({
				content: "Ayarlandı.",
				ephemeral: true
			});
		};
	}
};