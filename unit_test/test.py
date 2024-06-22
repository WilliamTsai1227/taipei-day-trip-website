import pytest
import jwt
from module.user import * 

def test_JWT_token_make():
    user_id = 1
    name = "william"
    account = "william@gmail.com"
    
    token = JWT_token_make(user_id, name, account)
    
    assert token is not None  # 检查 token 是否生成
    assert isinstance(token, str)  # 檢查 token 是否为字符串
    
    # 解碼和檢查token 内容
    decoded_token = jwt.decode(token, "secret", algorithms=["HS256"])
    
    assert decoded_token["user_id"] == user_id
    assert decoded_token["name"] == name
    assert decoded_token["account"] == account
    assert "exp" in decoded_token  # 檢查 token 是否包含過期時間



def test_decode_jwt_valid_token():
    user_id = 1999
    name = "kevinnn"
    account = "kevinnn@gmail.com"

    token = JWT_token_make(user_id, name, account)  # Token valid for 60 seconds
    decoded = decode_jwt(token)
    
    assert decoded is not None
    assert decoded["user_id"] == 1999
    assert decoded["name"] == "kevinnn"
    assert decoded["account"] == "kevinnn@gmail.com"


def test_decode_jwt_invalid_token():
    token = "this.is.an.invalid.token"
    decoded = decode_jwt(token)
    
    assert decoded is None