from fastapi import *
from mysql.connector import pooling
from pydantic import BaseModel,Field
from module.connection_pool import *

# 建立connection_pool
# db_config = {
#     "host": "localhost",
#     "port": 3306,
#     "user": "root",
#     "password": "12345678",
#     "database": "taipei_day_trip_website",
# }


# connection_pool = pooling.MySQLConnectionPool(
#     pool_name="mypool",
#     pool_size=10,
#     **db_config
# )
#使用 APIRouter()
attractions = APIRouter()

class PageQuery(BaseModel):
    page: int = Field(default=0, ge=0)

@attractions.get("/api/attractions")
async def get_attractions(page: int = Query(0, ge=0), keyword: str = None):
    try:
        try:
            conn = connection_pool.get_connection()
            cursor = conn.cursor()
            query_page = page * 12
        except Exception as e:
            raise HTTPException(status_code=500, detail="Database connect failed")
        try:
            if keyword:
                keyword_pattern = f"%{keyword}%"
                cursor.execute(
                    """
                    SELECT a.*, GROUP_CONCAT(i.image_url) AS image_urls 
                    FROM attractions a 
                    LEFT JOIN images i ON a.id = i.attractions_id 
                    WHERE a.name LIKE %s OR a.mrt = %s 
                    GROUP BY a.id 
                    LIMIT %s, 12
                    """,
                    (keyword_pattern, keyword, query_page)
                )
            else:
                cursor.execute(
                    """
                    SELECT a.*, GROUP_CONCAT(i.image_url) AS image_urls 
                    FROM attractions a 
                    LEFT JOIN images i ON a.id = i.attractions_id 
                    GROUP BY a.id 
                    LIMIT %s, 12
                    """,
                    (query_page,)
                )
            result = cursor.fetchall()
        except Exception as e:
            # 數據庫查詢錯誤
            raise HTTPException(status_code=500, detail="Database query failed")
        try:
            # 格式化查詢結果
            formatted_result = []
            for row in result:
                images = row[9].split(',') if row[9] else []
                formatted_row = {
                    "id": row[0],
                    "name": row[1],
                    "category": row[2],
                    "description": row[3],
                    "address": row[4],
                    "transport": row[5],
                    "mrt": row[6],
                    "lat": row[7],
                    "lng": row[8],
                    'images': images
                }
                formatted_result.append(formatted_row)
            return {"nextPage": page + 1 if len(result) == 12 else None,"data": formatted_result}
        except Exception as e:
            # Data formatting錯誤
            raise HTTPException(status_code=500, detail="Data formatting failed")    
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")
        # raise HTTPException(status_code=500, detail=str(e))
    finally:
        # 確保關閉游標及連接
        if 'cursor' in locals() and cursor is not None:
            cursor.close()
        if 'conn' in locals() and conn is not None:
            conn.close()

@attractions.get("/api/attraction/{attractionId}")
async def get_attraction(attractionId: int = None):
    if not (1 <= attractionId <= 58):
        raise HTTPException(status_code=400, detail="attractionId not in range.")
    try:
        try:
            conn = connection_pool.get_connection()
            cursor = conn.cursor()
            
            # 设置 group_concat_max_len
            cursor.execute("SET SESSION group_concat_max_len = 10000;")
        except Exception as e:
            raise HTTPException(status_code=500, detail="Database connect failed")
        try:
            if attractionId:
                cursor.execute(
                    """
                    SELECT a.*, GROUP_CONCAT(i.image_url) AS image_urls 
                    FROM attractions a 
                    LEFT JOIN images i ON a.id = i.attractions_id 
                    WHERE a.id = %s 
                    GROUP BY a.id 
                    """,
                    (attractionId,)
                )
            else:
                return {"error": True, "message": "attractionId empty"}
            result = cursor.fetchone()
        except Exception as e:
            # 數據庫查詢錯誤
            raise HTTPException(status_code=500, detail="Database query failed")
        try:
            # 格式化查詢結果
            images = result[9].split(',') if result[9] else []
            formatted_row = {
                "id": result[0],
                "name": result[1],
                "category": result[2],
                "description": result[3],
                "address": result[4],
                "transport": result[5],
                "mrt": result[6],
                "lat": result[7],
                "lng": result[8],
                'images': images
            }
            return {"data": formatted_row}
        except Exception as e:
            # Data formatting錯誤
            raise HTTPException(status_code=500, detail="Data formatting failed") 
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")
        # raise HTTPException(status_code=500, detail=str(e))
    finally:
        # 確保關閉游標及連接
        if 'cursor' in locals() and cursor is not None:
            cursor.close()
        if 'conn' in locals() and conn is not None:
            conn.close()