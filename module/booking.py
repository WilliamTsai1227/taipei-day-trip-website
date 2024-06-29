
from module.connection_pool import connection_pool
import re
import datetime
from datetime import timezone

class Book:
    @staticmethod
    def find_member_booking(user_id):
        try:
            conn = connection_pool.get_connection()
            with conn.cursor(dictionary=True,buffered=True) as cursor:
                cursor.execute(
                    """
                        SELECT attractions.id, attractions.name, attractions.address,
                        booking.`date`, booking.`time`, booking.price, images.image_url 
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

    @staticmethod
    def validate_attraction_id(attraction_id):
        """驗證 attraction_id 為數字且在 1～58 範圍"""
        if isinstance(attraction_id, int) and 1 <= attraction_id <= 58:
            return True
        return False

    @staticmethod
    def validate_price(price):
        """驗證 price 為數字且為 2000 或 2500"""
        if isinstance(price, int) and price in [2000, 2500]:
            return True
        return False

    @staticmethod
    def validate_date(date):
        """驗證 date 為 '2024-01-08' 這種格式，並確認輸入是否為字串"""
        if not isinstance(date, str):
            return False
        date_pattern = re.compile(r"^\d{4}-\d{2}-\d{2}$")
        if date_pattern.match(date):
            return True
        return False
    
    @staticmethod
    def validate_time(time):
        """驗證 time 為 'morning' 或 'afternoon'，並確認輸入是否為字串"""
        if not isinstance(time, str):
            return False
        if time in ["morning", "afternoon"]:
            return True
        return False
