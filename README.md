# Comparador de fechas de Planner

Aplicación web local para comparar dos exportaciones `.xlsx` de Planner y detectar cambios en las fechas de `Inicio` y `Finalización`.

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
3. La aplicación detecta los encabezados en la fila 9 y compara las fechas a partir de la fila 10.
4. Filtra por `Nombre`, `Asignado a` o estado de cambio.
5. Revisa los cambios en la pestaña `Comparación` o en `Ver calendario`.

También puedes usar `Probar con datos de ejemplo` para validar la interfaz sin archivos reales.
