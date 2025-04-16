export type Persona = 'ascender' | 'neothinker' | 'immortal' | 'hub';
export interface PersonaConfig {
    name: string;
    token: string;
    focus: string;
    goals: string[];
    app: string;
}
export declare const PERSONAS: Record<Persona, PersonaConfig>;
//# sourceMappingURL=personas.d.ts.map