import httpStatus from "http-status";
import { login as loginSvc } from "../services/auth.service.js";

export const loginHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await loginSvc(email, password);
    res.status(httpStatus.OK).json(data);
  } catch (e) {
    next(e);
  }
};