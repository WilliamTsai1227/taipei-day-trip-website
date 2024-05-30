from fastapi import *
from mysql.connector import pooling



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
        try:
            conn = connection_pool.get_connection()
            cursor = conn.cursor()
        except Exception as e:
            raise HTTPException(status_code=500, detail="Database connect failed")
        try:
            cursor.execute(
                """
                    SELECT mrt
                    FROM attractions
                    GROUP BY mrt
                    ORDER BY COUNT(*) DESC;
                """
                )  
            result = cursor.fetchall()
        except Exception as e:
            # 數據庫查詢錯誤
            raise HTTPException(status_code=500, detail="Database query failed")
        station_names = [item[0] for item in result if item[0] is not None]
        return {"data": station_names}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")
        # raise HTTPException(status_code=500, detail=str(e))
    finally:
        # 確保關閉游標及連接
        if 'cursor' in locals() and cursor is not None:
            cursor.close()
        if 'conn' in locals() and conn is not None:
            conn.close()
    