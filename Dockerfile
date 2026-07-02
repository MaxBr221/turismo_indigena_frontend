# Estágio 1: Dependências e Compilação
FROM node:20-alpine AS builder
WORKDIR /app

# Copia os ficheiros de definição de pacotes
COPY package*.json ./

# Instala todas as dependências (incluindo as de desenvolvimento necessárias para o TypeScript)
RUN npm install

# Copia o restante código do teu projeto
COPY . .

# Desativa a telemetria do Next.js durante o build (opcional, torna o build mais rápido)
ENV NEXT_TELEMETRY_DISABLED 1

# Executa o build do Next.js (este comando vai ler o tsconfig.json e compilar tudo)
RUN npm run build

# Estágio 2: Runner de Produção (Imparável e super leve)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copia apenas os ficheiros necessários para correr o servidor Next.js em produção
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Comando para iniciar o Next.js em modo de produção
CMD ["npm", "run", "start"]