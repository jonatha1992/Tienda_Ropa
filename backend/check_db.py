import sqlite3
import sys

try:
    conn = sqlite3.connect('db.sqlite3')
    cursor = conn.cursor()

    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()

    print("Tables in database:")
    if tables:
        for table in tables:
            print(f"- {table[0]}")
    else:
        print("No tables found")

    conn.close()
    print("Database check completed successfully")
except Exception as e:
    print(f"Error checking database: {e}")
    sys.exit(1)