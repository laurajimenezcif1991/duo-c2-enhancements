import { createContext } from 'react';

/**
 * Allows Icon components inside a Button to inherit the button's text colour
 * without explicitly threading a `color` prop through every usage.
 */
export const ButtonColorContext = createContext<string | undefined>(undefined);
