from fastapi import HTTPException
from pydantic import BaseModel,Field
from module.connection_pool import connection_pool

class PageQuery(BaseModel):
    page: int = Field(default=0 , ge=0)

class Attraction:
    @staticmethod
    def find_all_keyword_attractions(keyword,query_page):
        try:
            conn = connection_pool.get_connection()
            cursor = conn.cursor()
        except Exception as e:
            raise ValueError(f"attraction module get database connection error (keyword_attractions): {e}")
        try:
            keyword_pattern = f"%{keyword}"
            cursor.excute(
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
            result = cursor.fetchall()
            return result
        except Exception as e:
            raise ValueError(f"attraction module search database error(keyword_attractions): {e}")
        finally:
            if 'cursor' in locals() and cursor is not None:
                cursor.close()
            if 'conn' in locals() and conn is not None:
                conn.close()
    
    @staticmethod
    def find_all_attractions(query_page):
        try:
            conn = connection_pool.get_connection()
            cursor = conn.cursor()
        except Exception as e:
            raise ValueError(f"attraction module get database connection error(all_attractions): {e}")
        try:
            cursor.excute(
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
            return result
        except Exception as e:
            raise ValueError(f"attraction module search database error(all_attractions): {e}")
        finally:
            if 'cursor' in locals() and cursor is not None:
                cursor.close()
            if 'conn' in locals() and conn is not None:
                conn.close()

    @staticmethod
    def find_id_attraction(attractionId):
        try:
            conn = connection_pool.get_connection()
            cursor = conn.cursor()
            # set group_concat_max_len
            #Avoid returning too long data from being truncated
            cursor.execute("SET SESSION group_concat_max_len = 10000;")
        except Exception as e:
            raise HTTPException(status_code=500, detail="Database connect failed.")
        try:
            cursor.excute(
                """
                    SELECT a.*, GROUP_CONCAT(i.image_url) AS image_urls 
                    FROM attractions a 
                    LEFT JOIN images i ON a.id = i.attractions_id 
                    WHERE a.id = %s 
                    GROUP BY a.id 
                """,
                (attractionId,)
            )
            result = cursor.fetchone()
            return result
        except Exception as e:
            raise ValueError(f"attraction module search database error(id_attraction){e}")
        finally:
            if 'cursor' in locals() and cursor is not None:
                cursor.close()
            if 'conn' in locals() and conn is not None:
                conn.close()


