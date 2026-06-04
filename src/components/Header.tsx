interface HeaderProps {
  onLoadDemoData: () => void;
}

export function Header({ onLoadDemoData }: HeaderProps) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Herramienta local</p>
        <h1>Comparador de fechas de Planner</h1>
        <p>Compara dos exportaciones semanales y localiza cambios de planificación</p>
      </div>
      <button className="secondary-button" type="button" onClick={onLoadDemoData}>
        Probar con datos de ejemplo
      </button>
    </header>
  );
}
