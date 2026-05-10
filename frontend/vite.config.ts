import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Split heavy vendor deps into their own parallel-loadable chunks.
    // Without this, Vite dumped framer-motion + radix-ui into whichever
    // lazy chunk happened to import them first (StoreFooter, ~218KB),
    // putting that chunk on the critical path. Splitting them out lets
    // the browser fetch them in parallel with the page code.
    modulePreload: {
      // Vite normally emits modulepreload hints for every transitive
      // dependency of every lazy chunk. That defeats lazy-loading for
      // the radix bundle: even though <UserMenu> and <Toaster> are only
      // imported on demand, vendor-radix (~114KB / ~33KB gzipped) was
      // still preloaded on initial page load. Filter it out so it only
      // downloads when the lazy chunk actually executes.
      resolveDependencies: (_filename, deps) =>
        deps.filter((d) => !d.includes('vendor-radix-menu')),
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          // Toaster is mounted at App-level (renders nothing until a
          // toast fires, but React.lazy still triggers the import on
          // mount), so its chunk loads eagerly. Keep just react-toast
          // here (~15KB) and put the heavier dropdown/avatar bundles
          // in vendor-radix-menu which only loads when an authed user
          // opens the avatar.
          'vendor-radix-toast': ['@radix-ui/react-toast'],
          'vendor-radix-menu': [
            '@radix-ui/react-avatar',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
          ],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
