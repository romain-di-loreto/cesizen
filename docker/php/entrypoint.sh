#!/bin/sh

# if [ "$NODE_ENV" = "development" ]; then
#   npm install
# fi

npm install

echo "Waiting for DB..."
until nc -z db 5432; do
  sleep 1
done

php artisan migrate --force
php artisan db:seed

exec "$@"