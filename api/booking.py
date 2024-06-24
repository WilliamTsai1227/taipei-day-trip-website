from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from module.JWT import decode_jwt  # 确保正确导入
from module.booking import Book  # 确保正确导入

# 使用 APIRouter()
router = APIRouter()  # 确保使用不同的名字，避免冲突
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

"""取得尚未確認下單的預定行程"""
@router.get("/api/booking")
async def get_user_booking(token: str = Depends(oauth2_scheme)):
    SECRET_KEY = "secret"
    ALGORITHM = "HS256"
    try:
        payload = decode_jwt(token)
        if payload is None:
            response = {"error": True, "message": "未登入系統,token驗證失敗"}
            return JSONResponse(content=response, status_code=403)
        
        user_id = payload.get("user_id")
        data = Book.find_member_booking(user_id)
        if data:
            response = {
                "data":{
                    "attraction":{
                        "id":data.get("id"),
                        "name":data.get("name"),
                        "address":data.get("address"),
                        "image":data.get("image_url")[0] if data.get("image_url") else None
                    },
                    "date":data.get("date"),
                    "time":data.get("time"),
                    "price":data.get("price")
                }
            }
            return JSONResponse(content=response, status_code=200)
        if not data:
            response = {"data":None}
            return JSONResponse(content=response, status_code=200)

    except Exception as e:
        response = {"error": True, "message": str(e)}
        return JSONResponse(content=response, status_code=500)

"""建立新的預定行程"""
@router.post("/api/booking")
async def create_booking(request: Request, token: str = Depends(oauth2_scheme)):
    SECRET_KEY = "secret"
    ALGORITHM = "HS256"
    try:
        data = await request.json()  # 等待來自前端的json數據
        if data == {}:  # 檢查是否接收到请求數據
            response = {"error": True, "message": "Request data not received."}
            return JSONResponse(content=response, status_code=400)
        #這裡要在做一些前端Request格式驗證
        
        payload = decode_jwt(token)
        if payload is None:
            response = {"error": True, "message": "未登入系統,token驗證失敗"}
            return JSONResponse(content=response, status_code=403)
        
        # token 解碼
        user_id = payload.get("user_id")
        name = payload.get("name")
        account = payload.get("account")
        
        # request 解析
        attraction_id = data["attractionId"]
        date = data["date"]
        time = data["time"]
        price = data["price"]
        status = "unpaid" #設定booking 行程為"unpaid"狀態
        
        booking_result = Book.create_booking(user_id, attraction_id, date, time, price,status)
        if booking_result:
            response = {"ok": True}
            return JSONResponse(content=response, status_code=200)

    except Exception as e:
        response = {"error": True, "message": str(e)}
        return JSONResponse(content=response, status_code=500)

"""刪除目前預定的行程"""
@router.delete("/api/booking")
async def delete_booking(token: str = Depends(oauth2_scheme)):
    try:
        payload = decode_jwt(token)
        if payload is None:
            response = {"error": True, "message": "未登入系統,拒絕存取"}
            return JSONResponse(content=response, status_code=403)
        
        user_id = payload.get("user_id") #從解碼的token 中拿到user_id
        
        delete_result = Book.delete_booking(user_id)
        if delete_result: #如果delete_booking(user_id)出錯會顯示status_code:500 'delete booking database data error.'
            response = {"ok": True}
            return JSONResponse(content=response, status_code=200)
    except Exception as e:
        response = {"error": True, "message": str(e)}
        return JSONResponse(content=response, status_code=500)
