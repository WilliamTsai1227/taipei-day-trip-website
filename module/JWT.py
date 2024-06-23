import jwt
import datetime
from datetime import timezone



"""token流程"""

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