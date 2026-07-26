export interface InvulnerabilityState {
  invulnerableUntil: number;
}

export const canTakeDamage = (state: InvulnerabilityState, now: number): boolean =>
  now >= state.invulnerableUntil;

export const applyInvulnerability = (
  state: InvulnerabilityState,
  now: number,
  durationMs = 900,
): InvulnerabilityState => ({ ...state, invulnerableUntil: now + durationMs });
