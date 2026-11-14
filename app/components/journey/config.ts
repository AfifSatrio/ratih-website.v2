export const TRANSITION_DURATION_MS = 1500;
export const SCENE_POSITIONS = { hero: 0, services: 1, advantages: 2 } as const;

export const ease = (value: number) => {
  const progress = Math.max(0, Math.min(1, value));
  return progress * progress * (3 - 2 * progress);
};
