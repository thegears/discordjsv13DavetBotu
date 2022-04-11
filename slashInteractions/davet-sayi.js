const {
	SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
	name: "davet-sayi",
	command: new SlashCommandBuilder().setName("davet-sayi").setDescription("Etiketlenen kullanıcı hakkında davet sayısını verir.").addUserOption(option => option.setName("user").setDescription("Bir kullanıcı seç.").setRequired(true)),
	async run(client, int, db) {
		let user = int.options.getUser("user");

		let inviteCount = db.get(`${int.guild.id}_${user.id}_invite_count`) || 0;

		int.reply({
			content: `Bu kişinin davet sayısı : ${inviteCount}`,
			ephemeral: true
		});
	}
};