FROM node:18-slim

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --no-cache-dir pros-cli --break-system-packages || pip3 install --no-cache-dir pros-cli

WORKDIR /app

COPY package*.json ./
RUN npm install || true

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]