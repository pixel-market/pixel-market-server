# Installing

1. npx prisma init
2. Update .env DATABASE_URL by docker-compose.yaml

# Starting

1. Start Docker Desktop
2. docker-compose up
3. yarn start:dev
4. npx prisma studio

# Migration DB

1. npx prisma migrate dev --create-only
2. npx prisma db push
