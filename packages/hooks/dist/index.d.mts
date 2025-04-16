export { useCallback, useEffect, useMemo, useRef, useState } from 'react';

declare const useLocalStorage: <T>(key: string, initialValue: T) => [T, (value: T) => void];
declare const useDebounce: <T>(value: T, delay: number) => T;

export { useDebounce, useLocalStorage };
