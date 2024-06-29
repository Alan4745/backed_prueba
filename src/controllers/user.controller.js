const User = require("../models/user.model");
const { UploadImg } = require("../utils/cloudinary");
const fs = require("fs-extra");
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function updateUser(req, res) {
  try {
    const { idUser } = req.params;
    const parameters = req.body;

    // Eliminando la entrada de los siguientes parámetros
    delete parameters.password;
    delete parameters.rol;
    delete parameters.email;

    // Verificamos si el usuario le pertenece al perfil
    if (req.user.sub !== idUser) {
      return res
        .status(403)
        .send({ mensaje: "No tiene los permisos para editar este usuario." });
    }

    // Actualizar el usuario y obtener el resultado actualizado
    const userUpdate = await User.findByIdAndUpdate(idUser, parameters, {
      new: true,
    });

    // Verificar si la actualización fue exitosa
    if (!userUpdate) {
      return res.status(500).send({ message: "Error al editar el usuario." });
    }

    // Enviar la información actualizada del usuario
    return res.status(200).send({ message: userUpdate });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).send({ message: "Internal server error." });
  }
}

async function updatePasswordUser(req, res) {
  try {
    const { idUser } = req.params;
    const password = req.body.password;

    // Verificamos si el usuario le pertenece al perfil
    if (req.user.sub !== idUser) {
      return res.status(403).send({ mensaje: "No tiene los permisos para editar este usuario." });
    }

    // Se obtiene la contraseña para parsearla
    const hash = await bcrypt.hash(password, saltRounds);

    // Actualizar el usuario y obtener el resultado actualizado
    const userUpdate = await User.findByIdAndUpdate(
      idUser, 
      {password: hash}, 
      {new: true}
    );

    // Verificar si la actualización fue exitosa
    if (!userUpdate) {
      return res.status(500).send({ message: "Error al editar el usuario." });
    }

    // Enviar la información actualizada del usuario
    return res.status(200).send({ message: userUpdate });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).send({ message: "Internal server error." });
  }
}

async function deleteUser(req, res) {
  try {
    const { idUser } = req.params;

    // Verificar si el usuario tiene los permisos para eliminar este usuario
    if (req.user.sub !== idUser) {
      return res
        .status(403)
        .send({ mensaje: "No tiene los permisos para eliminar este usuario." });
    }

    // Eliminar el usuario y obtener el resultado eliminado
    const userDelete = await User.findByIdAndDelete(idUser);

    // Verificar si la eliminación fue exitosa
    if (!userDelete) {
      return res.status(500).send({ message: "Error al eliminar el usuario." });
    }

    // Enviar la información del usuario eliminado
    return res.status(200).send({ message: "Usuario eliminado." });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).send({ message: "Internal server error." });
  }
}

async function viewUser(req, res) {
  try {
    const usersView = await User.find().exec();
    res.status(200).send({ UserInfo: usersView });
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    res.status(500).send({ error: "Hubo un error al buscar usuarios" });
  }
}

const updateProfileStep1 = async (req, res) => {
  const { idUser } = req.params;
  const { name, nickName, birthday } = req.body;

  try {
    // Verifica que todos los campos necesarios estén presentes en el cuerpo de la solicitud
    if (!name || !nickName || !birthday) {
      return res
        .status(400)
        .json({ message: "Todos los campos son requeridos" });
    }

    // Actualiza el usuario en la base de datos
    const user = await User.findByIdAndUpdate(
      idUser,
      { name, nickName, birthday },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res
      .status(200)
      .json({ message: "Usuario actualizado correctamente", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando el usuario" });
  }
};

async function updateProfileStep2(req, res) {
  try {
    const { idUser } = req.params; // Extraer el ID del usuario desde los parámetros de la ruta
    const { bio, sex } = req.body;
    console.log(idUser);
    // Encontrar el usuario en la base de datos
    const user = await User.findById(idUser);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar bio y sexo
    user.bio = bio;
    user.sex = sex;

    // Subir y actualizar la imagen de avatar si existe
    if (req.files?.profileImage) {
      const profileImageResult = await UploadImg(
        req.files.profileImage.tempFilePath
      );
      user.imageAvatar = {
        public_id: profileImageResult.public_id,
        secure_url: profileImageResult.secure_url,
      };

      if (fs.existsSync(req.files.profileImage.tempFilePath)) {
        await fs.unlink(req.files.profileImage.tempFilePath);
      } else {
        console.warn("El archivo temporal de avatar no existe.");
      }
    }

    // Subir y actualizar la imagen de banner si existe
    if (req.files?.bannerImage) {
      const bannerImageResult = await UploadImg(
        req.files.bannerImage.tempFilePath
      );
      user.imageBanner = {
        public_id: bannerImageResult.public_id,
        secure_url: bannerImageResult.secure_url,
      };

      if (fs.existsSync(req.files.bannerImage.tempFilePath)) {
        await fs.unlink(req.files.bannerImage.tempFilePath);
      } else {
        console.warn("El archivo temporal de banner no existe.");
      }
    }

    // Guardar los cambios en la base de datos
    await user.save();

    return res
      .status(200)
      .json({ message: "Perfil actualizado correctamente", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error actualizando el perfil" });
  }
}
async function getRandomUsers(req, res) {
  try {
    const currentUserID = req.user.sub; // Suponiendo que currentUser es el usuario actual

    // Obtener 100 usuarios aleatorios excluyendo al usuario actual
    const users = await User.aggregate([
      { $match: { _id: { $ne: currentUserID } } }, // Excluir al usuario actual
      { $sample: { size: 100 } }, // Obtener 100 usuarios aleatorios
    ]);

    return res.status(200).send({ message: users });
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    res.status(500).send({ error: "Hubo un error al buscar usuarios" });
  }
}

async function userFindId(req, res) {
  try {
    let findUser = await User.findOne({ _id: req.user.sub });
    res.status(200).send({ message: findUser });
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    res.status(500).send({ error: "Hubo un error al buscar usuarios" });
  }
}

async function userByFindId(req, res) {
  const { idUser } = req.params;
  console.log(idUser);

  try {
    let findUser = await User.findOne({ _id: idUser });
    res.status(200).send({ message: findUser });
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    res.status(500).send({ error: "Hubo un error al buscar usuarios" });
  }
}

function FollowAUser(req, res) {
  const { idUser } = req.params;
  User.findOne({ _id: idUser }, (err, UserOne) => {
    const userInclud = UserOne.followers.includes(req.user.sub);
    if (userInclud) {
      User.findByIdAndUpdate(
        { _id: idUser },
        { $pull: { followers: req.user.sub } },
        { new: true },
        (err, user1) => {
          if (err) {
            return res.status(500).send({ err: "error en la peticion" });
          }
          if (!user1) {
            return res.status(500).send({ err: "error en communityFollowers" });
          }
          // return res.status(200).send({ message: communityFollowers });

          User.findByIdAndUpdate(
            { _id: req.user.sub },
            { $pull: { following: idUser } },
            { new: true },
            (err, user2) => {
              if (err) {
                return res.status(500).send({ err: "error en la peticion" });
              }
              if (!user2) {
                return res
                  .status(500)
                  .send({ err: "error en communityFollowers" });
              }
              return res.status(200).send({ message: user1 });
            }
          );
        }
      );
    } else {
      User.findByIdAndUpdate(
        { _id: idUser },
        { $push: { followers: req.user.sub } },
        { new: true },
        (err, user1) => {
          if (err) {
            return res.status(500).send({ err: "error en la peticion" });
          }
          if (!user1) {
            return res.status(500).send({ err: "error en communityFollowers" });
          }
          // return res.status(200).send({ message: user1 });
          User.findByIdAndUpdate(
            { _id: req.user.sub },
            { $push: { following: idUser } },
            { new: true },
            (err, user2) => {
              if (err) {
                return res.status(500).send({ err: "error en la peticion" });
              }
              if (!user2) {
                return res
                  .status(500)
                  .send({ err: "error en communityFollowers" });
              }
              return res.status(200).send({ message: user1 });
            }
          );
        }
      );
    }
  });
}

async function UserIFollow(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId, { password: 0 }); // Proyectamos todos los campos excepto 'password'
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }
    const followingIds = user.following; // Array de IDs de los usuarios seguidos por el usuario
    const followingUsers = await User.find(
      { _id: { $in: followingIds } },
      { password: 0 }
    ); // Excluimos 'password'
    return res.status(200).send({ message: followingUsers });
  } catch (error) {
    console.error("Error al obtener usuarios seguidos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

const GetUserTrends = async (req, res) => {
  try {
    console.log("estamos aquí");

    // Obtener el ID del usuario actual
    const usuarioId = req.user.sub; // Suponiendo que req.user contiene la información del usuario

    // Obtener las comunidades tendencia excluyendo al usuario actual
    const tendencias = await User.find({ followers: { $ne: usuarioId } }) // $ne: "not equal"
      .sort({ followers: -1 })
      .limit(10);

    // Verificar si se encontraron comunidades tendencia
    if (tendencias.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron comunidades tendencia" });
    }

    // Devolver las comunidades tendencia
    res.status(200).send({ message: tendencias });
  } catch (error) {
    console.error("Error al obtener las tendencias de las comunidades:", error);
    res.status(500).json({
      message:
        "Error del servidor al obtener las tendencias de las comunidades",
    });
  }
};

const RecommendUsersByCategories = async (req, res) => {
  try {
    // Obtener el ID del usuario actual (suponiendo que está autenticado)
    const userId = req.user.sub;

    // Obtener los gustos o categorías del usuario
    const usuario = await user.findById(userId);
    const categoriasUsuario = usuario.gustos;

    // Buscar comunidades que coincidan con al menos una de las categorías del usuario
    const comunidadesRecomendadas = await community
      .find({ categories: { $in: categoriasUsuario } })
      .limit(10);

    // Verificar si se encontraron comunidades recomendadas
    if (comunidadesRecomendadas.length === 0) {
      return res.status(404).json({
        message:
          "No se encontraron comunidades recomendadas para estas categorías",
      });
    }

    // Devolver las comunidades recomendadas
    res.status(200).send({ message: comunidadesRecomendadas });
  } catch (error) {
    console.error("Error al recomendar comunidades por categorías:", error);
    res.status(500).json({
      message: "Error del servidor al recomendar comunidades por categorías",
    });
  }
};

const GetUserByCategory = async (req, res) => {
  try {
    // Obtener las categorías de interés desde la solicitud (por ejemplo, desde el query params)
    const categorias = req.params.categorias.split(",");

    console.log(categorias);

    // Verificar si se proporcionaron categorías en la solicitud
    if (!categorias || categorias.length === 0) {
      return res.status(400).send({
        message: "Se deben proporcionar categorías para realizar la búsqueda",
      });
    }

    // Buscar comunidades que tengan las categorías especificadas
    const comunidadesPorCategoria = await User.find({
      gustos: { $in: categorias },
    }).limit(10);

    // Verificar si se encontraron comunidades con las categorías especificadas
    if (comunidadesPorCategoria.length === 0) {
      return res.status(404).send({
        message:
          "No se encontraron comunidades para las categorías especificadas",
      });
    }

    // Devolver las comunidades encontradas
    res.status(200).send({ message: comunidadesPorCategoria });
  } catch (error) {
    console.error("Error al obtener comunidades por categoría:", error);
    res.status(500).json({
      message: "Error del servidor al obtener comunidades por categoría",
    });
  }
};

async function findUserRegex(req, res) {
  const { name } = req.params;

  console.log(name);

  try {
    // Utilizamos una expresión regular para buscar nombres similares o coincidentes
    const communities = await User.find({
      name: { $regex: name, $options: "i" },
    })
      .limit(10) // Limitamos los resultados a 10 comunidades
      .exec();

    res.status(200).send({ message: communities });
  } catch (error) {
    console.error("Error al buscar comunidades:", error);
    res.status(500).json({ message: "Error al buscar comunidades" });
  }
}

module.exports = {
  updateUser,
  updatePasswordUser,
  deleteUser,
  viewUser,
  userFindId,
  userByFindId,
  FollowAUser,
  GetUserTrends,
  findUserRegex,
  getRandomUsers,
  UserIFollow,
  updateProfileStep1,
  updateProfileStep2,
};
