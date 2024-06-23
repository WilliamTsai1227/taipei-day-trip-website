from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
import jwt
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
        
        data = Book.find_member_unpay_booking()
        return JSONResponse(content={"data": data}, status_code=200)

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
        if data == {}:  # 检查是否接收到请求数据
            response = {"error": True, "message": "Request data not received."}
            return JSONResponse(content=response, status_code=400)
        
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
        status = "unpaid" #設定booking 行程為"unpaid"狀態，直到付款後才會變更
        
        booking_result = Book.create_booking(user_id, attraction_id, date, time, price,status)
        if booking_result:
            response = {"ok": True}
            return JSONResponse(content=response, status_code=200)
        else:
            response = {"error": True, "message": "booking database error"}
            return JSONResponse(content=response, status_code=400)
    except Exception as e:
        response = {"error": True, "message": str(e)}
        return JSONResponse(content=response, status_code=500)

"""刪除目前預定的行程"""
@router.delete("/api/booking")
async def delete_booking(token: str = Depends(oauth2_scheme)):
    try:
        payload = decode_jwt(token)
        if payload is None:
            response = {"error": True, "message": "未登入系統,token驗證失敗"}
            return JSONResponse(content=response, status_code=403)
        
        user_id = payload.get("user_id")
        
        # 假设有一个方法来删除用户的预定行程
        delete_result = Book.delete_booking(user_id)
        if delete_result:
            response = {"ok": True}
            return JSONResponse(content=response, status_code=200)
        else:
            response = {"error": True, "message": "Delete booking error"}
            return JSONResponse(content=response, status_code=400)
    except Exception as e:
        response = {"error": True, "message": str(e)}
        return JSONResponse(content=response, status_code=500)
