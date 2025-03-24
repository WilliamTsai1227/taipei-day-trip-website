from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from module.JWT import decode_jwt  
from module.order import Order
from module.booking import Book
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
import os
import json
import re
import requests

#Load environment variables from .env file
load_dotenv()
TAPPAY_PARTNER_KEY = os.getenv("TAPPAY_PARTNER_KEY", "")
TAPPAY_MERCHANT_ID = os.getenv("TAPPAY_MERCHANT_ID", "")
TAPPAY_APPID = os.getenv("TAPPAY_APPID", "")
TAPPAY_APPKEY = os.getenv("TAPPAY_APPKEY", "")
TAPPAY_SERVER_TYPE = os.getenv("TAPPAY_SERVER_TYPE", "")

orders = APIRouter()  
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@orders.post("/api/order")
async def create_order(request: Request,token: str = Depends(oauth2_scheme)):
    try:
        payload = decode_jwt(token)
        if payload is None:
            response = {"error": True, "message": "未登入系統,拒絕存取"}
            return JSONResponse(content=response, status_code=401)
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
        #Process email and mobile phone formats          
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
            pay_status = 1 # UNPAID 
            Order.create_new_order(user_id, attraction_id, order_number, price, pay_status, date, time, name, email, phone)
            
            paydata = {
                "prime":  data["prime"],
                "partner_key": TAPPAY_PARTNER_KEY,
                "merchant_id": TAPPAY_MERCHANT_ID,
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
            tappay_response = requests.post(
                "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime",
                data=paydata,
                headers={
                    "Content-Type": "application/json", 
                    "x-api-key": TAPPAY_PARTNER_KEY
                },
            )
            tappay_response_data = tappay_response.json()
            if tappay_response_data["status"] == 0:
                Order.order_paystatus_change(order_number) #change order status to paid.
                pay_status=0   # PAID
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
                pay_status=1  # UNPAID
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
async def get_order(orderNumber: str,token: str = Depends(oauth2_scheme)):
    try:
        payload = decode_jwt(token)
        if payload is None:
            response = {"error": True, "message": "未登入系統,拒絕存取"}
            return JSONResponse(content=response, status_code=401)
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

"""Return the TapPay's front-end Setup SDK information"""  
@orders.post("/api/tappay/setup-sdk")
async def get_tappay_setup_sdk():
    try:
        tappay_appid = int(TAPPAY_APPID)
    except ValueError:
        return JSONResponse(content={"error": True, "message": "Invalid APPID"}, status_code=500)
    try:
        response={
            "TAPPAY_APPID":tappay_appid,
            "TAPPAY_APPKEY":TAPPAY_APPKEY,
            "TAPPAY_SERVER_TYPE":TAPPAY_SERVER_TYPE
        }
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        response={
            "error": True,
            "message": str(e)
        }
        return JSONResponse(content=response, status_code=500)


