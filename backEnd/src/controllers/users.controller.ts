import { Request, Response } from "express";
import { User } from "../models/User"
import bcrypt from "bcrypt";

//En este archivo hay metodos relacionados con la administracion de los users CRUD básico

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword, phoneNumber, firstName, middleName, lastName, role } = req.body;

    if (!email || !password || !confirmPassword || !phoneNumber || !firstName || !middleName || !lastName) {
      return res.status(400).json({ message: "Todos los campos obligatorios deben ser proporcionados." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "El correo electrónico no tiene un formato válido." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Las contraseñas no coinciden." });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: "El número telefónico debe tener exactamente 10 dígitos numéricos." });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(409).json({ message: "El correo o número telefónico ya están registrados." });
    }

    const salt = await bcrypt.genSalt(12); // Con la libreria de bcrypt se logra encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, salt); // se genera el salt

    // Crear nuevo usuario
    const newUser = new User({
        firstName,
        middleName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        role: "Default"
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      message: "Usuario creado exitosamente.",
      user: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        middleName: savedUser.middleName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        phoneNumber: savedUser.phoneNumber,
        createDate: savedUser.createDate
      }
    });

  } catch (error: any) {
    console.error("Error al crear usuario:", error.message);
    return res.status(500).json({
      message: "Error interno al crear usuario.",
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const userList = await User.find({ status: true });
    return res.status(200).json({ userList });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email }); // Mi función para buscar por username

        // condición en caso que no exista
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(200).json({ user });// Si se encuentra, devolverlo

    } catch (error) {
        return res.status(500).json({ message: "Error al buscar usuario", error });
    }
};

export const updateDataUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { currentPassword, email, newPassword, phoneNumber, status, role } = req.body;
    const loggedUser = (req as any).user;

    if (!loggedUser) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const isAdmin = loggedUser.role === 'Adm1ni$trad0r';

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // Si no es admin, debe validar su contraseña para cambiar sus propios datos
    if (!isAdmin) {
      if (!currentPassword) return res.status(400).json({ message: "Debes proporcionar la contraseña actual" });
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(401).json({ message: "Contraseña actual incorrecta" });

      // Evitar que usuarios no admin intenten cambiar status o role
      if (status !== undefined || role !== undefined) {
        return res.status(403).json({ message: "Acceso denegado: No tienes permiso para realizar esta acción" });
      }
    }

    // Validación de email
    if (email && email !== user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "El correo electrónico no tiene un formato válido." });
      }
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists.id.toString() !== userId) {
        return res.status(409).json({ message: "El correo ya está registrado." });
      }
      user.email = email;
    }

    // Validación de teléfono
    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({ message: "El número telefónico debe tener exactamente 10 dígitos numéricos." });
      }
      const phoneExists = await User.findOne({ phoneNumber });
      if (phoneExists && phoneExists.id.toString() !== userId) {
        return res.status(409).json({ message: "El teléfono ya está registrado." });
      }
      user.phoneNumber = phoneNumber;
    }

    // Validación de nueva contraseña
    if (newPassword) {
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "La nueva contraseña debe tener al menos 8 caracteres." });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
    }

    // Solo admin puede modificar status y role
    if (isAdmin) {
      if (typeof status === 'boolean') user.status = status;

      const validRoles = ['Adm1ni$trad0r', 'M4ntenim1ent0', 'B0t4nic0', 'Default'];
      if (role) {
        if (!validRoles.includes(role)) {
          return res.status(400).json({ message: "El rol especificado no es válido." });
        }
        user.role = role;
      }
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      message: "Usuario actualizado correctamente.",
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        status: updatedUser.status,
        role: updatedUser.role
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

export const deleteUser = async (req:Request, res:Response) => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user){
        return res.status(404).json({ message: "Usuario no existe" });
    }

    user.status = false;
    user.deleteDate = new Date;

    const deleteUser = await user.save();
    return res.status(201).json({ mesagge:"Usuario dado de baja con exitó", deleteUser });
};