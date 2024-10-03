import os
from dotenv import load_dotenv
from mysql.connector import pooling

# Load environment variables from .env file
load_dotenv()

# Retrieve database config from environment variables
db_config = {
    "host": os.getenv("DB_HOST"),
    "port": int(os.getenv("DB_PORT")),  # convert port to integer
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME"),
}

# Create connection_pool
connection_pool = pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=10,
    **db_config
)