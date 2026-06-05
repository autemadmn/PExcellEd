# Comparador de fechas de Planner

Aplicación web local para comparar exportaciones `.xlsx` de Planner, revisar cambios de fechas y generar una copia actualizada de un Excel maestro sin backend ni subida de archivos.

## Instalación

```bash
npm install
```

## Ejecución en desarrollo

```bash
npm run dev
```

Abre la URL local que indique Vite.

## Compilación

```bash
npm run build
```

## Uso

1. Sube el archivo de la `Semana anterior`.
2. Sube el archivo de la `Semana actual`.
3. Opcionalmente, carga el `Excel maestro` si quieres validar y preparar una actualización.
4. Revisa los cambios semanales en `Comparación`, `Ver calendario` o `Planner`.
5. En `Grid`, busca, filtra y selecciona filas. La app lee el proyecto desde la celda `B1` del Planner actual y lo valida contra el Excel maestro.
6. Si el proyecto coincide y las filas tienen coincidencia segura, usa `Generar Excel maestro actualizado` para descargar una copia nueva del maestro.

La aplicación nunca sobrescribe el archivo original del usuario. También puedes usar `Probar con datos de ejemplo` para validar la interfaz sin archivos reales.
