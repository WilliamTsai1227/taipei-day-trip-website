
from module.connection_pool import connection_pool
import re
import jwt
import datetime
from datetime import timezone

class Book:
    @staticmethod
    def find_member_unpay_booking(user_id):
        try:
            conn = connection_pool.get_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                """
                SELECT * FROM booking
                WHERE user_id = %s AND status = 'unpaid'
                """,
                (user_id,)
            )
            result = cursor.fetchone()
            return result
        except Exception as e:
            print(f"booking database error: {e}")
            return False
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def create_booking(user_id, attraction_id, date, time, price,status):
        try:
            conn = connection_pool.get_connection()
            cursor = conn.cursor()
            cursor.execute(                 #如果已經存在相同的尚未付款行程用新的行程取代舊的
                """
                DELETE FROM booking
                WHERE user_id = %s AND attraction_id = %s AND date = %s AND time = %s AND status = 'unpaid'
                """,
                (user_id,attraction_id,date,time)
            )
            cursor.execute(
                """
                INSERT INTO booking (user_id, attraction_id, date, time, price,status)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (user_id, attraction_id, date, time, price, status)
            )
            conn.commit()
            return True
        except Exception as e:
            print(f"booking database error: {e}")
            return False
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def delete_booking(user_id, booking_id):
        try:
            conn = connection_pool.get_connection()
            cursor = conn.cursor()
            cursor.execute(
                """
                DELETE FROM booking
                WHERE user_id = %s AND booking_id = %s
                """,
                (user_id, booking_id)
            )
            conn.commit()
            return True
        except Exception as e:
            print(f"delete booking database data error: {e}")
            return False
        finally:
            cursor.close()
            conn.close()
