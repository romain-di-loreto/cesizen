#!/bin/sh

# if [ "$NODE_ENV" = "development" ]; then
#   npm install
# fi

npm install
apk add --no-cache postgresql-client


echo "Waiting for DB..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME"; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

php artisan config:clear
php artisan cache:clear
php artisan config:cache
php artisan migrate --force  || true
php artisan db:seed 

exec "$@"