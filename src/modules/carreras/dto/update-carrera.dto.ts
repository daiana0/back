import { CreateCarreraDto } from "./create-carrera.dto.js";
import { z } from "zod";

export const UpdateCarreraDto = CreateCarreraDto.partial();
export type UpdateCarreraDto = z.infer<typeof UpdateCarreraDto>;