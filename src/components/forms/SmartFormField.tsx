import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface SmartFormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'textarea' | 'select' | 'multiselect';
  value: string | string[];
  onChange: (name: string, value: string | string[]) => void;
  options?: { value: string; label: string; description?: string }[];
  placeholder?: string;
  required?: boolean;
  validation?: (value: string | string[]) => string | null;
  helpText?: string;
  smartSuggestions?: string[];
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
  groupedOptions?: { [key: string]: { value: string; label: string }[] };
}

const SmartFormField: React.FC<SmartFormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  options = [],
  placeholder,
  required = false,
  validation,
  helpText,
  smartSuggestions = [],
  rows = 3,
  maxLength,
  showCharCount = false,
  groupedOptions
}) => {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (touched && validation) {
      const errorMessage = validation(value);
      setError(errorMessage);
    }
  }, [value, touched, validation]);

  useEffect(() => {
    if (type === 'text' && smartSuggestions.length > 0 && typeof value === 'string') {
      const filtered = smartSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase()) && suggestion !== value
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && value.length > 0);
    }
  }, [value, smartSuggestions, type]);

  const handleBlur = () => {
    setTouched(true);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(name, suggestion);
    setShowSuggestions(false);
  };

  const handleMultiSelectChange = (optionValue: string) => {
    const currentValues = Array.isArray(value) ? value : [];
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter(v => v !== optionValue)
      : [...currentValues, optionValue];
    onChange(name, newValues);
  };

  const getFieldStatus = () => {
    if (!touched) return 'default';
    if (error) return 'error';
    if (required && value) return 'success';
    return 'default';
  };

  const status = getFieldStatus();
  const characterCount = typeof value === 'string' ? value.length : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {showCharCount && maxLength && (
          <span className={`text-xs ${
            characterCount > maxLength * 0.9 ? 'text-red-500' : 'text-slate-500'
          }`}>
            {characterCount}/{maxLength}
          </span>
        )}
      </div>

      <div className="relative">
        {type === 'text' && (
          <>
            <input
              type="text"
              id={name}
              name={name}
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => onChange(name, e.target.value)}
              onBlur={handleBlur}
              onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
              placeholder={placeholder}
              maxLength={maxLength}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                status === 'error'
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : status === 'success'
                  ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                  : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            
            {showSuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {type === 'textarea' && (
          <textarea
            id={name}
            name={name}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(name, e.target.value)}
            onBlur={handleBlur}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors resize-vertical ${
              status === 'error'
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : status === 'success'
                ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
        )}

        {type === 'select' && (
          <select
            id={name}
            name={name}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(name, e.target.value)}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors ${
              status === 'error'
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : status === 'success'
                ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {groupedOptions ? (
              Object.entries(groupedOptions).map(([group, groupOptions]) => (
                <optgroup key={group} label={group}>
                  {groupOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))
            ) : (
              options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            )}
          </select>
        )}

        {type === 'multiselect' && (
          <div className="space-y-2 max-h-40 overflow-y-auto border border-slate-300 rounded-md p-2">
            {options.map((option) => (
              <label key={option.value} className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onChange={() => handleMultiSelectChange(option.value)}
                  className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <div>
                  <span className="text-sm text-slate-900">{option.label}</span>
                  {option.description && (
                    <p className="text-xs text-slate-500">{option.description}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
        )}

        {/* Status Icon */}
        <div className="absolute right-3 top-2.5 pointer-events-none">
          {status === 'error' && <AlertCircle size={16} className="text-red-500" />}
          {status === 'success' && <CheckCircle size={16} className="text-green-500" />}
        </div>
      </div>

      {/* Help Text */}
      {helpText && (
        <div className="flex items-start space-x-1">
          <Info size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-600">{helpText}</p>
        </div>
      )}

      {/* Error Message */}
      {error && touched && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <AlertCircle size={14} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default SmartFormField;