from database import *
import re


""" 驗證資料格式"""

#姓名驗證，只能是中文英文，至少兩個字元
#如果匹配會回傳一個match對象，如果沒有匹配則會回傳None
def check_name_format(name):
    name_pattern = r'^[\u4e00-\u9fa5A-Za-z\s]{2,}$'
    return re.match(name_pattern, name)

#email 格式驗證
def check_email_format(email):
    email_pattern = r'\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}'
    return re.match(email_pattern, email)

#密碼格式驗證，只能是英文或數字，至少八個位元
def check_password_format(password):
    password_pattern = r'^[A-Za-z0-9]{6,}$'
    return re.match(password_pattern, password)

"""註冊及檢查帳號密碼"""

# 註冊姓名、帳號、密碼

def signup_new_user(name,account,password):
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO member (name, email, password) VALUES (%s, %s, %s)
        """,
        (name, account, password)
    )
    cursor.close()

#註冊時檢查Email是否註冊過

def signup_check(email):
    cursor = conn.cursor()
    cursor.excute(
        """
        SELECT * FORM member WHERE email = %s
        """,
        (email,)
    )
    cursor.close()
    
#檢查帳號密碼是否正確

