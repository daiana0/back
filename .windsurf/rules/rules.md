---
trigger: manual
---

# Arquitectura del proyecto

Este proyecto utiliza arquitectura Screaming Architecture + Hexagonal.

Antes de generar código debes:

1. Reutilizar componentes existentes.
2. No crear componentes duplicados.
3. No crear layouts nuevos si existe uno reutilizable.
4. Respetar la estructura actual del proyecto.
5. Revisar primero el directorio components/sistema.

- No crear componentes nuevos.
- Mantener TypeScript estricto.
- No usar estilos inline.
- Utilizar solo material UI.
- Reutilizar layouts existentes.
- Todos los componentes reutilizables están en /components/sistema.
- Está prohibido crear nuevos componentes.
- Está prohibido modificar componentes de /components/sistema.
- Las páginas deben componerse únicamente con componentes existentes.
- Si falta funcionalidad, informar qué componente falta en lugar de crearlo.
- No usar any.
- Mantener la estructura actual del proyecto.
Si falta funcionalidad, informar qué componente falta en lugar de crearlo.
# Componentes reutilizables disponibles

Todos los componentes reutilizables se encuentran en el directorio /components/sistema.
Antes de crear cualquier pantalla debes revisar si existe alguno de estos componentes:

LayoutPagina
CabeceraPagina
BadgeEstado
TablaAgrupada
CardFormulario
SeccionConBoton
TablaSimple
TablaAvanzada
CampoBusqueda
BadgeContador
ListaDocumentos
FormularioSistema
CampoTexto
CampoSelect
CampoFecha
CampoSwitch
CampoTextoReadOnly
CampoArchivo
TabsSistema
PaginacionSistema
PerfilCard
Sidebar
Topbar

Si un componente ya existe:
NO crear una versión nueva.
NO reemplazarlo por MUI.
NO reemplazarlo por Tailwind.

# Prohibiciones

No crear:

- Sidebars
- Topbars
- Layouts
- Tablas custom
- Inputs custom
- Cards custom
- Badges custom
- Formularios custom

Si existe un componente reutilizable debe usarse.

Antes de generar código debes informar qué componente reutilizable utilizarás.

# Comportamiento obligatorio

Antes de generar una pantalla:

1. Analizar los componentes reutilizables existentes.
2. Enumerar cuáles se utilizarán.
3. Enumerar cuáles faltan.
4. Esperar confirmación antes de crear componentes nuevos.

Si falta un componente reutilizable:
NO implementarlo automáticamente.

Primero informar:

"Necesito crear el componente X porque no existe uno equivalente."

Esperar aprobación.

# Pantallas de estudiantes

Todas las pantallas del módulo estudiante deben:

- utilizar Sidebar existente
- utilizar Topbar existente
- utilizar LayoutPagina
- utilizar tema institucional
- utilizar themeTokens
- utilizar componentes de components/sistema

No usar estilos hardcodeados si existe un token equivalente.