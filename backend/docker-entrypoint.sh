#!/bin/bash
set -e

# Ensure SQLite database file exists
if [ ! -f database/database.sqlite ]; then
    touch database/database.sqlite
    chmod 777 database/database.sqlite
fi

# Run Laravel commands
php artisan storage:link
php artisan migrate:fresh --force

# Start Laravel development server
# Bind to 0.0.0.0 so it's accessible outside the container
php artisan serve --host=0.0.0.0 --port=8000
