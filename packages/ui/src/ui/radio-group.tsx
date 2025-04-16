import React from 'react';

export function RadioGroup({ value, onValueChange, children, ...props }: any) {
  return <div {...props}>{children}</div>;
}

export function RadioGroupItem({ value, id, ...props }: any) {
  return <input type="radio" value={value} id={id} {...props} />;
}
