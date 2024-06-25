FROM oven/bun:1.1.15
WORKDIR /app
COPY . .
RUN bun install

ARG PORT
EXPOSE ${PORT:-3000}

CMD ["bun", "src/index.ts"]