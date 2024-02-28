const express = require('express');

const api = express.Router();

const controllerCommunity = require('../controllers/community.controller');
const md_autenticacion = require('../middlewares/authentication');
const md_roles = require('../middlewares/userAdminCommunity');
const verificadoController = require('../controllers/Plan_premium/premium.controller');

// metodos get
api.get(
	'/getCommunityId/:idCommunity',
	[md_autenticacion.Auth],
	controllerCommunity.viewCommunityId
); // metodo actualizado 🆗
api.get(
	'/followersView/:idCommunity',
	[md_autenticacion.Auth],
	controllerCommunity.followersView
); // metodos actualizados 🆗
api.get(
	'/youCommuunity',
	[md_autenticacion.Auth],
	controllerCommunity.youCommunity
); // metodos actualizados 🆗
api.get(
	'/comunidades',
	[md_autenticacion.Auth],
	controllerCommunity.obtenercomunidades
); // metodos actualizados

api.get(
	'/comunidadestendencias',
	[md_autenticacion.Auth],
	controllerCommunity.obtenerTendenciasComunidades
);

api.get(
	'/comunidadesRecomendadas',
	[md_autenticacion.Auth],
	controllerCommunity.recomendarComunidadesPorCategorias
);

api.get(
	'/comunidadesPorCategorias/:categorias',
	[md_autenticacion.Auth],
	controllerCommunity.obtenerComunidadesPorCategoria
);

//VERIFICACION DE PAGO PREMIUM
api.put(
	'/premiumstatus/:verificado',
	[md_autenticacion.Auth],
	verificadoController.verificacion
);
// metodos post
api.post(
	'/saveCommunity',
	[md_autenticacion.Auth],
	controllerCommunity.registerCommunity
);

// metodos put
api.put(
	'/editCommunity/:idCommunity',
	[md_autenticacion.Auth],
	controllerCommunity.editarCommunida
);
api.put(
	'/editarCategory/:idCommunity',
	[md_autenticacion.Auth],
	controllerCommunity.editarCategoryCommunidad
);
api.put(
	'/deleteCategory/:idCommunity',
	[md_autenticacion.Auth],
	controllerCommunity.deleteCategory
);
api.put(
	'/communityFollowers/:idCommunity',
	[md_autenticacion.Auth],
	controllerCommunity.followersCommunity
);
api.put(
	'/addUserAdmin/:idCommunity',
	[md_autenticacion.Auth, md_roles.ownerCommunity],
	controllerCommunity.addAdmin
);
api.put(
	'/deleteUserAdmin/:idCommunity',
	[md_autenticacion.Auth, md_roles.ownerCommunity],
	controllerCommunity.deleteAdmin
);
// metodos delete
api.delete(
	'/deleteCommunity/:idCommunity',
	[md_autenticacion.Auth, md_roles.ownerCommunity],
	controllerCommunity.deleteCommunity
);

module.exports = api;
