import { Router } from "express";
import { divisionXUnidadCurricularController } from "./controller/divisionXUnidadCurricular.controller.js";
import { validateJwt } from "../../core/middlewares/validate-jwt.middleware.js";
import { validateRole } from "../../core/middlewares/validate-role.middleware.js";
import { Role } from "../../core/enums/role.enum.js";

export const divisionXUnidadCurricularRouter = Router();

divisionXUnidadCurricularRouter.get("/", validateJwt, divisionXUnidadCurricularController.getAll);

divisionXUnidadCurricularRouter.get("/:id", validateJwt, divisionXUnidadCurricularController.getById);

divisionXUnidadCurricularRouter.post(
  "/",
  validateJwt,
  validateRole(Role.ADMIN),
  divisionXUnidadCurricularController.create
);

divisionXUnidadCurricularRouter.patch(
  "/:id",
  validateJwt,
  validateRole(Role.ADMIN),
  divisionXUnidadCurricularController.update
);

divisionXUnidadCurricularRouter.delete(
  "/:id",
  validateJwt,
  validateRole(Role.ADMIN),
  divisionXUnidadCurricularController.delete
);
