import { Router } from "express";
import { planEstudioController } from "./controller/plan-estudio.controller.js";
import { validateJwt } from "../../core/middlewares/validate-jwt.middleware.js";
import { validateRole } from "../../core/middlewares/validate-role.middleware.js";
import { Role } from "../../core/enums/role.enum.js";

export const planEstudioRouter = Router();

// Lectura: cualquier autenticado
planEstudioRouter.get("/", validateJwt, planEstudioController.getAll);
planEstudioRouter.get("/:id", validateJwt, planEstudioController.getById);

// Escritura: solo ADMIN
planEstudioRouter.post("/", validateJwt, validateRole(Role.ADMIN), planEstudioController.create);
planEstudioRouter.patch("/:id", validateJwt, validateRole(Role.ADMIN), planEstudioController.update);
planEstudioRouter.delete("/:id", validateJwt, validateRole(Role.ADMIN), planEstudioController.delete);