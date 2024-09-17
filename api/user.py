from fastapi import APIRouter, Request, HTTPException,Depends
from fastapi.responses import JSONResponse
from module.user import *
from module.JWT import *
from pydantic import BaseModel, Field
from fastapi.security import OAuth2PasswordBearer





user = APIRouter()

class PageQuery(BaseModel):
    page: int = Field(default=0, ge=0)

"""Register as a member"""

@user.post("/api/user")
async def register(request: Request):
    try:
        data = await request.json() 
        name = data["name"]
        account = data["email"]
        password = data["password"]
        #Use .strip() to remove the tail and header to confirm whether the input is really blank
        if name.strip() == "" or account.strip() == "" or password.strip() == "":
            response = {"error":True , "message": "註冊欄位不得為空白"}
            return JSONResponse(content = response, status_code = 400)
        #Input format validation
        if check_name_format(name) is False:
            response = {"error": True, "message": "姓名格式不正確，請輸入中文或英文，至少兩個字元"}
            return JSONResponse(content = response, status_code = 400)
        if check_account_format(account) is False:
            response = {"error": True, "message": "Email 格式不正確"}
            return JSONResponse(content = response, status_code=400)
        if check_password_format(password) is False:
            response = {"error": True, "message": "密碼格式不正確"}
            return JSONResponse(content=response, status_code=400)
        #Check whether the account has been registered
        if signup_check(account) is True:
            response = {"error": True , "message":"此帳號(email)已註冊過"}
            return JSONResponse(content=response, status_code=400)
        

        #If there is no problem with the above checks, you can register a member account
        if signup_new_user(name, account, password) is True: #Registration successful
            response = {"ok": True}
            return JSONResponse(content=response, status_code=200)
        else:                                                       
            response = {"error":True , "message": "註冊帳號時系統錯誤"}  #Registration failed
            return JSONResponse(content = response , status_code = 500)

    except Exception as e:
        response = {"error":True , "message": str(e)}
        return JSONResponse(content = response , status_code = 500)



"""Log in to member account"""

@user.put("/api/user/auth")
async def login_process(request: Request):
    try:
        data = await request.json() 
        if data =="" or data["email"] ==""  or data["password"] =="" :
            response = {"error":True , "message": "json數據空白"}
            return JSONResponse(content = response, status_code = 400)
        account = data["email"]
        password = data["password"]
        #Use .strip() to remove the tail and header to confirm whether the input is really blank
        if account.strip() == "" or password.strip() == "":
            response = {"error":True , "message": "註冊欄位不得為空白"}
            return JSONResponse(content = response, status_code = 400)
        #Input format validation
        if check_account_format(account) is False:
            response = {"error": True, "message": "Email 格式不正確"}
            return JSONResponse(content = response, status_code=400)
        if check_password_format(password) is False:
            response = {"error": True, "message": "密碼格式不正確"}
            return JSONResponse(content=response, status_code=400)

        #Login procedure
        user_data = signin_check(account, password)
        if user_data is None:
            response = {"error": True,"message": "帳號或密碼錯誤"}
            return JSONResponse(content=response, status_code=400)
        if user_data is False:
            response = {"error": True,"message": "Database login procedure server error."}
            return JSONResponse(content=response, status_code=500)
        
        #Obtain the logged in user data and package the data into a token.
        user_id =  user_data[0]
        name = user_data[1]
        account = user_data[2]
        token = JWT_token_make(user_id,name,account)
        if token is not False:        #Successfully packaged into token
            response = {"token": token}
            return JSONResponse(content=response, status_code=200)
        else:
            response = {"error": True,"message": "token程序伺服器運作錯誤"}
            return JSONResponse(content=response, status_code=500)
        
    except Exception as e:
        response = {"error":True , "message": str(e)}
        return JSONResponse(content = response , status_code = 500)


"""Get the currently logged in member information"""    
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
    