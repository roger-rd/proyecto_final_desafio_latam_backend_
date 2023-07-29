import bcrypt from "bcryptjs";
import { handleErrors } from "../database/error.js";
import { userModel } from "../user/user.model.js";

export const verifyTokenUser = async (req, res, next) => {
    const { correo, password } = req.body;
    try {
        if (!correo || !password) {
            throw { code: "403" };
        }

        const result = await userModel.loginUser(correo);
        if (!result.rowCount) {
            throw { code: "error en correo" };
        }

        const userDB = result.rows[0]; // El primer usuario encontrado
        const validatePassword = await bcrypt.compare(password, userDB.password);
        if (!validatePassword) {
            throw { code: "error de contraseña" };
        }

        console.log("Usuario autenticado con éxito: ", userDB.correo)
        // req.correo = payload.correo;
       
        next() 


    } catch (error) {
        const { status, message } = handleErrors(error.code)
        console.log(error, message)
        return res.status(status).json({ ok: false, result: message });
    }
}
