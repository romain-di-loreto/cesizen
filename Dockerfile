# Stage 1: Builder
FROM php:8.3-cli-alpine AS builder

LABEL org.opencontainers.image.source=https://github.com/your-org/your-php-project

# Install dependencies (Composer, Git, Node.js, etc.)
RUN apk add --no-cache curl git unzip nodejs npm \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
    

# Set working directory and copy project files
WORKDIR /app
COPY . /app/
COPY ./shared.env /app/.env

# Install PHP dependencies
RUN npm install
RUN composer install --no-dev --optimize-autoloader
RUN npm run build

# Optional Laravel-specific: cache config/routes
# RUN php artisan config:cache && php artisan route:cache

# Stage 2: Runtime
FROM php:8.3-cli-alpine AS php

# Install runtime deps
RUN apk add --no-cache bash

WORKDIR /app

# Copy built app
COPY --from=builder /app /app

# Expose port used by php artisan serve
EXPOSE 8000

# Add entrypoint script
COPY docker/php/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

ENTRYPOINT ["entrypoint"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]