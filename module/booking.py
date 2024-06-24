
from module.connection_pool import connection_pool
import re
import datetime
from datetime import timezone

class Book:
    @staticmethod
    def find_member_booking(user_id):
        try:
            conn = connection_pool.get_connection()
            with conn.cursor(dictionary=True) as cursor:
                cursor.execute(
                    """
                    SELECT attractions.id, attractions.name, attractions.address,
                    booking.date, booking.time, booking.price, images.image_url 
                    FROM attractions 
                    INNER JOIN booking ON attractions.id = booking.attraction_id
                    INNER JOIN images ON attractions.id = images.attractions_id 
                    WHERE booking.user_id = %s
                    """,
                    (user_id,)
                )
                result = cursor.fetchone()
                return result
        except Exception as e:
            raise ValueError(f"find member booking database error: {e}")
        finally:
            if conn:
                conn.close()


    @staticmethod
    def create_booking(user_id, attraction_id, date, time, price,status):
        try:
            conn = connection_pool.get_connection()
            cursor = conn.cursor()
            cursor.execute(                 #如果已經存在相同用戶的行程，用新的行程取代舊的
                """
                DELETE FROM booking
                WHERE user_id = %s 
                """,
                (user_id,)
            )
            cursor.execute(    #寫入預定
                """
                INSERT INTO booking (user_id, attraction_id, date, time, price,status)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (user_id, attraction_id, date, time, price, status)
            )
            conn.commit()
            return True
        except Exception as e:
            raise ValueError(f"create booking database error:{e}")
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def delete_booking(user_id):
        try:
            conn = connection_pool.get_connection()
            cursor = conn.cursor()
            cursor.execute(
                """
                DELETE FROM booking
                WHERE user_id = %s 
                """,
                (user_id,)
            )
            conn.commit()
            return True
        except Exception as e:
            raise ValueError(f'delete booking database error:{e}')
        finally:
            cursor.close()
            conn.close()
