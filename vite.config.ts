import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
VitePWA({
  registerType: 'autoUpdate',
  devOptions: {
    enabled: true,
  },
  manifest:{
    name: "Мероприятия музея МГТУ",
    short_name: "Музей МГТУ",
    start_url: "/events-app/",
    display: "standalone",
    background_color: "#fdfdfd",
    theme_color: "#db4938",
    orientation: "portrait-primary",
    icons: [
        {
            src: "/events-app/icons/512.png",
            type: "image/png", "sizes": "512x512"
        }
    ]
  }
})

export default defineConfig({
  plugins: [react(), mkcert(), VitePWA({})],
  base: "/events-app",
  server: {
    https:{
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    },
    // host: '192.168.56.101',
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:8000",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, "/"),
    //   },
    // },
    // port: 3000,
  },
});