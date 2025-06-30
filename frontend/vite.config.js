export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        headers: {
            "Cross-Origin-Embedder-Policy": "require-corp",
            "Cross-Origin-Opener-Policy": "same-origin"
        },
        proxy: {
            '/cdn': {
                target: 'https://unpkg.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/cdn/, '')
            }
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom']
                }
            }
        }
    },
    optimizeDeps: {
        include: ['@webcontainer/api'],
    },
    define: {
        'process.env': {}
    },
    resolve: {
        alias: {
            // If needed, resolve aliases for dependencies
        }
    }
});
