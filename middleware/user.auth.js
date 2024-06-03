import { BadRequestError } from "../error/custom.error.handler.js";
import { verifyToken, sendResponse } from "../utils/services.js";
import * as userServices from "../services/user.services.js";

export const authentication = async (req, res, next) => {
  try {
    const authorization = req.headers["authorization"];

    if (!authorization) {
      throw new BadRequestError(
        "Authorization header missing. Please provide a token."
      );
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      throw new BadRequestError("Token missing. Please provide a token.");
    }

    const tokenFormat =
      /^Bearer\s[a-zA-Z0-9-_=]+\.[a-zA-Z0-9-_=]+\.[a-zA-Z0-9-_.+/=]*$/;
    if (!tokenFormat.test(authorization)) {
      throw new BadRequestError(
        "Invalid token format. Correct format: 'Bearer <token>'"
      );
    }

    const decoded = verifyToken(token, process.env.SECRET);
    if (!decoded) {
      throw new BadRequestError(
        "Token verification failed. Please provide a valid token."
      );
    }

    const userData = await userServices.getusers({ id: decoded.id });
    if (!userData || userData.length === 0) {
      throw new BadRequestError("User not found. Please log in again.");
    }

    req.user = userData[0];
    next();
  } catch (error) {
    next(error);
  }
};
