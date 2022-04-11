const {
	MessageEmbed
} = require("discord.js");

module.exports = {
	name: "guildMemberRemove",
	async run(member, client, db) {
		let inviter = db.get(`${member.guild.id}_${member.id}_inviter`);

		db.substr(`${member.guild.id}_${inviter}_invite_count`, 1);

		if (db.get(`${member.guild.id}_log_channel`)) {
			try {
				client.channels.cache.get(db.get(`${member.guild.id}_log_channel`)).send({
					embeds: [new MessageEmbed().setColor("RED").setTitle("ÇIKIŞ").setDescription("Biri sunucudan çıktı.").setFooter({
						text: `${client.user.tag}`,
						iconURL: client.user.displayAvatarURL({
							format: "jpg"
						})
					}).addField("Çıkan kişi", `${member.user.tag}`).addField("Davet eden", `<@!${inviter}>`).setTimestamp()]
				});
			} catch (err) {
				console.log(`BU MESAJ KANALA ATILACAKTI AMA HATA ALDIM ! => ${member.guild.name} | ${member.guild.id} sunucusundan ${member.user.username} | ${member.user.id} çıktı. Davet eden ${inviter}`);
			}
		} else {
			console.log(`${member.guild.name} | ${member.guild.id} sunucusundan ${member.user.username} | ${member.user.id} çıktı. Davet eden ${inviter}`);
		};

		let inviteCount = db.get(`${member.guild.id}_${inviter}_invite_count`);

		if (db.get(`${member.guild.id}_count_${inviteCount+1}_role`)) {
			let roleName = member.guild.roles.cache.get(db.get(`${member.guild.id}_count_${inviteCount+1}_role`)).name;

			try {
				member.guild.members.cache.get(`${inviter}`).roles.remove(db.get(`${member.guild.id}_count_${inviteCount+1}_role`));
			} catch (err) {
				console.log("Rol alırken bir hata aldım.");
			};

			if (db.get(`${member.guild.id}_log_channel`)) {
				try {
					client.channels.cache.get(db.get(`${member.guild.id}_log_channel`)).send({
						embeds: [new MessageEmbed().setColor("RED").setFooter({
							text: `${client.user.tag}`,
							iconURL: client.user.displayAvatarURL({
								format: "jpg"
							})
						}).setTitle("ÖDÜL İPTAL").setTimestamp().setDescription("Birinin ödül rolü alındı ! ").addField("Alınan kişi", `<@!${inviter}>`).addField("Davet sayısı", `${inviteCount}`).addField("Rol", `${roleName}`)]
					})
				} catch (err) {
					console.log(`BU MESAJ KANALA ATIALCAKTI AMA HATA ALDIM ! => ${inviter} idli kişinin ${roleName} rolü alındı.`);
				}
			};
		};
	}
};