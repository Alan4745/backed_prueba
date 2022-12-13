/* eslint-disable no-shadow */
/* eslint-disable linebreak-style */
/* eslint-disable import/no-self-import */
/* eslint-disable consistent-return */
/* eslint-disable linebreak-style */
const Post = require('../models/Post.model');

function SavePost(req, res) {
  const PostModule = new Post();
  const parameters = req.body;

  PostModule.userId = req.user.sub;
  PostModule.title = parameters.title;
  PostModule.desc = parameters.desc;
  PostModule.img = parameters.img;

  console.log(parameters.img);

  console.log(req.user.sub, parameters.title, parameters.desc);

  PostModule.save((err, savePost) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ err: 'err en la peticion' });
    }

    if (!savePost) {
      return res.status(500).send({ err: 'err al subir el post' });
    }

    return res.status(200).send({ savePost });
  });
}

function likesUpdate(req, res) {
  const { idPost } = req.params;

  Post.findById(idPost, (err, userlike) => {
    if (err) {
      return res.status(500).send({ err: 'error en la peticion' });
    }

    if (!userlike) {
      return res.status(500).send({ err });
    }

    const likeUser = userlike.likes.filter((like) => like === req.user.sub);

    console.log(likeUser);
    if (likeUser.length > 0) {
      Post.findByIdAndUpdate(
        idPost,
        { $pull: { likes: req.user.sub } },
        { new: true },
        (err, disLike) => {
          if (err) {
            return res.status(500).send({ err: 'error en la peticion' });
          }
          if (!disLike) {
            return res.status(500).send({ err: 'Error en la deslike' });
          }
          return res.status(200).send({ mesage: disLike });
        },
      );
    } else {
      Post.findByIdAndUpdate(
        idPost,
        { $push: { likes: req.user.sub } },
        { new: true },
        (err, postLike) => {
          if (err) {
            return res.status(500).send({ err: 'error en la peticion' });
          }

          if (!postLike) {
            return res.status(500).send({ err: 'error al actualizar el like de post' });
          }

          return res.status(200).send({ mesage: postLike });
        },
      );
    }
  });
}

function commentsUser(req, res) {
  const { idPost } = req.params;
  const parameters = req.body;
  Post.findByIdAndUpdate(idPost, {
    $push: {
      comentarios:
        { idUser: req.user.sub, comments: parameters.comments },
    },
  }, { new: true }, (err, commentUser) => {
    if (err) {
      return res.status(500).send({ err: 'error en la peticion' });
    }
    if (!commentUser) {
      return res.status(500).send({ err: 'error al enviar el comentario' });
    }

    return res.status(200).send({ mesage: commentUser });
  });
}

function ViewPost(req, res) {
  Post.find((err, postView) => {
    if (err) {
      res.status(500).send({ err: 'error en la peticion' });
    }
    if (!postView) {
      res.status(500).send({ err: 'error al ver la Post' });
    }

    return res.status(200).send({ postView });
  });
}

module.exports = {
  SavePost,
  ViewPost,
  likesUpdate,
  commentsUser,
};
