#!/bin/bash
set -e

# ------------------------------
# Laravel container startup script
# ------------------------------

# Ensure SQLite database file exists
DB_PATH="database/database.sqlite"
if [ ! -f "$DB_PATH" ]; then
    echo "Creating SQLite database file..."
    mkdir -p database
    touch "$DB_PATH"
    chmod 777 "$DB_PATH"
fi

# Run Laravel commands
echo "Running storage link..."
php artisan storage:link || true   # skip if already exists

echo "Running migrations and seeding..."
php artisan migrate:fresh --force --seed

# Start Laravel development server
# Bind to 0.0.0.0 so it's accessible outside the container
echo "Starting Laravel server on port 8000..."
exec php artisan serve --host=0.0.0.0 --port=8000
