import React from 'react';

interface ToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  description?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  id,
  checked,
  onChange,
  title,
  description,
}) => {
  return (
    <div className="toggle-field">
      <div className="toggle-info">
        <label htmlFor={id} id={`${id}-label`} className="toggle-title">
          {title}
        </label>
        {description && <span id={`${id}-desc`} className="toggle-desc">{description}</span>}
      </div>
      <label className="toggle-switch">
        <input
          id={id}
          type="checkbox"
          role="switch"
          aria-checked={checked}
          aria-labelledby={`${id}-label`}
          aria-describedby={description ? `${id}-desc` : undefined}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="toggle-slider"></span>
      </label>
    </div>
  );
};
