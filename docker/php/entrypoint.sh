#!/bin/sh

npm install
apk add --no-cache postgresql-client


echo "Waiting for DB..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME"; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

php artisan config:clear
php artisan key:generate
php artisan migrate --force  || true
php artisan cache:clear
php artisan config:cache
php artisan db:seed 

npm run build

exec "$@"