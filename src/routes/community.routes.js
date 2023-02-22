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

module.exports = api;
