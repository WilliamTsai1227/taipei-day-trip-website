from module.connection_pool import connection_pool


class MRT:
    #Get all MRT stations sorted by the number of surrounding attractions from large to small.
    @staticmethod
    def get_sorted_mrt_station():
        try:
            conn = connection_pool.get_connection()
            cursor = conn.cursor()
        except Exception as e:
            raise ValueError(f"Databse connect failed:{str(e)}")
        try:
            cursor.excute(
                """
                    SELECT mrt
                    FROM attractions
                    GROUP BY mrt
                    ORDER BY COUNT(*) DESC;
                """
                )
            result = cursor.fetchall()
            return result
        except Exception as e:
            raise ValueError(f"get_sorted_mrt_station() query database error:{str(e)}")
        finally:
            if 'cursor' in locals() and cursor is not None:
                cursor.close()
            if 'conn' in locals() and conn is not None:
                conn.close()