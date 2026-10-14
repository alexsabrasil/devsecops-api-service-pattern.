# Estágio 1: preparação das dependências
FROM node:22 AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev


# Estágio 2: imagem de execução
FROM node:22-alpine AS runtime

# Remove ferramentas desnecessárias no runtime
RUN rm -rf /usr/local/lib/node_modules/npm \
           /usr/local/lib/node_modules/corepack \
           /opt/yarn \
           /usr/local/bin/npm \
           /usr/local/bin/npx \
           /usr/local/bin/corepack \
           /usr/local/bin/yarn \
           /usr/local/bin/yarnpkg

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=builder --chown=node:node \
    /usr/src/app/node_modules ./node_modules

COPY --chown=node:node package*.json ./
COPY --chown=node:node src ./src

USER node

EXPOSE 3000

CMD ["node", "src/index.js"]
