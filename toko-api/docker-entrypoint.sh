#!/bin/bash

echo "🚀 Starting Laravel..."

# Wait for database
until nc -z $DB_HOST $DB_PORT; do
    sleep 2
done

echo "✅ Database ready!"

# Fix Laravel issue - remove problem files
rm -rf bootstrap/cache/services.php
rm -rf bootstrap/cache/packages.php

# Generate key
php artisan key:generate --force

# SEEDER DATABASE (INI YANG ANDA MAU!)
echo "🗄️ Seeding database..."
php artisan migrate:refresh --seed --force

echo "🎉 Database seeded!"
echo "🌐 Starting API server..."

# Start Laravel API server
php artisan serve --host=0.0.0.0 --port=8000