const express = require('express');

const api = express.Router();

const controllerCommunity = require('../controllers/community.controller');
const md_autenticacion = require('../middlewares/authentication');
const md_roles = require('../middlewares/userAdminCommunity');

const verificadoController= require('../controllers/Plan_premium/premium.controller');
//VERIFICACION DE PAGO PREMIUM 
api.put('/premiumstatus/:verificado',[md_autenticacion.Auth],verificadoController.verificacion);
// metodos post
api.post('/saveCommunity', [md_autenticacion.Auth], controllerCommunity.registerCommunity);

// metodos put
api.put('/editCommunity/:idCommunity', [md_autenticacion.Auth], controllerCommunity.editarCommunida);
api.put('/editarCategory/:idCommunity', [md_autenticacion.Auth], controllerCommunity.editarCategoryCommunidad);
api.put('/deleteCategory/:idCommunity', [md_autenticacion.Auth], controllerCommunity.deleteCategory);
api.put('/communityFollowers/:idCommunity', [md_autenticacion.Auth], controllerCommunity.followersCommunity);
api.put('/addUserAdmin/:idCommunity', [md_autenticacion.Auth, md_roles.ownerCommunity], controllerCommunity.addAdmin);
api.put('/deleteUserAdmin/:idCommunity', [md_autenticacion.Auth, md_roles.ownerCommunity], controllerCommunity.deleteAdmin);
// metodos delete
api.delete('/deleteCommunity/:idCommunity', [md_autenticacion.Auth, md_roles.ownerCommunity], controllerCommunity.deleteCommunity);
// metodos get
api.get('/getCommunityId/:idCommunity', [md_autenticacion.Auth, md_roles.AdminComunity], controllerCommunity.viewCommunityId);
api.get('/followersView/:idCommunity', [md_autenticacion.Auth], controllerCommunity.followersView);
api.get('/youCommuunity', [md_autenticacion.Auth], controllerCommunity.youCommunity);
api.get('/comunidades', [md_autenticacion.Auth], controllerCommunity.obtenercomunidades);


module.exports = api;
