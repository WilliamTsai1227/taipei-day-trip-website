from fastapi import APIRouter, Request, HTTPException,Depends
from fastapi.responses import JSONResponse
from module.user import *
from pydantic import BaseModel, Field
import jwt
from fastapi.security import OAuth2PasswordBearer




# 使用 APIRouter()
user = APIRouter()

class PageQuery(BaseModel):
    page: int = Field(default=0, ge=0)

"""註冊會員"""

@user.post("/api/user")
async def register(request: Request):
    try:
        data = await request.json() #等待來自前端的json數據
        name = data["name"]
        account = data["email"]
        password = data["password"]
        #使用.strip()去除尾首來確認輸入是否真為空白
        if name.strip() == "" or account.strip() == "" or password.strip() == "":
            response = {"error":True , "message": "註冊欄位不得為空白"}
            return JSONResponse(content = response, status_code = 400)
        #輸入格式驗證
        if check_name_format(name) is False:
            response = {"error": True, "message": "姓名格式不正確，請輸入中文或英文，至少兩個字元"}
            return JSONResponse(content = response, status_code = 400)
        if check_account_format(account) is False:
            response = {"error": True, "message": "Email 格式不正確"}
            return JSONResponse(content = response, status_code=400)
        if check_password_format(password) is False:
            response = {"error": True, "message": "密碼格式不正確"}
            return JSONResponse(content=response, status_code=400)
        #檢查帳號是否註冊過
        if signup_check(account) is True:
            response = {"error": True , "message":"此帳號(email)已註冊過"}
            return JSONResponse(content=response, status_code=400)
        

        #以上檢查都沒問題即可註冊會員帳號
        if signup_new_user(name, account, password) is True: #註冊成功
            response = {"ok": True}
            return JSONResponse(content=response, status_code=200)
        else:                                                       
            response = {"error":True , "message": "註冊帳號時系統錯誤"}  #註冊失敗
            return JSONResponse(content = response , status_code = 500)

    except Exception as e:
        response = {"error":True , "message": str(e)}
        return JSONResponse(content = response , status_code = 500)



"""登入會員帳戶"""

@user.put("/api/user/auth")
async def login_process(request: Request):
    try:
        data = await request.json() #等待來自前端的json數據
        if data =="" or data["email"] ==""  or data["password"] =="" :
            response = {"error":True , "message": "json數據空白"}
            return JSONResponse(content = response, status_code = 400)
        account = data["email"]
        password = data["password"]
            #使用.strip()去除尾首來確認輸入是否真為空白
        if account.strip() == "" or password.strip() == "":
            response = {"error":True , "message": "註冊欄位不得為空白"}
            return JSONResponse(content = response, status_code = 400)
        #輸入格式驗證
        if check_account_format(account) is False:
            response = {"error": True, "message": "Email 格式不正確"}
            return JSONResponse(content = response, status_code=400)
        if check_password_format(password) is False:
            response = {"error": True, "message": "密碼格式不正確"}
            return JSONResponse(content=response, status_code=400)

        #登入程序
        user_data = signin_check(account, password)
        if user_data is None:
            response = {"error": True,"message": "帳號或密碼錯誤"}
            return JSONResponse(content=response, status_code=400)
        if user_data is False:
            response = {"error": True,"message": "Database登入程序伺服器運作錯誤"}
            return JSONResponse(content=response, status_code=500)
        
        #獲取登入使用者database 資料包裝成token
        user_id =  user_data[0]
        name = user_data[1]
        account = user_data[2]
        token = JWT_token_make(user_id,name,account)
        if token is not False:        #成功包裝成token
            response = {"token": token}
            return JSONResponse(content=response, status_code=200)
        else:
            response = {"error": True,"message": "token程序伺服器運作錯誤"}
            return JSONResponse(content=response, status_code=500)
        
    except Exception as e:
        response = {"error":True , "message": str(e)}
        return JSONResponse(content = response , status_code = 500)


"""取得當前登入的會員資訊"""    
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
@user.get("/api/user/auth")
async def get_user_info(request: Request, token: str = Depends(oauth2_scheme)):
    SECRET_KEY = "secret"
    ALGORITHM = "HS256"
    try:
        if decode_jwt(token) is None:
            response = {
                "data": None
            }
            return JSONResponse(content=response, status_code=200)
        payload = decode_jwt(token)
        user_id = payload.get("user_id")
        name = payload.get("name")
        account = payload.get("account")
        response = {
            "data": {
                "id": user_id,
                "name": name,
                "email": account
            }
        }
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        response = {"error":True , "message": str(e)}
        return JSONResponse(content = response , status_code = 500)
    