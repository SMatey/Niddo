export const MATCHING = {
  COMPATIBILITY_WEIGHTS: {
    lifestyle: 0.4,
    budget: 0.3,
    location: 0.3,
  },
  LIFESTYLE: {
    SCHEDULE: {
      EARLY: 'early',
      NIGHT: 'night',
      FLEXIBLE: 'flexible',
    },
    GUESTS: {
      NEVER: 'never',
      RARELY: 'rarely',
      SOMETIMES: 'sometimes',
      OFTEN: 'often',
    },
  },
  UI: {
    COMPATIBILITY_LABEL: 'Compatibilidad:',
  },
} as const
