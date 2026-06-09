import { Router } from "express";
import { divisionController } from "./controller/division.controller.js";
import { validateJwt } from "../../core/middlewares/validate-jwt.middleware.js";
import { validateRole } from "../../core/middlewares/validate-role.middleware.js";
import { Role } from "../../core/enums/role.enum.js";

export const divisionRouter = Router();

divisionRouter.get("/", validateJwt, divisionController.getAll);

divisionRouter.get("/:id", validateJwt, divisionController.getById);

divisionRouter.post(
  "/",
  validateJwt,
  validateRole(Role.ADMIN),
  divisionController.create
);

divisionRouter.patch(
  "/:id",
  validateJwt,
  validateRole(Role.ADMIN),
  divisionController.update
);

divisionRouter.delete(
  "/:id",
  validateJwt,
  validateRole(Role.ADMIN),
  divisionController.delete
);
