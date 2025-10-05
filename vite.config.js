build: {
  outDir: 'public',
  chunkSizeWarningLimit: 600, // Increase warning limit
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        charts: ['recharts']
      }
    }
  }
}
