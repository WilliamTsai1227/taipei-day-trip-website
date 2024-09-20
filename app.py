from fastapi import *
from fastapi.responses import FileResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from api.attractions import attractions
from api.mrts import mrts
from api.user import user
from api.booking import router
from api.order import orders
from fastapi.staticfiles import StaticFiles
app=FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

# setting CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
		"http://taipeitrips.com",
		"https://taipeitrips.com"
    ],  
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all HTTP headers
)

# Static Pages (Never Modify Code in this Block)
@app.get("/", include_in_schema=False)
async def index(request: Request):
	return FileResponse("./static/index.html", media_type="text/html")
@app.get("/attraction/{id}", include_in_schema=False)
async def attraction(request: Request, id: int):
	return FileResponse("./static/attraction.html", media_type="text/html")
@app.get("/booking", include_in_schema=False)
async def booking(request: Request):
	return FileResponse("./static/booking.html", media_type="text/html")
@app.get("/thankyou", include_in_schema=False)
async def thankyou(request: Request):
	return FileResponse("./static/thankyou.html", media_type="text/html")


app.include_router(attractions)
app.include_router(mrts)
app.include_router(user)
app.include_router(router)
app.include_router(orders)

# 異常處理
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    for error in exc.errors():
        error_messages = error['msg']
    return JSONResponse(
        status_code=400,
        content={"error": True, "message": error_messages}
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": True, "message": exc.detail}
    )
