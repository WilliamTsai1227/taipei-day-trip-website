from module.connection_pool import connection_pool
import re


"""Format validation"""

# Name format verification, must be in Chinese or English, at least two characters
def check_name_format(name):
    name_pattern = r'^[\u4e00-\u9fa5A-Za-z\s]{2,}$'
    return bool(re.match(name_pattern, name))

# Account (email) format verification
def check_account_format(account):
    account_pattern = r'\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}'
    return bool(re.match(account_pattern, account))

# Password format verification, can only be numbers and letters, at least eight characters.
def check_password_format(password):
    password_pattern = r'^[A-Za-z0-9]{8,}$'
    return bool(re.match(password_pattern, password))

"""Registration and login process"""

# User registration
def signup_new_user(name, account, password):
    try:
        conn = connection_pool.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO member (name, account, password) VALUES (%s, %s, %s)
            """,
            (name, account, password)
        )
        conn.commit()
        return True
    except Exception as e:
        print(f"signup database error: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

# Check if the account has already been registered
def signup_check(account):
    try:
        conn = connection_pool.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT * FROM member WHERE account = %s
            """,
            (account,)
        )
        result = cursor.fetchone()  
        return bool(result)  #It will return true if the same account is found (matching)
    finally:
        cursor.close()
        conn.close()

# Login verification (whether the account and password match)
def signin_check(account, password):
    try:
        conn = connection_pool.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT * FROM member WHERE account = %s AND password = %s
            """,
            (account, password)
        )
        result = cursor.fetchone()  
        return result #It will return None if the same account (match) is not found.
    except Exception as e:
        print(f"signin database error: {e}")
        return False
    finally:
        cursor.close()
        conn.close()








