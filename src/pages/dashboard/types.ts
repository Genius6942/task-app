type cardState = { id: number; text: string; color: string }
type colState = { id: number; title: string; color: string, items: cardState[] }

export type { cardState, colState };