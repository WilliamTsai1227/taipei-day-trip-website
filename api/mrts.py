from fastapi import *
from mysql.connector import pooling
from fastapi import APIRouter


# 建立connection_pool
db_config = {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "12345678",
    "database": "taipei_day_trip_website",
}


connection_pool = pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=10,
    **db_config
)
#

#使用 APIRouter()
mrts = APIRouter()


@mrts.get("/api/mrts")
async def get_mrts():
    try:
        conn = connection_pool.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
                SELECT mrt
                FROM attractions
                GROUP BY mrt
                ORDER BY COUNT(*) DESC;
            """
            )  
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        station_names = [item[0] for item in result]
        return {"data": station_names}
    except Exception as e:
        print("Caught exception:", e)
        return {"error": True, "message": str(e)}
    

#http://127.0.0.1:8000/api/mrts




"""
    SELECT mrt, COUNT(*) AS count
    FROM attractions
    GROUP BY mrt
    ORDER BY count DESC;
"""