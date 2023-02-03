/* eslint-disable no-underscore-dangle */
const PostA = require('../../models/post/postTypeAs.model');
const Community = require('../../models/community.model');

async function createPostTypeA(req, res) {
  const modelPostTypeA = new PostA();
  const parameters = req.body;
  const { idCommunity } = req.params;

  const community = await Community.findById(idCommunity);

  console.log(parameters.options.length);
  if (parameters.options.length < 2) {
    return res.status(500).send({ message: 'por lo menos deves de mandar dos opciones' });
  }

  if (!community) {
    return res.status(500).send({ message: 'esta comunidad no te pertenece' });
  }

  modelPostTypeA.communityId = community._id;
  modelPostTypeA.communityName = community.nameCommunity;
  modelPostTypeA.question = parameters.question;
  modelPostTypeA.options = parameters.options;

  modelPostTypeA.save((err, saveModel) => {
    if (err) {
      return res.status(500).send({ err: 'error en la peticion' });
    }
    if (!saveModel) {
      return res.status(500).send({ err: 'error al peticion viene vacio' });
    }

    return res.status(200).send({ message: saveModel });
  });
}

async function responderEncuesta(req, res) {
  const parameters = req.body;
  const { idEncuesta } = req.params;

  const encuesta = await PostA.findById(idEncuesta);
  const userReponse = await encuesta.answers.find((element) =>
    element.idUser === req.user.sub && element.answer === parameters.answer);
  console.log(userReponse);

  if (userReponse) {
    return res.status(500).send({ err: 'ya respondites esta repuesta' });
  }

  PostA.findByIdAndUpdate(idEncuesta, {
    $push: {
      answers: {
        idUser: req.user.sub,
        answer: parameters.answer
      }
    },
  }, { new: true }, (err, postAUpdate) => {
    if (err) {
      return res.status(500).send({ err: 'error en la peticion de responder Encuesata' });
    }
    if (!postAUpdate) {
      return res.status(500).send({ err: 'error de responder Encuesata' });
    }
    return res.status(200).send({ message: postAUpdate });
  });

  // return res.status(200).send({ message: encuesta });
}
module.exports = {
  createPostTypeA,
  responderEncuesta
};
