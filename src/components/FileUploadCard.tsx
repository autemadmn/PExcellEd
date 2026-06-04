import { useId, useState } from 'react';

interface FileUploadCardProps {
  label: string;
  helperText: string;
  fileName: string | null;
  error: string | null;
  isReady: boolean;
  onFileSelected: (file: File) => void;
}

function getFirstFile(fileList: FileList | null): File | null {
  return fileList && fileList.length > 0 ? fileList[0] : null;
}

export function FileUploadCard({
  label,
  helperText,
  fileName,
  error,
  isReady,
  onFileSelected,
}: FileUploadCardProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File | null): void => {
    if (file) {
      onFileSelected(file);
    }
  };

  return (
    <section
      className={`upload-card ${isDragging ? 'is-dragging' : ''} ${isReady ? 'is-ready' : ''}`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFile(getFirstFile(event.dataTransfer.files));
      }}
    >
      <div>
        <h2>{label}</h2>
        <p>{helperText}</p>
      </div>

      <div className="upload-dropzone">
        <input
          id={inputId}
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={(event) => handleFile(getFirstFile(event.currentTarget.files))}
        />
        <label htmlFor={inputId}>
          <span className="upload-action">{fileName ? 'Sustituir archivo' : 'Seleccionar archivo'}</span>
          <span className="upload-hint">o arrastra aquí un archivo .xlsx</span>
        </label>
      </div>

      {fileName && <p className="file-name">{fileName}</p>}
      {error && <p className="upload-error">{error}</p>}
      {isReady && !error && <p className="upload-ready">Archivo validado</p>}
    </section>
  );
}
