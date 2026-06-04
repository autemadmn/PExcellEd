import Select, { type MultiValue, type StylesConfig } from 'react-select';
import type { FilterOption } from '../types/comparison';
import { normalizeText } from '../utils/normalizeText';

interface MultiSelectFilterProps {
  label: string;
  placeholder: string;
  options: FilterOption[];
  value: FilterOption[];
  onChange: (value: FilterOption[]) => void;
}

const selectStyles: StylesConfig<FilterOption, true> = {
  control: (base, state) => ({
    ...base,
    minHeight: 40,
    borderColor: state.isFocused ? '#244A70' : '#D9E1EA',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(36, 74, 112, 0.12)' : 'none',
    '&:hover': {
      borderColor: '#244A70',
    },
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#EEF3F8',
    borderRadius: 999,
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#10263F',
    fontWeight: 600,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#10263F' : state.isFocused ? '#F6F8FB' : '#FFFFFF',
    color: state.isSelected ? '#FFFFFF' : '#17212B',
  }),
};

export function MultiSelectFilter({
  label,
  placeholder,
  options,
  value,
  onChange,
}: MultiSelectFilterProps) {
  const handleChange = (newValue: MultiValue<FilterOption>): void => {
    onChange([...newValue]);
  };

  return (
    <label className="filter-field">
      <span>{label}</span>
      <Select<FilterOption, true>
        isMulti
        options={options}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        styles={selectStyles}
        classNamePrefix="planner-select"
        noOptionsMessage={() => 'Sin resultados'}
        loadingMessage={() => 'Buscando'}
        filterOption={(candidate, inputValue) => {
          const query = normalizeText(inputValue);
          if (!query) {
            return true;
          }

          return (
            normalizeText(candidate.data.label).includes(query) ||
            candidate.data.normalized.includes(query)
          );
        }}
        formatOptionLabel={(option) => (
          <span
            className="select-option-label"
            style={{
              paddingLeft: `${(option.indentationLevel ?? 0) * 12}px`,
              fontWeight: option.isBold ? 700 : 500,
            }}
          >
            {option.label.trim() || 'Sin asignar'}
          </span>
        )}
      />
    </label>
  );
}
