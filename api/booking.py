from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from module.JWT import decode_jwt  
from module.booking import Book  
import json

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
            response = {"error": True, "message": "未登入系統,拒絕存取"}
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
                        "image":data.get("image_url")
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
        payload = decode_jwt(token)
        if payload is None:
            response = {"error": True, "message": "未登入系統,拒絕存取"}
            return JSONResponse(content=response, status_code=403)
        
        # token 解碼
        user_id = payload.get("user_id")

        #處理json數據
        try:
            data = await request.json()  
        except json.JSONDecodeError:            # 在 JSON 解析(格式)出錯的情況下，返回 400 錯誤碼
            response = {"error": True, "message": "Invalid JSON format."}
            return JSONResponse(content=response, status_code=400)
        
        if data == {}:  # 檢查是否接收到请求數據
            response = {"error": True, "message": "Request data not received."}
            return JSONResponse(content=response, status_code=400)
        # request 解析
        attraction_id = data["attractionId"]
        date = data["date"]
        time = data["time"]
        price = data["price"]
        status = "unpaid"               #設定booking 行程為"unpaid"狀態
                     
        #前端Request格式驗證
        if not Book.validate_attraction_id(attraction_id):
            response = {"error": True, "message": "Invalid attractionId. It must be a integer between 1 and 58."}
            return JSONResponse(content=response, status_code=400)

        if not Book.validate_date(date):
            response = {"error": True, "message": "Invalid date format. It must be YYYY-MM-DD."}
            return JSONResponse(content=response, status_code=400)

        if not Book.validate_time(time):
            response = {"error": True, "message": "Invalid time. It must be a string of 'morning' or 'afternoon'."}
            return JSONResponse(content=response, status_code=400)

        if not Book.validate_price(price):
            response = {"error": True, "message": "Invalid price. It must be an integer of 2000 or 2500."}
            return JSONResponse(content=response, status_code=400)

        #處理預定手續
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
