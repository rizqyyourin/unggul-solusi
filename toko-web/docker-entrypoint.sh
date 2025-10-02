#!/bin/sh

echo "🚀 Starting React App..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "🎉 React ready!"

# Start Vite dev server
npm run dev