import { vi } from 'vitest'

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }) => `<img src="${src}" alt="${alt}" />`,
}))

// Mock your assets
vi.mock('../../assets/logo.png', () => ({
  __esModule: true,
  default: 'test-logo.png'
}))
vi.mock('../../assets/question.png', () => ({
  __ESPN: true,
  default: 'test-question.png'
}))