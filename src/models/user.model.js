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
		bgImage: {
			public_id: {
				type: String,
				default: '',
			},
			secure_url: {
				type: String,
				default: '',
			},
		},
		fichas: {
			type: Array,
			default: [],
		},
		tokensAbotenidos: {
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
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Users', userSchema);
