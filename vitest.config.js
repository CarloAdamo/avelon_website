import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// The React plugin gives the automatic JSX runtime, so .test.jsx files need no React import.
export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/**/*.test.{js,jsx}'],
    environment: 'node',
  },
});
