import { userServices } from "../services/index.js";
import { sendResponse } from "../utils/services.js";
import {
  BadRequestError,
  NotFoundError,
} from "../error/custom.error.handler.js";
import { getJwtToken } from "../utils/services.js";

export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const [existingEmail] = await userServices.getusers(
      { email: email },
      "and"
    );

    if (existingEmail) {
      throw new BadRequestError("User with this email already exists");
    }

    const newUser = await userServices.insertuser(username, email, password);

    return sendResponse(res, 200, "User created successfully", newUser);
  } catch (error) {
    next(error);
  }
};

export const getAllUser = async (req, res, next) => {
  try {
    const users = await userServices.getusers();
    if (!users) {
      throw new NotFoundError("User list not found");
    }
    return sendResponse(res, 200, "User list retrieved successfully", users);
  } catch (error) {
    next(error);
  }
};

export const editUser = async (req, res, next) => {
  try {
    const findUser = await userServices.getusers({ id: req.params.id }, "and");
    if (!findUser || findUser.length == 0) {
      throw new NotFoundError("User not found");
    }

    return sendResponse(
      res,
      200,
      "User details retrieved successfully",
      findUser
    );
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const checkUserId = await userServices.getusers(
      { id: req.params.id },
      "and"
    );
    if (!checkUserId.length) {
      throw new NotFoundError("User not found");
    }
    const [userExists] = await userServices.userExistsCheck(
      {
        username: req.body.username,
      },
      req.params.id
    );

    if (userExists) {
      throw new BadRequestError("Username already exists");
    }

    const [emailExists] = await userServices.userExistsCheck(
      { email: req.body.email },
      req.params.id,
      "and"
    );

    if (emailExists) {
      throw new BadRequestError("Email already exists");
    }

    const updatedUserMessage = await userServices.updateuser(
      { id: req.params.id },
      req.body,
      "and"
    );

    return sendResponse(res, 200, "User updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const checkUser = await userServices.getusers({ id: req.params.id }, "and");
    if (!checkUser || checkUser.length == 0) {
      throw new NotFoundError("User not found");
    }

    const deletedUser = await userServices.updateuser(
      { id: req.params.id },
      { isDeleted: true },
      "and"
    );

    return sendResponse(res, 200, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [checkUser] = await userServices.getusers(
      {
        email: req.body.email,
      },
      "and"
    );

    if (!checkUser) {
      throw new BadRequestError("Email Not found");
    }

    if (checkUser.password !== password) {
      throw new BadRequestError("Invalid Password");
    }

    const token = await getJwtToken(checkUser.id, process.env.SECRET, "5d");

    return sendResponse(res, 200, "Login run", token);
  } catch (error) {
    next(error);
  }
};
