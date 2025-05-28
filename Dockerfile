# Gunakan image Node.js ringan berbasis Alpine Linux
FROM node:slim

# Install server web statis (http-server)
RUN npm install -g http-server

# Tentukan direktori kerja
WORKDIR /app

# Salin semua file ke dalam Docker image
COPY . .

# Buka port 8080 untuk akses dari browser
EXPOSE 8080

# Jalankan http-server untuk menyajikan file statis
CMD ["http-server", "-p", "8080"]
