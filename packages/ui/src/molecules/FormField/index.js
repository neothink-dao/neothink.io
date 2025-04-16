'use client';
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { forwardRef } from 'react';
import { Input } from '../../atoms/Input';
import { cn } from '../../utils/cn';
export const FormField = forwardRef((_a, ref) => {
    var { label, helperText, error, success, required, disabled, hideLabel, className, id } = _a, props = __rest(_a, ["label", "helperText", "error", "success", "required", "disabled", "hideLabel", "className", "id"]);
    // Generate an ID if one isn't provided
    const fieldId = id || `field-${Math.random().toString(36).substring(2, 9)}`;
    // Determine if we're showing an error or success state
    const showError = !!error;
    const showSuccess = !showError && !!success;
    // Determine the label text (include required indicator if needed)
    const labelText = required ? `${label} *` : label;
    return (<div className={cn('space-y-2', className)}>
        {label && !hideLabel && (<label htmlFor={fieldId} className={cn('text-sm font-medium', disabled && 'opacity-70', showError && 'text-destructive', showSuccess && 'text-green-600')}>
            {labelText}
          </label>)}
        
        <Input id={fieldId} ref={ref} state={showError ? 'error' : showSuccess ? 'success' : 'default'} error={error} success={success} disabled={disabled} aria-describedby={helperText || showError || showSuccess
            ? `${fieldId}-description`
            : undefined} required={required} {...props}/>
        
        {helperText && !showError && !showSuccess && (<p id={`${fieldId}-description`} className="text-xs text-gray-500">
            {helperText}
          </p>)}
      </div>);
});
FormField.displayName = 'FormField';
export default FormField;
//# sourceMappingURL=index.js.map