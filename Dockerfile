FROM oven/bun:1.1.14
WORKDIR /app
COPY . .
RUN bun install

ARG PORT
EXPOSE ${PORT:-3000}

CMD ["bun", "src/index.js"]