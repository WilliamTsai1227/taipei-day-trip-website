from module.connection_pool import connection_pool

class Order:
    @staticmethod
    def search_booking_information(user_id):
        conn = None
        cursor = None
        try:
            conn = connection_pool.get_connection()
            cursor = conn.cursor(dictionary=True)
            find_booking = "SELECT * FROM booking WHERE user_id = %s"
            cursor.execute(find_booking, (user_id,))    
            result=cursor.fetchone()
            return result
        except Exception as e:
            raise ValueError(f"search_booking_information database error: {e}") 
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()


    @staticmethod
    def create_new_order(user_id, attraction_id, order_number, price, pay_status, date, time, name, email, phone):
        conn = None
        cursor = None
        try:
            conn = connection_pool.get_connection()
            cursor = conn.cursor()
            new_order = """INSERT INTO 
                        orders(user_id, attraction_id, order_number, price, pay_status, date, time, name, email, phone)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
            newdata = (user_id, attraction_id, order_number, price, pay_status, date, time, name, email, phone)
            cursor.execute(new_order, newdata)
            conn.commit()
        except Exception as e:
            raise ValueError(f"create_new_order database error: {e}") 
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    @staticmethod
    def order_paystatus_change(order_number):
        conn = None
        cursor = None
        try:
            conn = connection_pool.get_connection()
            cursor = conn.cursor()
            pay_order = "UPDATE orders SET pay_status = 0 WHERE order_number = %s;"
            cursor.execute(pay_order, (order_number,))
            conn.commit()
        except Exception as e:
            raise ValueError(f"order_paystatus_change database error: {e}") 
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()


    @staticmethod
    def get_order_information(order_number):
        conn = None
        cursor = None
        try:
            conn = connection_pool.get_connection()
            with conn.cursor(dictionary=True,buffered=True) as cursor:
                cursor.execute(
                    """
                        SELECT
                            orders.price, orders.date, orders.time, orders.name AS contact_name,
                            orders.email, orders.phone, orders.pay_status, 
                            attractions.id, attractions.name, 
                            attractions.address, images.image_url
                        FROM orders 
                        INNER JOIN attractions ON orders.attraction_id = attractions.id
                        INNER JOIN images ON attractions.id = images.attractions_id
                        WHERE order_number = %s
                    """,
                    (order_number,)
                )
                result=cursor.fetchone()
                return result
        except Exception as e:
            raise ValueError(f"get_order_information database error: {e}")  
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()



    