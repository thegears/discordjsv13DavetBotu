const {
	MessageEmbed
} = require("discord.js");


module.exports = {
	name: "guildMemberAdd",
	async run(member, client, db) {

		var nowInvites = await member.guild.invites.fetch();

		var oldInvites = client.invites.get(member.guild.id);

		var invite = nowInvites.find(i => i.uses > oldInvites.find(oi => oi.code == i.code).uses);
		oldInvites.find(oi => oi.code == i.code).uses += 1;

		db.add(`${member.guild.id}_${invite.inviter.id}_invite_count`, 1);
		db.set(`${member.guild.id}_${member.id}_inviter`, `${invite.inviter.id}`);

		if (db.get(`${member.guild.id}_log_channel`)) {
			try {
				client.channels.cache.get(db.get(`${member.guild.id}_log_channel`)).send({
					embeds: [new MessageEmbed().setColor("GREEN").setTitle("GİRİŞ").setDescription("Biri sunucuya girdi.").setFooter({
						text: `${client.user.tag}`,
						iconURL: client.user.displayAvatarURL({
							format: "jpg"
						})
					}).addField("Giren kişi", `${member.user.tag}`).addField("Davet eden", `<@!${invite.inviter.id}>`).setTimestamp()]
				});
			} catch (err) {
				console.log(`BU MESAJ KANALA ATILACAKTI AMA HATA ALDIM ! => ${member.guild.name} | ${member.guild.id} sunucusuna ${member.user.username} | ${member.user.id} geldi. Davet eden ${invite.inviter.username} | ${invite.inviter.id}`);
			}
		} else {
			console.log(`${member.guild.name} | ${member.guild.id} sunucusuna ${member.user.username} | ${member.user.id} geldi. Davet eden ${invite.inviter.username} | ${invite.inviter.id}`);
		};


		let inviteCount = db.get(`${member.guild.id}_${invite.inviter.id}_invite_count`);

		if (db.get(`${member.guild.id}_count_${inviteCount}_role`)) {
			let roleName = member.guild.roles.cache.get(db.get(`${member.guild.id}_count_${inviteCount}_role`)).name;

			try {
				member.guild.members.cache.get(`${invite.inviter.id}`).roles.add(db.get(`${member.guild.id}_count_${inviteCount}_role`));
			} catch (err) {
				console.log("Rol verirken bir hata aldım.");
			};

			if (db.get(`${member.guild.id}_log_channel`)) {
				try {
					client.channels.cache.get(db.get(`${member.guild.id}_log_channel`)).send({
						embeds: [new MessageEmbed().setColor("GREEN").setFooter({
							text: `${client.user.tag}`,
							iconURL: client.user.displayAvatarURL({
								format: "jpg"
							})
						}).setTitle("ÖDÜL").setTimestamp().setDescription("Biri ödül rolü aldı ! ").addField("Alan kişi", `<@!${invite.inviter.id}>`).addField("Davet sayısı", `${inviteCount}`).addField("Rol", `${roleName}`)]
					})
				} catch (err) {
					console.log(err);
					console.log(`BU MESAJ KANALA ATIALCAKTI AMA HATA ALDIM ! => ${invite.inviter.username} adlı kişi ${roleName} rolünü aldı.`);
				}
			};
		};
	}
};
