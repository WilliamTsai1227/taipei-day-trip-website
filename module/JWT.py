import jwt
import datetime
from datetime import timezone



#Create token
def JWT_token_make(user_id,name,account):
    try:
        # Calculate the time after seven days
        expiration = datetime.datetime.now(tz=timezone.utc) + datetime.timedelta(days=7)

        # Include exp to set expiration time
        encoded_jwt = jwt.encode(
            {"user_id": user_id, "name": name, "account": account, "exp": expiration},
            "secret",
            algorithm="HS256"
        )
        return encoded_jwt
    except Exception as e:
        print(f"JWT_token procedure error: {e}")
        return False

# The function of Decode and verify token 
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