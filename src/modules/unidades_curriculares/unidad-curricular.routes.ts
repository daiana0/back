import { Router } from "express";
import { unidadCurricularController } from "./controller/unidad-curricular.controller.js";
import { validateJwt } from "../../core/middlewares/validate-jwt.middleware.js";
import { validateRole } from "../../core/middlewares/validate-role.middleware.js";
import { Role } from "../../core/enums/role.enum.js";

export const unidadCurricularRouter = Router();

unidadCurricularRouter.get("/", validateJwt, unidadCurricularController.getAll);
unidadCurricularRouter.get("/:id", validateJwt, unidadCurricularController.getById);
unidadCurricularRouter.post("/", validateJwt, validateRole(Role.ADMIN), unidadCurricularController.create);
unidadCurricularRouter.patch("/:id", validateJwt, validateRole(Role.ADMIN), unidadCurricularController.update);
unidadCurricularRouter.delete("/:id", validateJwt, validateRole(Role.ADMIN), unidadCurricularController.delete);