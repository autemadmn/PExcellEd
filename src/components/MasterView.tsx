import type { MasterChangeCandidate, MasterProjectValidation } from '../types/master';

interface MasterViewProps {
  candidates: MasterChangeCandidate[];
  validation: MasterProjectValidation;
  plannerFileName: string | null;
  masterFileName: string | null;
  onCreateMaster: () => void;
  canCreateMaster: boolean;
}

function countStatus(candidates: MasterChangeCandidate[], predicate: (candidate: MasterChangeCandidate) => boolean) {
  return candidates.filter(predicate).length;
}

export function MasterView({
  candidates,
  validation,
  plannerFileName,
  masterFileName,
  onCreateMaster,
  canCreateMaster,
}: MasterViewProps) {
  const readyCount = countStatus(candidates, (candidate) => candidate.status === 'ready');
  const noChangeCount = countStatus(candidates, (candidate) => candidate.status === 'no_change');
  const unmatchedCount = countStatus(candidates, (candidate) => candidate.status === 'not_found');
  const blockedCount = countStatus(candidates, (candidate) =>
    ['blocked', 'ambiguous', 'project_blocked'].includes(candidate.status),
  );

  return (
    <section className="master-view" aria-label="Excel maestro">
      <div className={`master-validation ${validation.status === 'valid' ? 'is-valid' : 'is-blocked'}`}>
        <div>
          <p className="planner-kicker">Validación del maestro</p>
          <h2>{validation.status === 'valid' ? 'Proyecto validado' : 'Proyecto pendiente de validar'}</h2>
          <span>{validation.message}</span>
        </div>
        <button className="primary-button" type="button" disabled={!canCreateMaster} onClick={onCreateMaster}>
          Crea Excel Maestro Actualizado
        </button>
      </div>

      <div className="master-card-grid">
        <article>
          <span>Planner actual</span>
          <strong>{plannerFileName ?? 'No cargado'}</strong>
        </article>
        <article>
          <span>Excel maestro</span>
          <strong>{masterFileName ?? 'No cargado'}</strong>
        </article>
        <article>
          <span>Cambios listos</span>
          <strong>{readyCount}</strong>
        </article>
        <article>
          <span>Sin cambios</span>
          <strong>{noChangeCount}</strong>
        </article>
        <article>
          <span>Sin coincidencia en maestro</span>
          <strong>{unmatchedCount}</strong>
        </article>
        <article>
          <span>Bloqueadas o ambiguas</span>
          <strong>{blockedCount}</strong>
        </article>
      </div>
    </section>
  );
}
