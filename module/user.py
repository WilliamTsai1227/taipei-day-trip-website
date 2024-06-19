from module.connection_pool import *
import re
import jwt
import datetime
from datetime import timezone


"""格式驗證"""

# 姓名格式驗證，必須是中文或英文，至少兩個字元
def check_name_format(name):
    name_pattern = r'^[\u4e00-\u9fa5A-Za-z\s]{2,}$'
    return bool(re.match(name_pattern, name))

# 帳號(email)格式驗證
def check_account_format(account):
    account_pattern = r'\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}'
    return bool(re.match(account_pattern, account))

# 密碼格式驗證，只能是數字及字母，至少八個字元
def check_password_format(password):
    password_pattern = r'^[A-Za-z0-9]{8,}$'
    return bool(re.match(password_pattern, password))

"""註冊及登入流程"""

# 用戶註冊
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

# 檢查帳號是否已註冊過
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
        return bool(result)  #result 有找到相同帳號(匹配)將return true
    finally:
        cursor.close()
        conn.close()

# 登入驗證（帳號密碼是否匹配）
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
        return result #result 若沒找到相同帳號(匹配)將return None
    except Exception as e:
        print(f"signin database error: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

"""登出流程"""
#登出
#  def signout(token):



"""token建立流程"""

#建立token
def JWT_token_make(user_id,name,account):
    try:
        # 計算七天後的時間
        expiration = datetime.datetime.now(tz=timezone.utc) + datetime.timedelta(days=7)

        # 包含 exp 來設置過期時間
        encoded_jwt = jwt.encode(
            {"user_id": user_id, "name": name, "account": account, "exp": expiration},
            "secret",
            algorithm="HS256"
        )
        return encoded_jwt
    except Exception as e:
        print(f"JWT_token procedure error: {e}")
        return False

# 解碼並驗證 token 的函數
def decode_jwt(token):
    try:
        decoded_jwt = jwt.decode(token, "secret", algorithms=["HS256"])
        return decoded_jwt
    except jwt.ExpiredSignatureError:
        print("Token has expired")
        return None
    except jwt.InvalidTokenError:
        print("Invalid token")
        return None




