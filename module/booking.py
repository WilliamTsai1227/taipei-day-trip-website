
from module.connection_pool import connection_pool
import re



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
            cursor.execute(                 #If a trip for the same user already exists, replace the old one with the new one.
                """
                DELETE FROM booking
                WHERE user_id = %s 
                """,
                (user_id,)
            )
            cursor.execute(    #write reservation
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
        """Verify that attraction_id is a number and in the range of 1 to 58"""
        if isinstance(attraction_id, int) and 1 <= attraction_id <= 58:
            return True
        return False

    @staticmethod
    def validate_price(price):
        """Verify that price is a number and is 2000 or 2500"""
        if isinstance(price, int) and price in [2000, 2500]:
            return True
        return False

    @staticmethod
    def validate_date(date):
        """Verify that date is in the format '2024-01-08' and confirm whether the input is a string"""
        if not isinstance(date, str):
            return False
        date_pattern = re.compile(r"^\d{4}-\d{2}-\d{2}$")
        if date_pattern.match(date):
            return True
        return False
    
    @staticmethod
    def validate_time(time):
        """Verify that time is 'morning' or 'afternoon' and confirm whether the input is a string"""
        if not isinstance(time, str):
            return False
        if time in ["morning", "afternoon"]:
            return True
        return False
