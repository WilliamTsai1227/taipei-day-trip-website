from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse

from pydantic import BaseModel, Field



# 使用 APIRouter()
user = APIRouter()

class PageQuery(BaseModel):
    page: int = Field(default=0, ge=0)

@user.post("/api/user")
async def register(request: Request):
    data = await request.json() #等待來自前端的json數據
    name = data["name"]
    email = data["email"]
    password = data["password"]
    try:
        #使用.strip()去除尾首來確認輸入是否真為空白
        if name.strip() == "" or email.strip() == "" or password.strip() == "":
            response = {"error":True , "message": "註冊欄位不得為空白"}
            return JSONResponse(content = response, status_code = 400)
        
    except Exception as e:
        response = {"error":True , "message": str(e)}
        return JSONResponse(content = response , status_code = 500)
    



    

# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel, EmailStr

# app = FastAPI()

# class User(BaseModel):
#     name: str
#     email: EmailStr
#     password: str

# @app.post("/api/user", status_code=200)
# async def create_user(user: User):
#     #從前端javascript拿到json格式資料
#     message_data = await request.json()
#     # 假设这里有一些逻辑去检查用户是否已经存在
#     # 例如，查询数据库
#     user_exists = False  # 这里应该是实际的数据库查询结果
    
#     if user_exists:
#         raise HTTPException(status_code=400, detail={"error": True, "message": "重複的 Email"})
    
#     # 其他业务逻辑
#     try:
#         # 假设这里有创建用户的逻辑，例如插入数据库
#         pass
#     except Exception as e:
#         raise HTTPException(status_code=500, detail={"error": True, "message": str(e)})

#     return {"ok": True}