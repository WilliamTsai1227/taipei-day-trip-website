from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from module.JWT import decode_jwt  
from module.order import Order
from module.booking import Book
from datetime import datetime, timezone, timedelta
import json
import re
import requests


# 使用 APIRouter()
orders = APIRouter()  # 确保使用不同的名字，避免冲突
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@orders.post("/api/order")
async def create_order(request: Request,token: str = Depends(oauth2_scheme)):
    SECRET_KEY = "secret"
    ALGORITHM = "HS256"
    try:
        payload = decode_jwt(token)
        if payload is None:
            response = {"error": True, "message": "未登入系統,拒絕存取"}
            return JSONResponse(content=response, status_code=403)
        user_id = payload.get("user_id")
        data = await request.json()  
        name =  data["order"]["contact"]["name"]
        email = data["order"]["contact"]["email"]
        phone = data["order"]["contact"]["phone"]
        if name == "" or email =="" or phone == "":
            response={
                "error": True,
                "message": "聯絡資訊填寫不完全"
            }
            return JSONResponse(content=response, status_code=400)
        #處理email及手機格式           
        email_regex = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-.]+){1,}$')
        phone_regex = re.compile(r'^09\d{8}$')
        email_result= re.fullmatch(email_regex, email)
        phone_result = re.fullmatch(phone_regex, phone)

        if email_result and phone_result :
            booking_information = Order.search_booking_information(user_id)
            booking_id = booking_information.get("id")
            attraction_id = booking_information.get("attraction_id")
            price = booking_information.get("price")
            date = booking_information.get("date")
            time = booking_information.get("time")
            order_number = datetime.now(timezone(timedelta(hours=+8)))
            order_number = order_number.strftime("%Y%m%d%H%M%S") +"-"+ str(booking_id)
            pay_status = 1 # haven't pay 
            Order.create_new_order(user_id, attraction_id, order_number, price, pay_status, date, time, name, email, phone)
            merchant_id = "williamtsai_CTBC"
            partner_key = "partner_1logTaunpreGr4N0iqRzm38fixZ4Kb0UWD08uo7lRq7k20m2ODSJqgT7"
            # merchant_id = "GlobalTesting_CTBC"
            paydata = {
                "prime":  data["prime"],
                "partner_key": partner_key,
                "merchant_id": merchant_id,
                "details":"TapPay Test",
                "amount": price,
                "cardholder": {
                    "phone_number": phone,
                    "name": name,
                    "email": email,
                },
                "remember": True
            }
            paydata=json.dumps(paydata)
            # Fetching Data Using Tappay API
            print("Sending request to TapPay API...")
            tappay_response = requests.post(
                "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime",
                data=paydata,
                headers={
                    "Content-Type": "application/json", 
                    "x-api-key": partner_key
                },
            )
            print(f"Response status code: {tappay_response.status_code}")
            tappay_response_data = tappay_response.json()
            print("Received response from TapPay API:")
            print(tappay_response_data)
            if tappay_response_data["status"] == 0:
                Order.order_paystatus_change(order_number)
                pay_status=0   
                pay_status_message="付款成功"
                response={
                    "data": {
                        "number":order_number,
                        "payment": {
                            "status":pay_status,
                            "message":pay_status_message
                        }
                    }
                }
                Book.delete_booking(user_id)
                return JSONResponse(content=response, status_code=200) 
                  
            else:
                pay_status=1  
                pay_status_message="付款失敗"             
                response = {
                    "data": {
                        "number": order_number,
                        "payment": {
                            "status": pay_status,
                            "message": pay_status_message
                        }
                    }   
                }
                return JSONResponse(content=response, status_code=200) 
        else:
            response={
                "error": True,
                "message": "信箱或手機號碼格式錯誤"
            }
            return JSONResponse(content=response, status_code=400) 

    except Exception as e:
        response={
            "error": True,
            "message": str(e)
        }
        return JSONResponse(content=response, status_code=500) 




@orders.get("/api/order/{orderNumber}")
def get_order(orderNumber: str,token: str = Depends(oauth2_scheme)):
    try:
        SECRET_KEY = "secret"
        ALGORITHM = "HS256"
        payload = decode_jwt(token)
        if payload is None:
            response = {"error": True, "message": "未登入系統,拒絕存取"}
            return JSONResponse(content=response, status_code=403)
        else:
            result = Order.get_order_information(orderNumber)
            if result:
                image = result["image_url"].split(",") if result["image_url"] else []
                response = {
                    "data": {
                        "number": orderNumber,
                        "price": result.get("price"),
                        "trip": {
                            "attraction": {
                                "id": result.get("id"),
                                "name": result.get("name"),
                                "address": result.get("address"),
                                "image": image[0]
                            },
                            "date": result.get("date"),
                            "time": result.get("time")
                        },
                        "contact": {
                            "name": result.get("contact_name"),
                            "email": result.get("email"),
                            "phone": result.get("phone")
                        },
                        "status": result.get("pay_status")
                    }
                }
                return JSONResponse(content=response, status_code=200) 
            else:
                response = {"data": None}
                return JSONResponse(content=response, status_code=200) 
            
    except Exception as e:
        response={
            "error": True,
            "message": str(e)
        }
        return JSONResponse(content=response, status_code=500) 




