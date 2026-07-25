let seq = 1000

export const uid = (prefix = 'id') => `${prefix}-${++seq}`
