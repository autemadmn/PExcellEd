# Gestor de Recepciones Excel

Aplicación web local para gestionar archivos Excel `.xlsx` de proyectos desde el navegador.

## Qué hace

Permite seleccionar un Excel, leer hojas, columnas y filas, editar celdas concretas, visualizar recepciones en calendario, mantener historial de cambios y descargar copias actualizadas o filtradas.

El archivo se procesa localmente en el navegador y no se envía a ningún servidor.

## Cómo ejecutarla con VS Code + Live Server

1. Descarga los archivos del proyecto.
2. Guarda `index.html`, `styles.css`, `app.js` y `README.md` en la misma carpeta.
3. Abre la carpeta con Visual Studio Code.
4. Instala la extensión **Live Server** si no la tienes.
5. Haz clic derecho sobre `index.html`.
6. Pulsa **Open with Live Server**.

## Cómo seleccionar un Excel

En la pantalla **Inicio**, pulsa **Seleccionar archivo Excel** o arrastra un `.xlsx` a la zona de carga.

## Configuración de columnas

La aplicación intenta detectar automáticamente:

- Proyecto: `PROYECTO`, `NOMBRE PROYECTO`, `PROJECT`, `NOMBRE`, `OBRA`, `ID PROYECTO`.
- Fecha real de recepción: columnas similares a `FECHA REAL RECEPCIÓN`.
- Semana: columnas similares a `FECHA REAL RECEPCIÓN (WEEK)`.

Si falla, abre **Configuración del archivo** y selecciona manualmente:

- Hoja activa.
- Columna que identifica cada proyecto.
- Columna de fecha real de recepción.
- Columna de semana de recepción.

## Cómo editar una celda

1. Abre **Editor de celdas**.
2. Selecciona una columna.
3. Selecciona un proyecto.
4. Revisa la referencia Excel mostrada, por ejemplo `E45`.
5. Introduce el nuevo valor.
6. Pulsa **Aplicar cambio**.

El archivo original no se modifica automáticamente.

## Calendario

Abre **Calendario** para ver los proyectos con fecha válida en la columna configurada como fecha real de recepción.

Incluye vista mensual, vista semanal, buscador por proyecto, filtro por semana y modal de detalle con botón para editar fecha.

## Descargar copia actualizada

Pulsa **Descargar copia actualizada** para generar una copia completa con las ediciones realizadas.

Formato del nombre:

```text
[nombre_original]_ACTUALIZADO_[fecha].xlsx
```

## Descargar Excel filtrado

En **Exportar Excel filtrado** puedes seleccionar proyectos y columnas.

Modos disponibles:

1. Solo proyectos y columnas seleccionados.
2. Todas las columnas de los proyectos seleccionados.

El botón principal es **Descargar Excel Filtrado**.

Formato del nombre:

```text
[nombre_original]_FILTRADO_[fecha].xlsx
```

La hoja exportada se llama `Proyectos Filtrados`.

## Advertencias

Conserva siempre el archivo original como respaldo antes de descargar una versión editada.

Esta versión soporta oficialmente `.xlsx`.

## Limitaciones

SheetJS permite leer y generar archivos Excel, pero la conservación perfecta de estilos complejos, macros, gráficos, conexiones externas o formatos avanzados puede no estar garantizada.

No se promete compatibilidad total con `.xlsm`, macros ni edición colaborativa.

## Mejoras futuras

- Integración real con SharePoint/OneDrive.
- Guardado versionado.
- Edición colaborativa.
- Validaciones corporativas por plantilla.
- Mejor conservación de estilos avanzados.
