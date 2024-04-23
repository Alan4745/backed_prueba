const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
	{
		name: {
			type: String,
			require: true,
		},
		nickName: {
			type: String,
			require: true,
		},
		email: {
			type: String,
			require: true,
		},
		password: {
			type: String,
			require: true,
		},
		bio: {
			type: String,
			require: true,
		},
		imageAvatar: {
			public_id: {
				type: String,
				default: '',
			},
			secure_url: {
				type: String,
				default: '',
			},
		},
		imageBanner: {
			public_id: {
				type: String,
				default: '',
			},
			secure_url: {
				type: String,
				default: '',
			},
		},
		ticketsObtained: {
			type: Array,
			default: [],
		},
		rol: {
			type: String,
			default: 'dimensionUser',
		},
		gustos: { // Nuevo campo para los gustos o categorías
			type: [String], // Se espera un array de cadenas
			default: [], // Por defecto, el usuario no tiene gustos definidos
		},
		birthday: {
			type: String,
			require: false,
		},
		sex: {
			type: String,
		},
		place: {
			type: String,
		},
		socialMedia: {
			Facebook: {
				link: {
					type: String,
					default: 'https://www.facebook.com',
				},
				username: {
					type: String,
					default: '',
				}
			},
			Instagram: {
				link: {
					type: String,
					default: 'https://www.instagram.com',
				},
				username: {
					type: String,
					default: '',
				}
			},
			Twitch: {
				link: {
					type: String,
					default: 'https://www.twitch.tv',
				},
				username: {
					type: String,
					default: '',
				}
			},
			Twitter: {
				link: {
					type: String,
					default: 'https://www.Twitter.com',
				},
				username: {
					type: String,
					default: '',
				}
			},
			Tiktok: {
				link: {
					type: String,
					default: 'https://www.tiktok.com/',
				},
				username: {
					type: String,
					default: '',
				}
			},
			Youtube: {
				link: {
					type: String,
					default: 'https://www.youtube.com/channel/',
				},
				username: {
					type: String,
					default: '',
				}
			},
		},
		following: {
			type: [String],
			default: [],
		},
		followers: {
			type: [String],
			default: [],
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Users', userSchema);
