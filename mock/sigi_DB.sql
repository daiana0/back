-- MySQL dump 10.13  Distrib 8.0.26, for Win64 (x86_64)
--
-- Host: localhost    Database: sigi_db
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administrativos`
--

DROP TABLE IF EXISTS `administrativos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrativos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `contrasenia` varchar(100) NOT NULL,
  `telefono` varchar(30) NOT NULL,
  `domicilio` varchar(200) NOT NULL,
  `id_rol` int NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `dni` (`dni`),
  UNIQUE KEY `administrativos_email` (`email`),
  UNIQUE KEY `administrativos_dni` (`dni`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `administrativos_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrativos`
--

LOCK TABLES `administrativos` WRITE;
/*!40000 ALTER TABLE `administrativos` DISABLE KEYS */;
INSERT INTO `administrativos` VALUES (1,'María','Gómez','maria.gomez@instituto.edu','20123456','$2b$10$6KOizamch8SaX09I1OeDZunloySvdpUoSWY08rxqMyZt8R2PYUloK','351-1111111','Calle 1 N° 100',1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,'Carlos','Pérez','carlos.perez@instituto.edu','20765432','$2b$10$58nXNth74gg7JTwLAb5fHOlvJDf0Ab6LOuyI6kVEFySV1SJPGIWV.','351-2222222','Av. Siempre Viva 742',2,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(3,'Laura','Fernández','laura.fernandez@instituto.edu','20876543','$2b$10$XGiNeq7mQPBfEbZfCbRCoeHYbVT4voCnTxGGRRkZlt9s2OCQC0E/e','351-3333333','Calle 3 N° 300',3,1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `administrativos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asistencias`
--

DROP TABLE IF EXISTS `asistencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistencias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_division_x_unidad_curricular` int NOT NULL,
  `fecha` date NOT NULL,
  `presente` tinyint(1) DEFAULT '0',
  `id_legajo` int NOT NULL,
  `id_administrativo` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `un_asistencia_alumno_div_fecha` (`id_division_x_unidad_curricular`,`fecha`,`id_legajo`),
  KEY `id_legajo` (`id_legajo`),
  KEY `id_administrativo` (`id_administrativo`),
  CONSTRAINT `asistencias_ibfk_4` FOREIGN KEY (`id_division_x_unidad_curricular`) REFERENCES `divisiones_x_unidades_curriculares` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencias_ibfk_5` FOREIGN KEY (`id_legajo`) REFERENCES `legajos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `asistencias_ibfk_6` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistencias`
--

LOCK TABLES `asistencias` WRITE;
/*!40000 ALTER TABLE `asistencias` DISABLE KEYS */;
INSERT INTO `asistencias` VALUES (1,1,'2025-04-01',1,1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,3,'2025-04-01',0,2,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(3,2,'2025-04-02',1,1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(4,3,'2025-04-03',1,2,1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `asistencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cambios_planes_estudios`
--

DROP TABLE IF EXISTS `cambios_planes_estudios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cambios_planes_estudios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_legajo` int NOT NULL,
  `id_plan_estudio_origen` int NOT NULL,
  `id_plan_estudio_destino` int NOT NULL,
  `id_usuario_gestor` int DEFAULT NULL,
  `fecha_solicitud` date NOT NULL,
  `fecha_aprobacion` date DEFAULT NULL,
  `plazo_vencimiento` date DEFAULT NULL,
  `estado` enum('PENDIENTE','APROBADO','RECHAZADO') DEFAULT 'PENDIENTE',
  `observaciones` text,
  `id_administrativo` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_legajo` (`id_legajo`),
  KEY `id_plan_estudio_origen` (`id_plan_estudio_origen`),
  KEY `id_plan_estudio_destino` (`id_plan_estudio_destino`),
  KEY `id_administrativo` (`id_administrativo`),
  CONSTRAINT `cambios_planes_estudios_ibfk_5` FOREIGN KEY (`id_legajo`) REFERENCES `legajos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `cambios_planes_estudios_ibfk_6` FOREIGN KEY (`id_plan_estudio_origen`) REFERENCES `planes_estudios` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `cambios_planes_estudios_ibfk_7` FOREIGN KEY (`id_plan_estudio_destino`) REFERENCES `planes_estudios` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `cambios_planes_estudios_ibfk_8` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cambios_planes_estudios`
--

LOCK TABLES `cambios_planes_estudios` WRITE;
/*!40000 ALTER TABLE `cambios_planes_estudios` DISABLE KEYS */;
INSERT INTO `cambios_planes_estudios` VALUES (1,1,1,2,NULL,'2025-05-01',NULL,NULL,'PENDIENTE','Cambio de plan por motivos laborales',1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `cambios_planes_estudios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carreras`
--

DROP TABLE IF EXISTS `carreras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carreras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(255) NOT NULL,
  `nombre` varchar(60) NOT NULL,
  `tipo` enum('permanente','a_termino') NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `descripcion` text,
  `dossier` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `id_administrativo` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`),
  UNIQUE KEY `carreras_codigo` (`codigo`),
  UNIQUE KEY `codigo_2` (`codigo`),
  KEY `carreras_nombre` (`nombre`),
  KEY `id_administrativo` (`id_administrativo`),
  CONSTRAINT `carreras_ibfk_1` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carreras`
--

LOCK TABLES `carreras` WRITE;
/*!40000 ALTER TABLE `carreras` DISABLE KEYS */;
INSERT INTO `carreras` VALUES (1,'TSPW-001','Tecnicatura Superior en Programación Web','permanente',NULL,'Carrera de desarrollo web','dossier_web.pdf',1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,'TSDS-002','Tecnicatura Superior en Data Science','a_termino',NULL,'Carrera de ciencia de datos','dossier_ds.pdf',1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `carreras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ciclos_lectivos`
--

DROP TABLE IF EXISTS `ciclos_lectivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ciclos_lectivos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `anio` int NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `id_plan_estudio` int NOT NULL,
  `id_administrativo` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ciclos_lectivos_anio` (`anio`),
  KEY `id_plan_estudio` (`id_plan_estudio`),
  KEY `id_administrativo` (`id_administrativo`),
  CONSTRAINT `ciclos_lectivos_ibfk_3` FOREIGN KEY (`id_plan_estudio`) REFERENCES `planes_estudios` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `ciclos_lectivos_ibfk_4` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ciclos_lectivos`
--

LOCK TABLES `ciclos_lectivos` WRITE;
/*!40000 ALTER TABLE `ciclos_lectivos` DISABLE KEYS */;
INSERT INTO `ciclos_lectivos` VALUES (1,2025,1,'2025-03-01','2025-12-20',1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,2026,0,'2026-03-01','2026-12-20',2,1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `ciclos_lectivos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comprobantes_alumnos`
--

DROP TABLE IF EXISTS `comprobantes_alumnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comprobantes_alumnos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_movimiento_financiero` int NOT NULL,
  `url_comprobante` varchar(500) NOT NULL,
  `concepto` varchar(200) NOT NULL,
  `fecha_carga` date NOT NULL,
  `estado` enum('VALIDADO','NO_VALIDADO') DEFAULT 'NO_VALIDADO',
  `fecha_confirmacion` date DEFAULT NULL,
  `id_administrativo` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_movimiento_financiero` (`id_movimiento_financiero`),
  KEY `id_administrativo` (`id_administrativo`),
  CONSTRAINT `comprobantes_alumnos_ibfk_3` FOREIGN KEY (`id_movimiento_financiero`) REFERENCES `movimientos_financieros` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `comprobantes_alumnos_ibfk_4` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comprobantes_alumnos`
--

LOCK TABLES `comprobantes_alumnos` WRITE;
/*!40000 ALTER TABLE `comprobantes_alumnos` DISABLE KEYS */;
INSERT INTO `comprobantes_alumnos` VALUES (1,1,'https://example.com/comprobantes/comp1.pdf','Pago Mayo','2025-05-10','NO_VALIDADO',NULL,NULL);
/*!40000 ALTER TABLE `comprobantes_alumnos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `correlatividades`
--

DROP TABLE IF EXISTS `correlatividades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `correlatividades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_plan` int NOT NULL,
  `id_unidad_curricular` int NOT NULL,
  `id_unidad_curricular_correlativa` int NOT NULL,
  `condicion` enum('REGULARIZADA','APROBADA','PENDIENTE','DESAPROBADA') NOT NULL DEFAULT 'PENDIENTE',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_plan` (`id_plan`),
  KEY `id_unidad_curricular` (`id_unidad_curricular`),
  KEY `id_unidad_curricular_correlativa` (`id_unidad_curricular_correlativa`),
  CONSTRAINT `correlatividades_ibfk_4` FOREIGN KEY (`id_plan`) REFERENCES `planes_estudios` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `correlatividades_ibfk_5` FOREIGN KEY (`id_unidad_curricular`) REFERENCES `unidades_curriculares` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `correlatividades_ibfk_6` FOREIGN KEY (`id_unidad_curricular_correlativa`) REFERENCES `unidades_curriculares` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `correlatividades`
--

LOCK TABLES `correlatividades` WRITE;
/*!40000 ALTER TABLE `correlatividades` DISABLE KEYS */;
INSERT INTO `correlatividades` VALUES (1,1,2,1,'PENDIENTE','2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,2,4,5,'PENDIENTE','2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `correlatividades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cursos`
--

DROP TABLE IF EXISTS `cursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cursos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cupo_estudiantes` int DEFAULT NULL,
  `anio_academico` int NOT NULL,
  `id_ciclo_lectivo` int NOT NULL,
  `id_administrativo` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cursos_anio_academico` (`anio_academico`),
  KEY `cursos_id_ciclo_lectivo` (`id_ciclo_lectivo`),
  KEY `id_administrativo` (`id_administrativo`),
  CONSTRAINT `cursos_ibfk_3` FOREIGN KEY (`id_ciclo_lectivo`) REFERENCES `ciclos_lectivos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `cursos_ibfk_4` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cursos`
--

LOCK TABLES `cursos` WRITE;
/*!40000 ALTER TABLE `cursos` DISABLE KEYS */;
INSERT INTO `cursos` VALUES (1,30,1,1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,25,2,1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(3,35,1,2,1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `cursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `designaciones_docentes`
--

DROP TABLE IF EXISTS `designaciones_docentes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `designaciones_docentes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_docente` int NOT NULL,
  `id_division_x_unidad_curricular` int NOT NULL,
  `id_ciclo_lectivo` int NOT NULL,
  `turno` varchar(255) NOT NULL,
  `aula` varchar(255) DEFAULT NULL,
  `horario` varchar(255) NOT NULL,
  `nroMAB` varchar(255) NOT NULL,
  `fechaAltaMAB` date NOT NULL,
  `id_administrativo` int NOT NULL,
  `fechaVtoMAB` date NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `designaciones_docentes_id_docente` (`id_docente`),
  KEY `id_division_x_unidad_curricular` (`id_division_x_unidad_curricular`),
  KEY `id_ciclo_lectivo` (`id_ciclo_lectivo`),
  KEY `id_administrativo` (`id_administrativo`),
  CONSTRAINT `designaciones_docentes_ibfk_5` FOREIGN KEY (`id_docente`) REFERENCES `docentes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `designaciones_docentes_ibfk_6` FOREIGN KEY (`id_division_x_unidad_curricular`) REFERENCES `divisiones_x_unidades_curriculares` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `designaciones_docentes_ibfk_7` FOREIGN KEY (`id_ciclo_lectivo`) REFERENCES `ciclos_lectivos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `designaciones_docentes_ibfk_8` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `designaciones_docentes`
--

LOCK TABLES `designaciones_docentes` WRITE;
/*!40000 ALTER TABLE `designaciones_docentes` DISABLE KEYS */;
INSERT INTO `designaciones_docentes` VALUES (1,1,1,1,'Mañana','Aula 101','08:00-10:00','MAB001','2025-03-01',1,'2026-03-01',1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,2,2,1,'Tarde','Aula 202','14:00-16:00','MAB002','2025-03-01',1,'2026-03-01',1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `designaciones_docentes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `divisiones`
--

DROP TABLE IF EXISTS `divisiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `divisiones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_docente` int NOT NULL,
  `id_curso` int NOT NULL,
  `id_administrativo` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `divisiones_id_docente` (`id_docente`),
  KEY `divisiones_id_curso` (`id_curso`),
  KEY `divisiones_id_administrativo` (`id_administrativo`),
  CONSTRAINT `divisiones_ibfk_4` FOREIGN KEY (`id_docente`) REFERENCES `docentes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `divisiones_ibfk_5` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `divisiones_ibfk_6` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `divisiones`
--

LOCK TABLES `divisiones` WRITE;
/*!40000 ALTER TABLE `divisiones` DISABLE KEYS */;
INSERT INTO `divisiones` VALUES (1,1,1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,2,1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(3,3,2,1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `divisiones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `divisiones_x_unidades_curriculares`
--

DROP TABLE IF EXISTS `divisiones_x_unidades_curriculares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `divisiones_x_unidades_curriculares` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_division` int NOT NULL,
  `id_unidad_curricular` int NOT NULL,
  `id_administrativo` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `divisiones_x_unidades_curriculares_id_division` (`id_division`),
  KEY `divisiones_x_unidades_curriculares_id_unidad_curricular` (`id_unidad_curricular`),
  KEY `divisiones_x_unidades_curriculares_id_administrativo` (`id_administrativo`),
  CONSTRAINT `divisiones_x_unidades_curriculares_ibfk_4` FOREIGN KEY (`id_division`) REFERENCES `divisiones` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `divisiones_x_unidades_curriculares_ibfk_5` FOREIGN KEY (`id_unidad_curricular`) REFERENCES `unidades_curriculares` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `divisiones_x_unidades_curriculares_ibfk_6` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `divisiones_x_unidades_curriculares`
--

LOCK TABLES `divisiones_x_unidades_curriculares` WRITE;
/*!40000 ALTER TABLE `divisiones_x_unidades_curriculares` DISABLE KEYS */;
INSERT INTO `divisiones_x_unidades_curriculares` VALUES (1,1,1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,1,2,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(3,2,1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(4,3,4,1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `divisiones_x_unidades_curriculares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `docentes`
--

DROP TABLE IF EXISTS `docentes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `docentes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `contrasenia` varchar(100) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `domicilio` varchar(255) NOT NULL,
  `telefono` varchar(30) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `id_administrativo` int NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `fecha_de_alta` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `dni` (`dni`),
  UNIQUE KEY `docentes_email` (`email`),
  UNIQUE KEY `docentes_dni` (`dni`),
  KEY `id_administrativo` (`id_administrativo`),
  CONSTRAINT `docentes_ibfk_1` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `docentes`
--

LOCK TABLES `docentes` WRITE;
/*!40000 ALTER TABLE `docentes` DISABLE KEYS */;
INSERT INTO `docentes` VALUES (1,'Marcelo','Díaz','marcelo.diaz@instituto.edu','$2b$10$doc1','30111222','Lic. en Matemáticas','Cálculo','Calle Falsa 123','351-5550001',NULL,2,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,'Graciela','Ruiz','graciela.ruiz@instituto.edu','$2b$10$doc2','30222333','Ing. en Sistemas','Programación','Av. Corrientes 456','351-5550002',NULL,2,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(3,'Omar','Sosa','omar.sosa@instituto.edu','$2b$10$doc3','30333444','Prof. de Historia','Historia Argentina','Calle 9 de Julio 789','351-5550003',NULL,2,1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `docentes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documentos_legajos`
--

DROP TABLE IF EXISTS `documentos_legajos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documentos_legajos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_legajo` int NOT NULL,
  `id_tipo_documento_requerido` int NOT NULL,
  `id_usuario_carga` int NOT NULL,
  `url_archivo` varchar(500) NOT NULL,
  `fecha_carga` date NOT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `estado` enum('APROBADO','RECHAZADO','PENDIENTE') DEFAULT 'PENDIENTE',
  `id_administrativo` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_legajo` (`id_legajo`),
  KEY `id_tipo_documento_requerido` (`id_tipo_documento_requerido`),
  KEY `id_usuario_carga` (`id_usuario_carga`),
  KEY `id_administrativo` (`id_administrativo`),
  CONSTRAINT `documentos_legajos_ibfk_5` FOREIGN KEY (`id_legajo`) REFERENCES `legajos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `documentos_legajos_ibfk_6` FOREIGN KEY (`id_tipo_documento_requerido`) REFERENCES `tipos_documentos_requeridos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `documentos_legajos_ibfk_7` FOREIGN KEY (`id_usuario_carga`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `documentos_legajos_ibfk_8` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documentos_legajos`
--

LOCK TABLES `documentos_legajos` WRITE;
/*!40000 ALTER TABLE `documentos_legajos` DISABLE KEYS */;
INSERT INTO `documentos_legajos` VALUES (1,1,1,1,'https://example.com/docs/dni_1.pdf','2025-03-15',NULL,'APROBADO',1),(2,1,2,1,'https://example.com/docs/titulo_1.pdf','2025-03-15',NULL,'PENDIENTE',1);
/*!40000 ALTER TABLE `documentos_legajos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dossiers_institucionales`
--

DROP TABLE IF EXISTS `dossiers_institucionales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dossiers_institucionales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_carrera` int NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `seccion` varchar(100) NOT NULL,
  `contenido` text NOT NULL,
  `url_archivo` varchar(500) DEFAULT NULL,
  `tipo` enum('NORMATIVA','INFORME','CIRCULAR') NOT NULL,
  `estado` tinyint(1) DEFAULT '0',
  `fecha_actualizacion` datetime NOT NULL,
  `id_administrativo` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_carrera` (`id_carrera`),
  KEY `id_administrativo` (`id_administrativo`),
  CONSTRAINT `dossiers_institucionales_ibfk_3` FOREIGN KEY (`id_carrera`) REFERENCES `carreras` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `dossiers_institucionales_ibfk_4` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dossiers_institucionales`
--

LOCK TABLES `dossiers_institucionales` WRITE;
/*!40000 ALTER TABLE `dossiers_institucionales` DISABLE KEYS */;
INSERT INTO `dossiers_institucionales` VALUES (1,1,'Normativa de cursado','Reglamento','Contenido del reglamento...',NULL,'NORMATIVA',1,'2026-05-19 10:27:08',1),(2,2,'Informe de avance','Informes','Contenido del informe...','https://example.com/informe.pdf','INFORME',0,'2026-05-19 10:27:08',1);
/*!40000 ALTER TABLE `dossiers_institucionales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equivalencias_unidades_curriculares`
--

DROP TABLE IF EXISTS `equivalencias_unidades_curriculares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equivalencias_unidades_curriculares` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_plan_estudio_origen` int NOT NULL,
  `id_plan_estudio_destino` int NOT NULL,
  `id_unidad_curricular_origen` int NOT NULL,
  `id_unidad_curricular_destino` int NOT NULL,
  `tipo_equivalencia` enum('TOTAL','PARCIAL') NOT NULL,
  `observaciones` text,
  `id_administrativo` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `un_equivalencia_completa` (`id_plan_estudio_origen`,`id_plan_estudio_destino`,`id_unidad_curricular_origen`,`id_unidad_curricular_destino`),
  KEY `id_plan_estudio_destino` (`id_plan_estudio_destino`),
  KEY `id_unidad_curricular_origen` (`id_unidad_curricular_origen`),
  KEY `id_unidad_curricular_destino` (`id_unidad_curricular_destino`),
  KEY `id_administrativo` (`id_administrativo`),
  CONSTRAINT `equivalencias_unidades_curriculares_ibfk_10` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `equivalencias_unidades_curriculares_ibfk_6` FOREIGN KEY (`id_plan_estudio_origen`) REFERENCES `planes_estudios` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `equivalencias_unidades_curriculares_ibfk_7` FOREIGN KEY (`id_plan_estudio_destino`) REFERENCES `planes_estudios` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `equivalencias_unidades_curriculares_ibfk_8` FOREIGN KEY (`id_unidad_curricular_origen`) REFERENCES `unidades_curriculares` (`id`),
  CONSTRAINT `equivalencias_unidades_curriculares_ibfk_9` FOREIGN KEY (`id_unidad_curricular_destino`) REFERENCES `unidades_curriculares` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equivalencias_unidades_curriculares`
--

LOCK TABLES `equivalencias_unidades_curriculares` WRITE;
/*!40000 ALTER TABLE `equivalencias_unidades_curriculares` DISABLE KEYS */;
INSERT INTO `equivalencias_unidades_curriculares` VALUES (1,1,2,1,4,'PARCIAL','Solo equivalencia parcial de contenidos',1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `equivalencias_unidades_curriculares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estudiantes`
--

DROP TABLE IF EXISTS `estudiantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiantes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dni` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `telefono` varchar(30) NOT NULL,
  `domicilio` varchar(200) NOT NULL,
  `provincia` varchar(100) DEFAULT NULL,
  `localidad` varchar(100) DEFAULT NULL,
  `fecha_de_nacimiento` date NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `trabaja` tinyint(1) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `id_administrativo` int NOT NULL,
  `id_usuario` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dni` (`dni`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `idx_est_dni_email` (`dni`,`email`),
  KEY `estudiantes_dni` (`dni`),
  KEY `estudiantes_email` (`email`),
  KEY `estudiantes_id_administrativo` (`id_administrativo`),
  KEY `estudiantes_id_usuario` (`id_usuario`),
  CONSTRAINT `estudiantes_ibfk_3` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `estudiantes_ibfk_4` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiantes`
--

LOCK TABLES `estudiantes` WRITE;
/*!40000 ALTER TABLE `estudiantes` DISABLE KEYS */;
INSERT INTO `estudiantes` VALUES (1,'40123456','Juan','López','juan.lopez@correo.com','351-1110000','Calle Estudiante 1',NULL,NULL,'2000-05-15',NULL,0,1,1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,'40234567','Ana','Martínez','ana.martinez@correo.com','351-2220000','Calle Estudiante 2',NULL,NULL,'2001-08-22',NULL,1,1,1,2,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(3,'40345678','Pedro','García','pedro.garcia@correo.com','351-3330000','Calle Estudiante 3',NULL,NULL,'2002-11-30',NULL,0,1,1,3,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(4,'40456789','Sofía','Rodríguez','sofia.rodriguez@correo.com','351-4440000','Calle Estudiante 4',NULL,NULL,'2003-02-10',NULL,0,1,1,4,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `estudiantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estudiantes_x_unidades_curriculares`
--

DROP TABLE IF EXISTS `estudiantes_x_unidades_curriculares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiantes_x_unidades_curriculares` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_division_x_unidad_curricular` int NOT NULL,
  `id_legajo` int NOT NULL,
  `fecha_de_inscripcion` date NOT NULL,
  `condicion` enum('promocionado','regular','libre') NOT NULL,
  `id_administrativo` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_division_x_unidad_curricular` (`id_division_x_unidad_curricular`),
  KEY `id_legajo` (`id_legajo`),
  KEY `id_administrativo` (`id_administrativo`),
  CONSTRAINT `estudiantes_x_unidades_curriculares_ibfk_4` FOREIGN KEY (`id_division_x_unidad_curricular`) REFERENCES `divisiones_x_unidades_curriculares` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `estudiantes_x_unidades_curriculares_ibfk_5` FOREIGN KEY (`id_legajo`) REFERENCES `legajos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `estudiantes_x_unidades_curriculares_ibfk_6` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiantes_x_unidades_curriculares`
--

LOCK TABLES `estudiantes_x_unidades_curriculares` WRITE;
/*!40000 ALTER TABLE `estudiantes_x_unidades_curriculares` DISABLE KEYS */;
INSERT INTO `estudiantes_x_unidades_curriculares` VALUES (1,1,1,'2025-03-10','regular',1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,2,1,'2025-03-10','promocionado',1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(3,3,2,'2025-03-12','libre',1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `estudiantes_x_unidades_curriculares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `informacion_extra`
--

DROP TABLE IF EXISTS `informacion_extra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `informacion_extra` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) NOT NULL,
  `icono` varchar(255) DEFAULT NULL,
  `descripcion` text NOT NULL,
  `id_carrera` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_carrera` (`id_carrera`),
  CONSTRAINT `informacion_extra_ibfk_1` FOREIGN KEY (`id_carrera`) REFERENCES `carreras` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `informacion_extra`
--

LOCK TABLES `informacion_extra` WRITE;
/*!40000 ALTER TABLE `informacion_extra` DISABLE KEYS */;
INSERT INTO `informacion_extra` VALUES (1,'Horarios de consulta',NULL,'Lunes a Viernes de 18 a 20 hs.',1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `informacion_extra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inscripciones_carreras`
--

DROP TABLE IF EXISTS `inscripciones_carreras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inscripciones_carreras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cupo` int DEFAULT NULL,
  `fecha_desde` date DEFAULT NULL,
  `fecha_hasta` date DEFAULT NULL,
  `id_plan_estudio` int NOT NULL,
  `id_administrativo` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `inscripciones_carreras_id_plan_estudio` (`id_plan_estudio`),
  KEY `inscripciones_carreras_id_administrativo` (`id_administrativo`),
  CONSTRAINT `inscripciones_carreras_ibfk_3` FOREIGN KEY (`id_plan_estudio`) REFERENCES `planes_estudios` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `inscripciones_carreras_ibfk_4` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inscripciones_carreras`
--

LOCK TABLES `inscripciones_carreras` WRITE;
/*!40000 ALTER TABLE `inscripciones_carreras` DISABLE KEYS */;
INSERT INTO `inscripciones_carreras` VALUES (1,50,'2025-01-15','2025-02-28',1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,40,'2025-06-01','2025-07-15',2,1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `inscripciones_carreras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instancias_evaluativas`
--

DROP TABLE IF EXISTS `instancias_evaluativas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instancias_evaluativas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_division_x_unidad_curricular` int NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `fecha` datetime NOT NULL,
  `tipo` enum('trabajo practico','parcial','examen final','recuperatorio','coloquio','proyecto integrador') NOT NULL,
  `id_administrativo` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_instancia_div_uc` (`id_division_x_unidad_curricular`),
  KEY `instancias_evaluativas_fecha` (`fecha`),
  KEY `instancias_evaluativas_tipo` (`tipo`),
  KEY `instancias_evaluativas_id_administrativo` (`id_administrativo`),
  CONSTRAINT `instancias_evaluativas_ibfk_3` FOREIGN KEY (`id_division_x_unidad_curricular`) REFERENCES `divisiones_x_unidades_curriculares` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `instancias_evaluativas_ibfk_4` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instancias_evaluativas`
--

LOCK TABLES `instancias_evaluativas` WRITE;
/*!40000 ALTER TABLE `instancias_evaluativas` DISABLE KEYS */;
INSERT INTO `instancias_evaluativas` VALUES (1,1,'Primer Parcial Programación I','2025-05-15 09:00:00','parcial',1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,2,'Trabajo Práctico Matemática','2025-06-10 14:00:00','trabajo practico',1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(3,3,'Primer Parcial Programación I','2025-05-15 09:00:00','parcial',1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `instancias_evaluativas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `legajos`
--

DROP TABLE IF EXISTS `legajos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `legajos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_estudiante` int NOT NULL,
  `numeroLegajo` int NOT NULL,
  `id_plan_estudio` int NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `id_administrativo` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `legajos_id_estudiante` (`id_estudiante`),
  KEY `legajos_id_plan_estudio` (`id_plan_estudio`),
  KEY `legajos_id_administrativo` (`id_administrativo`),
  CONSTRAINT `legajos_ibfk_4` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `legajos_ibfk_5` FOREIGN KEY (`id_plan_estudio`) REFERENCES `planes_estudios` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `legajos_ibfk_6` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `legajos`
--

LOCK TABLES `legajos` WRITE;
/*!40000 ALTER TABLE `legajos` DISABLE KEYS */;
INSERT INTO `legajos` VALUES (1,1,10001,1,1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,2,10002,1,1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(3,3,10003,2,1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(4,4,10004,2,1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `legajos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `legajos_x_instancias_evaluativas`
--

DROP TABLE IF EXISTS `legajos_x_instancias_evaluativas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `legajos_x_instancias_evaluativas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_instancia_evaluativa` int NOT NULL,
  `id_legajo` int NOT NULL,
  `nota` int NOT NULL,
  `fecha_registro` date NOT NULL,
  `id_administrativo` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `legajos_x_instancias_evaluativas_id_instancia_evaluativa` (`id_instancia_evaluativa`),
  KEY `legajos_x_instancias_evaluativas_id_legajo` (`id_legajo`),
  KEY `legajos_x_instancias_evaluativas_id_administrativo` (`id_administrativo`),
  CONSTRAINT `legajos_x_instancias_evaluativas_ibfk_4` FOREIGN KEY (`id_instancia_evaluativa`) REFERENCES `instancias_evaluativas` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `legajos_x_instancias_evaluativas_ibfk_5` FOREIGN KEY (`id_legajo`) REFERENCES `legajos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `legajos_x_instancias_evaluativas_ibfk_6` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `legajos_x_instancias_evaluativas`
--

LOCK TABLES `legajos_x_instancias_evaluativas` WRITE;
/*!40000 ALTER TABLE `legajos_x_instancias_evaluativas` DISABLE KEYS */;
INSERT INTO `legajos_x_instancias_evaluativas` VALUES (1,1,1,8,'2025-05-20',1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,3,2,6,'2025-05-20',1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(3,2,1,9,'2025-06-15',1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `legajos_x_instancias_evaluativas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mesas_examenes`
--

DROP TABLE IF EXISTS `mesas_examenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mesas_examenes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_turno_examen` int NOT NULL,
  `id_unidad_curricular` int NOT NULL,
  `fecha` date NOT NULL,
  `hora` varchar(10) NOT NULL,
  `id_docente_presidente` int NOT NULL,
  `id_docente_vocal1` int NOT NULL,
  `id_docente_vocal2` int NOT NULL,
  `total_inscripto` int DEFAULT '0',
  `total_aprobados` int DEFAULT '0',
  `total_desaprobados` int DEFAULT '0',
  `total_ausentes` int DEFAULT '0',
  `tipo` enum('REGULAR','LIBRE','PROMOCIONAL') NOT NULL DEFAULT 'REGULAR',
  `categoria` enum('ORDINARIAS','EXTRAORDINARIAS') NOT NULL DEFAULT 'ORDINARIAS',
  `activo` tinyint(1) DEFAULT '1',
  `id_administrativo` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_turno_examen` (`id_turno_examen`),
  KEY `id_unidad_curricular` (`id_unidad_curricular`),
  KEY `id_docente_presidente` (`id_docente_presidente`),
  KEY `id_docente_vocal1` (`id_docente_vocal1`),
  KEY `id_docente_vocal2` (`id_docente_vocal2`),
  KEY `id_administrativo` (`id_administrativo`),
  CONSTRAINT `mesas_examenes_ibfk_10` FOREIGN KEY (`id_docente_vocal1`) REFERENCES `docentes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `mesas_examenes_ibfk_11` FOREIGN KEY (`id_docente_vocal2`) REFERENCES `docentes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `mesas_examenes_ibfk_12` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `mesas_examenes_ibfk_7` FOREIGN KEY (`id_turno_examen`) REFERENCES `turnos_examenes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `mesas_examenes_ibfk_8` FOREIGN KEY (`id_unidad_curricular`) REFERENCES `unidades_curriculares` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `mesas_examenes_ibfk_9` FOREIGN KEY (`id_docente_presidente`) REFERENCES `docentes` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mesas_examenes`
--

LOCK TABLES `mesas_examenes` WRITE;
/*!40000 ALTER TABLE `mesas_examenes` DISABLE KEYS */;
INSERT INTO `mesas_examenes` VALUES (1,1,1,'2025-07-25','10:00',1,2,3,2,0,0,0,'REGULAR','ORDINARIAS',1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,1,3,'2025-07-28','14:00',2,1,3,1,0,0,0,'REGULAR','ORDINARIAS',1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `mesas_examenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mesas_examenes_x_legajos`
--

DROP TABLE IF EXISTS `mesas_examenes_x_legajos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mesas_examenes_x_legajos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_mesa_examen` int NOT NULL,
  `id_legajo` int NOT NULL,
  `condicion` enum('regular','libre') NOT NULL,
  `fecha_inscripcion` datetime NOT NULL,
  `nota_oral` int NOT NULL,
  `nota_escrita` int NOT NULL,
  `nota_final` int NOT NULL,
  `fechaUltimaModificacion` date NOT NULL,
  `estaBloqueado` tinyint(1) DEFAULT '0',
  `resultado` enum('aprobado','desaprobado','ausente') DEFAULT NULL,
  `id_administrativo` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `mesas_examenes_x_legajos_id_mesa_examen` (`id_mesa_examen`),
  KEY `mesas_examenes_x_legajos_id_legajo` (`id_legajo`),
  KEY `mesas_examenes_x_legajos_fecha_inscripcion` (`fecha_inscripcion`),
  KEY `mesas_examenes_x_legajos_condicion` (`condicion`),
  KEY `mesas_examenes_x_legajos_resultado` (`resultado`),
  KEY `mesas_examenes_x_legajos_id_administrativo` (`id_administrativo`),
  CONSTRAINT `mesas_examenes_x_legajos_ibfk_4` FOREIGN KEY (`id_mesa_examen`) REFERENCES `mesas_examenes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `mesas_examenes_x_legajos_ibfk_5` FOREIGN KEY (`id_legajo`) REFERENCES `legajos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `mesas_examenes_x_legajos_ibfk_6` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mesas_examenes_x_legajos`
--

LOCK TABLES `mesas_examenes_x_legajos` WRITE;
/*!40000 ALTER TABLE `mesas_examenes_x_legajos` DISABLE KEYS */;
INSERT INTO `mesas_examenes_x_legajos` VALUES (1,1,1,'regular','2025-07-10 09:00:00',7,8,8,'2025-07-25',0,'aprobado',1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,1,2,'libre','2025-07-12 10:00:00',4,5,4,'2025-07-25',0,'desaprobado',1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `mesas_examenes_x_legajos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimientos_financieros`
--

DROP TABLE IF EXISTS `movimientos_financieros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientos_financieros` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_estudiante` int NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `concepto` varchar(100) NOT NULL,
  `monto` int NOT NULL,
  `fecha` date NOT NULL,
  `medio_pago` varchar(50) NOT NULL,
  `descripcion` text,
  `id_administrativo` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `movimientos_financieros_id_estudiante` (`id_estudiante`),
  KEY `movimientos_financieros_tipo` (`tipo`),
  KEY `id_administrativo` (`id_administrativo`),
  CONSTRAINT `movimientos_financieros_ibfk_3` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `movimientos_financieros_ibfk_4` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientos_financieros`
--

LOCK TABLES `movimientos_financieros` WRITE;
/*!40000 ALTER TABLE `movimientos_financieros` DISABLE KEYS */;
INSERT INTO `movimientos_financieros` VALUES (1,1,'INGRESO','Cuota Mensual Mayo',5000,'2025-05-10','Transferencia',NULL,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,2,'EGRESO','Devolución material',1500,'2025-04-28','Efectivo','Devolución por error de facturación',1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `movimientos_financieros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idEstudiante` int DEFAULT NULL,
  `idDocente` int DEFAULT NULL,
  `idAdministrativo` int DEFAULT NULL,
  `titulo` varchar(150) NOT NULL,
  `mensaje` text NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `entidadRelacionada` varchar(100) DEFAULT NULL,
  `entidadId` int DEFAULT NULL,
  `leida` tinyint(1) NOT NULL DEFAULT '0',
  `fechaCreacion` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idEstudiante` (`idEstudiante`),
  KEY `idDocente` (`idDocente`),
  KEY `idAdministrativo` (`idAdministrativo`),
  CONSTRAINT `notificaciones_ibfk_4` FOREIGN KEY (`idEstudiante`) REFERENCES `estudiantes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `notificaciones_ibfk_5` FOREIGN KEY (`idDocente`) REFERENCES `docentes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `notificaciones_ibfk_6` FOREIGN KEY (`idAdministrativo`) REFERENCES `administrativos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones`
--

LOCK TABLES `notificaciones` WRITE;
/*!40000 ALTER TABLE `notificaciones` DISABLE KEYS */;
INSERT INTO `notificaciones` VALUES (1,1,NULL,1,'Inscripción exitosa','Te has inscripto correctamente a Programación I','INFORMACION','estudiantes_x_unidades_curriculares',1,0,'2026-05-19 10:27:08'),(2,NULL,2,NULL,'Designación docente','Ud ha sido designado para la mesa de examen de Julio','AVISO','mesas_examenes',1,0,'2026-05-19 10:27:08');
/*!40000 ALTER TABLE `notificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificaciones_x_email`
--

DROP TABLE IF EXISTS `notificaciones_x_email`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificaciones_x_email` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emisor` varchar(150) NOT NULL,
  `receptor` varchar(150) NOT NULL,
  `asunto` varchar(150) NOT NULL,
  `mensaje` text NOT NULL,
  `enviado` tinyint(1) NOT NULL DEFAULT '0',
  `prioridad` enum('baja','media','alta') NOT NULL DEFAULT 'baja',
  `fechaCreacion` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones_x_email`
--

LOCK TABLES `notificaciones_x_email` WRITE;
/*!40000 ALTER TABLE `notificaciones_x_email` DISABLE KEYS */;
INSERT INTO `notificaciones_x_email` VALUES (1,'maria.gomez@instituto.edu','rodr26707@gmail.com','Aviso de examen','Las mesas se abriran a partir del 18-06-2016',1,'alta','2026-05-21 19:35:59'),(2,'maria.gomez@instituto.edu','dominguezale377@gmail.com','Aviso de examen','Prueba 1',1,'alta','2026-05-27 23:28:17'),(3,'maria.gomez@instituto.edu','dominguezale377@gmail.com','Aviso de examen','Prueba 2',1,'alta','2026-05-27 23:29:08');
/*!40000 ALTER TABLE `notificaciones_x_email` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planes_estudios`
--

DROP TABLE IF EXISTS `planes_estudios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planes_estudios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `version` varchar(255) NOT NULL,
  `fecha_de_aprobacion` date NOT NULL,
  `fecha_de_cierre` date NOT NULL,
  `duracion_en_anios` int NOT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `id_carrera` int NOT NULL,
  `id_administrativo` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `planes_estudios_id_carrera` (`id_carrera`),
  KEY `planes_estudios_id_administrativo` (`id_administrativo`),
  CONSTRAINT `planes_estudios_ibfk_3` FOREIGN KEY (`id_carrera`) REFERENCES `carreras` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `planes_estudios_ibfk_4` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planes_estudios`
--

LOCK TABLES `planes_estudios` WRITE;
/*!40000 ALTER TABLE `planes_estudios` DISABLE KEYS */;
INSERT INTO `planes_estudios` VALUES (1,'2024-v1','2024-02-01','2026-12-31',3,'VIGENTE',1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,'2024-v2','2024-03-01','2027-12-31',3,'VIGENTE',2,1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `planes_estudios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preinscriptos`
--

DROP TABLE IF EXISTS `preinscriptos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preinscriptos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_inscripcion` int NOT NULL,
  `id_usuario` int NOT NULL,
  `fechaInscripcion` date NOT NULL,
  `cus` varchar(255) NOT NULL,
  `isa` varchar(255) NOT NULL,
  `emmac` varchar(255) DEFAULT NULL,
  `analitico` varchar(255) NOT NULL,
  `partida_nacimiento` varchar(255) NOT NULL,
  `foto` varchar(255) NOT NULL,
  `estado` enum('pendiente','aprobado','rechazado') DEFAULT 'pendiente',
  `id_administrativo` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `idEstudiante` int DEFAULT NULL,
  `idCarrera` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preinscriptos_id_inscripcion` (`id_inscripcion`),
  KEY `preinscriptos_id_usuario` (`id_usuario`),
  KEY `preinscriptos_estado` (`estado`),
  KEY `preinscriptos_id_administrativo` (`id_administrativo`),
  KEY `idEstudiante` (`idEstudiante`),
  KEY `idCarrera` (`idCarrera`),
  CONSTRAINT `preinscriptos_ibfk_10` FOREIGN KEY (`idCarrera`) REFERENCES `carreras` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preinscriptos_ibfk_6` FOREIGN KEY (`id_inscripcion`) REFERENCES `inscripciones_carreras` (`id`),
  CONSTRAINT `preinscriptos_ibfk_7` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `preinscriptos_ibfk_8` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `preinscriptos_ibfk_9` FOREIGN KEY (`idEstudiante`) REFERENCES `estudiantes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preinscriptos`
--

LOCK TABLES `preinscriptos` WRITE;
/*!40000 ALTER TABLE `preinscriptos` DISABLE KEYS */;
INSERT INTO `preinscriptos` VALUES (1,1,3,'2025-02-20','CUS123','ISA456',NULL,'analitico.pdf','partida.pdf','foto.jpg','pendiente',1,'2026-05-19 10:27:08','2026-05-19 10:27:08',NULL,1);
/*!40000 ALTER TABLE `preinscriptos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recuperaciones_contrasenia`
--

DROP TABLE IF EXISTS `recuperaciones_contrasenia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recuperaciones_contrasenia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `fechaExpiracion` datetime NOT NULL,
  `usado` tinyint(1) NOT NULL DEFAULT '0',
  `fechaUso` datetime DEFAULT NULL,
  `id_administrativo` int DEFAULT NULL,
  `id_docente` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_administrativo` (`id_administrativo`),
  KEY `id_docente` (`id_docente`),
  CONSTRAINT `recuperaciones_contrasenia_ibfk_4` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `recuperaciones_contrasenia_ibfk_5` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `recuperaciones_contrasenia_ibfk_6` FOREIGN KEY (`id_docente`) REFERENCES `docentes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recuperaciones_contrasenia`
--

LOCK TABLES `recuperaciones_contrasenia` WRITE;
/*!40000 ALTER TABLE `recuperaciones_contrasenia` DISABLE KEYS */;
INSERT INTO `recuperaciones_contrasenia` VALUES (1,1,'2025-12-31 23:59:59',0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `recuperaciones_contrasenia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roles_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN','Administrador del sistema','2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,'DOCENTE','Docente de la institución','2026-05-19 10:27:08','2026-05-19 10:27:08'),(3,'ESTUDIANTE','Alumno regular','2026-05-19 10:27:08','2026-05-19 10:27:08'),(4,'RECTOR','Rector de la institución','2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sesiones_usuarios`
--

DROP TABLE IF EXISTS `sesiones_usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sesiones_usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `fechaInicioSesion` datetime NOT NULL,
  `fechaCierreSesion` datetime DEFAULT NULL,
  `intentoFallido` int NOT NULL DEFAULT '0',
  `bloqueado` tinyint(1) NOT NULL DEFAULT '0',
  `id_administrativo` int DEFAULT NULL,
  `id_docente` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_administrativo` (`id_administrativo`),
  KEY `id_docente` (`id_docente`),
  CONSTRAINT `sesiones_usuarios_ibfk_4` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sesiones_usuarios_ibfk_5` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sesiones_usuarios_ibfk_6` FOREIGN KEY (`id_docente`) REFERENCES `docentes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sesiones_usuarios`
--

LOCK TABLES `sesiones_usuarios` WRITE;
/*!40000 ALTER TABLE `sesiones_usuarios` DISABLE KEYS */;
INSERT INTO `sesiones_usuarios` VALUES (1,1,'2026-05-19 10:27:08',NULL,0,0,NULL,NULL),(2,2,'2026-05-19 10:27:08',NULL,0,0,NULL,NULL);
/*!40000 ALTER TABLE `sesiones_usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_documentos_requeridos`
--

DROP TABLE IF EXISTS `tipos_documentos_requeridos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_documentos_requeridos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_carrera` int NOT NULL,
  `nombre_documento` varchar(100) NOT NULL,
  `obligatorio` tinyint(1) DEFAULT '1',
  `es_critico` tinyint(1) DEFAULT '0',
  `descripcion` text,
  `dias_vigencia` int DEFAULT NULL,
  `id_administrativo` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tipos_documentos_requeridos_id_carrera` (`id_carrera`),
  KEY `tipos_documentos_requeridos_nombre_documento` (`nombre_documento`),
  KEY `tipos_documentos_requeridos_id_administrativo` (`id_administrativo`),
  CONSTRAINT `tipos_documentos_requeridos_ibfk_3` FOREIGN KEY (`id_carrera`) REFERENCES `carreras` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `tipos_documentos_requeridos_ibfk_4` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_documentos_requeridos`
--

LOCK TABLES `tipos_documentos_requeridos` WRITE;
/*!40000 ALTER TABLE `tipos_documentos_requeridos` DISABLE KEYS */;
INSERT INTO `tipos_documentos_requeridos` VALUES (1,1,'DNI',1,1,'Documento Nacional de Identidad',0,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,1,'Título Secundario',1,1,'Título de nivel medio completo',0,1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `tipos_documentos_requeridos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist`
--

DROP TABLE IF EXISTS `token_blacklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jti` varchar(255) NOT NULL,
  `exp` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `jti` (`jti`),
  UNIQUE KEY `token_blacklist_jti` (`jti`),
  UNIQUE KEY `jti_2` (`jti`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist`
--

LOCK TABLES `token_blacklist` WRITE;
/*!40000 ALTER TABLE `token_blacklist` DISABLE KEYS */;
INSERT INTO `token_blacklist` VALUES (40,'cd6cddf1-e17f-4cb3-bdde-5ef9372c1888','2026-06-01 18:19:54'),(41,'12a15c57-80be-4040-a16d-feb4700ba964','2026-06-01 18:20:29'),(42,'1be75883-0c41-49af-b058-c8be4f9b8c2f','2026-06-01 18:31:18'),(43,'c21ea371-4656-43df-9d97-0b30bc3d7f1e','2026-06-01 19:05:21'),(44,'04cf3cd4-e571-4682-b73f-0fd20dc3b26b','2026-06-01 20:01:57'),(45,'fe77a285-d173-420b-a29f-87e703e096c2','2026-06-01 20:02:32');
/*!40000 ALTER TABLE `token_blacklist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turnos_examenes`
--

DROP TABLE IF EXISTS `turnos_examenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turnos_examenes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(100) NOT NULL,
  `fecha_desde` date NOT NULL,
  `fecha_hasta` date NOT NULL,
  `id_ciclo_lectivo` int NOT NULL,
  `id_administrativo` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `turnos_examenes_id_ciclo_lectivo` (`id_ciclo_lectivo`),
  KEY `turnos_examenes_id_administrativo` (`id_administrativo`),
  CONSTRAINT `turnos_examenes_ibfk_3` FOREIGN KEY (`id_ciclo_lectivo`) REFERENCES `ciclos_lectivos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_examenes_ibfk_4` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turnos_examenes`
--

LOCK TABLES `turnos_examenes` WRITE;
/*!40000 ALTER TABLE `turnos_examenes` DISABLE KEYS */;
INSERT INTO `turnos_examenes` VALUES (1,'Turno Julio-Agosto 2025','2025-07-20','2025-08-10',1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `turnos_examenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unidades_curriculares`
--

DROP TABLE IF EXISTS `unidades_curriculares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unidades_curriculares` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_plan_estudio` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `duracion` enum('anual','cuatrimestral') NOT NULL,
  `cargaHoraria` int NOT NULL,
  `cuatrimestre` enum('primero','segundo') DEFAULT NULL,
  `id_administrativo` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `unidades_curriculares_id_plan_estudio` (`id_plan_estudio`),
  KEY `unidades_curriculares_nombre` (`nombre`),
  KEY `unidades_curriculares_id_administrativo` (`id_administrativo`),
  CONSTRAINT `unidades_curriculares_ibfk_3` FOREIGN KEY (`id_plan_estudio`) REFERENCES `planes_estudios` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `unidades_curriculares_ibfk_4` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unidades_curriculares`
--

LOCK TABLES `unidades_curriculares` WRITE;
/*!40000 ALTER TABLE `unidades_curriculares` DISABLE KEYS */;
INSERT INTO `unidades_curriculares` VALUES (1,1,'Programación I','cuatrimestral',120,'primero',1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,1,'Matemática Aplicada','cuatrimestral',90,'primero',1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(3,1,'Base de Datos','anual',160,NULL,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(4,2,'Estadística','cuatrimestral',100,'segundo',1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(5,2,'Machine Learning','anual',200,NULL,1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `unidades_curriculares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `contrasenia` varchar(100) NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `id_administrativo` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `usuarios_email` (`email`),
  KEY `id_administrativo` (`id_administrativo`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_administrativo`) REFERENCES `administrativos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Juan','Lopez','juan.lopez@correo.com','$2b$10$6KOizamch8SaX09I1OeDZunloySvdpUoSWY08rxqMyZt8R2PYUloK',1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(2,'Ana','Martinez','ana.martinez@correo.com','$2b$10$58nXNth74gg7JTwLAb5fHOlvJDf0Ab6LOuyI6kVEFySV1SJPGIWV.',1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(3,'Pedro','García','pedro.garcia@correo.com','$2b$10$hashpass3',1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08'),(4,'Sofía','Rodríguez','sofia.rodriguez@correo.com','$2b$10$hashpass4',1,1,'2026-05-19 10:27:08','2026-05-19 10:27:08');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-01 14:57:08
