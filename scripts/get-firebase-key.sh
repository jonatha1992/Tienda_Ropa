#!/bin/bash
# Script para obtener la Firebase Service Account Key para Railway

echo "=== Firebase Service Account Key para Railway ==="
echo ""
echo "Copia el siguiente JSON y pégalo en la variable FIREBASE_SERVICE_ACCOUNT_KEY en Railway:"
echo ""
echo "----------------------------------------"
cat backend/firebase_service_account.json | tr -d '\n\r'
echo ""
echo "----------------------------------------"
echo ""
echo "Nota: Es una sola línea JSON sin saltos de línea."
