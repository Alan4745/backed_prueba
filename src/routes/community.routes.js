/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
const express = require('express');

const api = express.Router();

const controllerCommunity = require('../controllers/community.controller');
const md_autenticacion = require('../middlewares/authentication');
const md_roles = require('../middlewares/userAdminCommunity');
// metodos post
api.post('/saveCommunity', [md_autenticacion.Auth], controllerCommunity.registerCommunity);

// metodos put
api.put('/editCommunity/:idCommuunity', [md_autenticacion.Auth], controllerCommunity.editarCommunida);
api.put('/editarCategory/:idCommuunity', [md_autenticacion.Auth], controllerCommunity.editarCategoryCommunidad);
api.put('/deleteCategory/:idCommuunity', [md_autenticacion.Auth], controllerCommunity.deleteCategory);
api.put('/communityFollowers/:idCommuunity', [md_autenticacion.Auth], controllerCommunity.followersCommunity);
api.put('/addUserAdmin/:idCommuunity', [md_autenticacion.Auth, md_roles.ownerCommunity], controllerCommunity.addAdmin);
api.put('/deleteUserAdmin/:idCommuunity', [md_autenticacion.Auth, md_roles.ownerCommunity], controllerCommunity.deleteAdmin);
// metodos delete
api.delete('/deleteCommunity/:idCommuunity', [md_autenticacion.Auth, md_roles.ownerCommunity], controllerCommunity.deleteCommunity);
// metodos get
api.get('/getCommunityId/:idCommuunity', [md_autenticacion.Auth, md_roles.AdminComunity], controllerCommunity.viewCommunityId);
api.get('/followersView/:idCommuunity', [md_autenticacion.Auth], controllerCommunity.followersView);

module.exports = api;
