from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from module.JWT import decode_jwt  
from module.booking import Book  
import json


router = APIRouter()  
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

"""Get unconfirmed scheduled itineraries."""
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

"""Create a new scheduled itinerary"""
@router.post("/api/booking")
async def create_booking(request: Request, token: str = Depends(oauth2_scheme)):
    SECRET_KEY = "secret"
    ALGORITHM = "HS256"
    try:
        payload = decode_jwt(token)
        if payload is None:
            response = {"error": True, "message": "未登入系統,拒絕存取"}
            return JSONResponse(content=response, status_code=403)
        
        # token decoding
        user_id = payload.get("user_id")

        #Process json data
        try:
            data = await request.json()  
        except json.JSONDecodeError:            # In the case of JSON parsing (format) error, a 400 error code is returned
            response = {"error": True, "message": "Invalid JSON format."}
            return JSONResponse(content=response, status_code=400)
        
        if data == {}:  # Check if request data is received
            response = {"error": True, "message": "Request data not received."}
            return JSONResponse(content=response, status_code=400)
        # request parsing
        attraction_id = data["attractionId"]
        date = data["date"]
        time = data["time"]
        price = data["price"]
        status = "unpaid"               #Set the booking itinerary to "unpaid" status
                     
        #Front-end Request format verification
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

        #Process booking procedures
        booking_result = Book.create_booking(user_id, attraction_id, date, time, price,status)
        if booking_result:
            response = {"ok": True}
            return JSONResponse(content=response, status_code=200)

    except Exception as e:
        response = {"error": True, "message": str(e)}
        return JSONResponse(content=response, status_code=500)

"""Delete currently scheduled itinerary"""
@router.delete("/api/booking")
async def delete_booking(token: str = Depends(oauth2_scheme)):
    try:
        payload = decode_jwt(token)
        if payload is None:
            response = {"error": True, "message": "未登入系統,拒絕存取"}
            return JSONResponse(content=response, status_code=403)
        
        user_id = payload.get("user_id") #Get user_id from decoded token
        
        delete_result = Book.delete_booking(user_id)
        if delete_result: #If there is an error in delete_booking(user_id), status_code:500 'delete booking database data error.' will be displayed.
            response = {"ok": True}
            return JSONResponse(content=response, status_code=200)
    except Exception as e:
        response = {"error": True, "message": str(e)}
        return JSONResponse(content=response, status_code=500)
