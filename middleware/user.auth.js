import { BadRequestError } from "../error/custom.error.handler.js";
import { verifyToken } from "../utils/services.js";
import * as userServices from "../services/user.services.js";
import { sendResponse } from "../utils/services.js";

export const authentication = async (req, res, next) => {
  try {
    const authorization = req.headers["authorization"];

    if (!authorization) {
      throw new BadRequestError("Please Enter the Token ");
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      throw new BadRequestError("Token is required");
    }

    if (!/Bearer\s+[a-zA-Z0-9-_=]+\.[a-zA-Z0-9-_=]+\.[a-zA-Z0-9-_.+/=]*/) {
      throw new BadRequestError("Invalid token format");
    }

    const decoded = verifyToken(token, process.env.SECRET); //it return Id (rajesh)
    const [userData] = await userServices.getusers({ id: decoded.id });
    if (!userData) {
      throw new BadRequestError("User Not Found");
    }
    req.user = userData;
    next();
  } catch (error) {
    next(error);
  }
};
