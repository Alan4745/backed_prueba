const bcrypt = require("bcrypt");
const { UploadImg } = require("../utils/cloudinary");
const User = require("../models/user.model");
const jwt = require("../services/jwt");
const fs = require("fs-extra");
const saltRounds = 10;

async function userRegistration(req, res) {
  try {
    // Crear una nueva instancia del modelo de usuario
    const userModel = new User();
    // Obtener los parámetros de la solicitud
    const parameters = req.body;

    // Verificar que los datos requeridos estén presentes
    if (!parameters.email || !parameters.password) {
      return res.status(400).send({ message: "Required data is missing." });
    }

    // Buscar si ya existe un usuario con el mismo correo electrónico
    const userByEmail = await User.find({ email: parameters.email });
    if (userByEmail.length > 0) {
      return res.status(400).send({ message: "This email is already in use." });
    }

    // Buscar si ya existe un usuario con el mismo apodo (nickName)
    const userByNickName = await User.find({
      nickName: `@${parameters.nickName}`,
    });
    if (userByNickName.length > 0) {
      return res
        .status(400)
        .send({ message: "This NickName is already in use." });
    }

    // Si se adjunta una imagen en la solicitud
    if (req.files?.image) {
      // Subir la imagen a Cloudinary y obtener el resultado
      const result = await UploadImg(req.files.image.tempFilePath);
      // Guardar la información de la imagen en el modelo de usuario
      userModel.imageAvatar.public_id = result.public_id;
      userModel.imageAvatar.secure_url = result.secure_url;

      // Verificar si el archivo temporal existe antes de intentar eliminarlo
      if (fs.existsSync(req.files.image.tempFilePath)) {
        await fs.unlink(req.files.image.tempFilePath);
      } else {
        console.warn("El archivo temporal no existe.");
      }
    }

    // Asignar los demás datos al modelo de usuario
    userModel.name = "";
    userModel.nickName = "";
    userModel.email = parameters.email;
    userModel.birthday = parameters.birthday;
    userModel.phone = parameters.phone;
    userModel.verified = false;

    // Hashear la contraseña antes de almacenarla en la base de datos
    const hash = await bcrypt.hash(parameters.password, saltRounds);
    userModel.password = hash;

    // if (parameters.imageAvatar.secure_url !== '') {
    // 	userModel.imageAvatar.public_id = parameters.imageAvatar.public_id;
    // 	userModel.imageAvatar.secure_url = parameters.imageAvatar.secure_url;
    // }

    // if (parameters.imageBanner.secure_url !== '') {
    // 	userModel.imageBanner.public_id = parameters.imageBanner.public_id;
    // 	userModel.imageBanner.secure_url = parameters.imageBanner.secure_url;
    // }

    // Guardar el modelo de usuario en la base de datos
    const userSave = await userModel.save();
    // Verificar si la operación de guardado fue exitosa
    if (!userSave) {
      return res.status(500).send({ message: "Error saving the user." });
    }

    const token = jwt.crearToken(userSave);

    // Enviar una respuesta exitosa con la información del usuario guardado
    return res.status(200).send(
      {
        message: 'Usuario registrado exitosamente.' ,
        token: token,
        user: userSave
      }
    );
  } catch (error) {
    // Capturar y manejar cualquier error que ocurra durante el procesoconsole.error('An error occurred:', error);
    return res.status(500).send({ message: "Internal server error." });
  }
}

async function registerUserByOauth(user) {
  try {
    console.log(user, "datos de perfil del usuario");
    let nameWithoutSpace = user.name.givenName.replace(/\s/g, "");

    const userModel = new User();

    userModel.name = user.name.givenName;
    userModel.nickName = `@${nameWithoutSpace}`;
    userModel.email = user.emails[0].value;
    (userModel.password = ""),
      (userModel.imageAvatar.public_id = user.photos[0].value);
    userModel.imageAvatar.secure_url = user.photos[0].value;

    const userSave = await userModel.save();

    console.log(userSave);

    return userSave;
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function getUserByEmail(email) {
  try {
    const UserFind = await User.findOne({ email: email }).select("-password");
    return UserFind;
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function loginUser(req, res) {
  try {
    // Obtener los datos de la solicitud
    const parameters = req.body;
    // Expresión regular para aceptar "nickNames" de usuarios
    const patron = /^@/;

    // Verificar que los parámetros no estén vacíos
    if (!parameters.crede || !parameters.password) {
      return res.status(400).send({ message: "Missing data in the request." });
    }

    let userFind;

    // Verificar si el parámetro "crede" coincide con el patrón de "nickName"
    if (patron.test(parameters.crede)) {
      // Buscar la información del usuario en la base de datos por "nickName"
      userFind = await User.findOne({ nickName: parameters.crede });
    } else {
      // En caso de que el "crede" no sea un "nickName" (puede ser un correo electrónico)
      userFind = await User.findOne({ email: parameters.crede });
    }

    // Si el usuario no se encuentra
    if (!userFind) {
      return res.status(404).send({ message: "User not found." });
    }

    // Verificar las contraseñas
    const verifiedPassword = await bcrypt.compare(
      parameters.password,
      userFind.password
    );

    // Si la validación de las contraseñas fue exitosa
    if (verifiedPassword) {
      const token = jwt.crearToken(userFind);
      return res.status(200).send({ token, user: userFind });
    }

    // En caso de que la validación de las contraseñas falle
    return res
      .status(401)
      .send({ message: "Email or password does not match." });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).send({ message: "Internal server error." });
  }
}

module.exports = {
  userRegistration,
  loginUser,
  registerUserByOauth,
  getUserByEmail,
};
