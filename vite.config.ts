import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  console.log(`[Vite Config] Building configuration in ${mode} mode`);
  
  const config = {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
  };

  console.log('[Vite Config] Server configuration:', config.server);
  console.log('[Vite Config] Active plugins:', config.plugins);
  console.log('[Vite Config] Path aliases:', config.resolve.alias);
  console.log('[Vite Config] Build configuration:', config.build);

  return config;
});
