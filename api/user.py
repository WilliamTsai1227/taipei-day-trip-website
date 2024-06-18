from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr

app = FastAPI()

class User(BaseModel):
    name: str
    email: EmailStr
    password: str

@app.post("/api/user", status_code=200)
async def create_user(user: User):
    # 假设这里有一些逻辑去检查用户是否已经存在
    # 例如，查询数据库
    user_exists = False  # 这里应该是实际的数据库查询结果
    
    if user_exists:
        raise HTTPException(status_code=400, detail={"error": True, "message": "重複的 Email"})
    
    # 其他业务逻辑
    try:
        # 假设这里有创建用户的逻辑，例如插入数据库
        pass
    except Exception as e:
        raise HTTPException(status_code=500, detail={"error": True, "message": str(e)})

    return {"ok": True}




from fastapi import FastAPI, Request, Form 
from fastapi.responses import RedirectResponse,HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
import mysql.connector



app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

app.add_middleware(SessionMiddleware, secret_key="secret")


@app.get("/")
async def home(request: Request):
    if "SIGNED-IN" not in request.session or request.session["SIGNED-IN"] != True : #如果尚未登入，顯示home page
        return templates.TemplateResponse("Home_page.html",{"request": request})
    elif request.session["SIGNED-IN"] == True : #如果已經登入了顯示會員頁
        return RedirectResponse(url="/member", status_code=303)
    
@app.post("/signup")
async def signup(request: Request,register_name: str= Form(None),register_account: str= Form(None), register_password: str= Form(None)):
    con = mysql.connector.connect(
        user = "root",
        password = "12345678",
        host = "localhost",
        database = "website"
    )
    name = register_name
    account = register_account
    password = register_password
    
    #創建cursor物件
    cursor = con.cursor()
    cursor.execute("SELECT username FROM member WHERE username=%s",(account,)) #尋找相同帳號
    data = cursor.fetchall()
    if data == []: #沒找到
        cursor.execute("INSERT INTO member(name,username,password) VALUES (%s,%s,%s)",(name,account,password))
        con.commit()
        con.close()
        return RedirectResponse(url="/", status_code=303)
    if data != []: #找到相同帳號
        con.close()
        error_message = "Repeated username"
        return RedirectResponse(url=f"/error?message={error_message}", status_code=303)

    
    


@app.post("/signin")
async def signin(request: Request,account: str= Form(None), password: str= Form(None)):
    con = mysql.connector.connect(
        user = "root",
        password = "12345678",
        host = "localhost",
        database = "website"
    )
    cursor = con.cursor()
    cursor.execute("SELECT id, name, username, password FROM member WHERE username=%s AND password=%s",(account,password))
    data = cursor.fetchone()
    con.close()
    if data == None:
        error_message = "帳號或密碼輸入錯誤"
        request.session["SIGNED-IN"] = False
        return RedirectResponse(url=f"/error?message={error_message}", status_code=303)
    if account == data[2] and password == data[3]:     
        request.session.update({"SIGNED-IN": True, "id": data[0], "name": data[1], "username":data[2]})
        return RedirectResponse(url="/member", status_code=303)



@app.get("/member")
async def member(request: Request):    
    if "SIGNED-IN" not in request.session or request.session["SIGNED-IN"] == False :
        return RedirectResponse(url="/")
    elif request.session["SIGNED-IN"] == True:
        name = request.session["name"] #登入會員姓名
        id = request.session["id"] #登入會員id
        con = mysql.connector.connect( #連接資料庫
            user = "root",
            password = "12345678",
            host = "localhost",
            database = "website"
        )
        cursor = con.cursor()
        cursor.execute("SELECT member.name, message.content, message.member_id, message.id FROM member INNER JOIN message ON member.id = message.member_id ORDER BY message.time DESC;")
        data = cursor.fetchall()
        result = []
        for item in data:
            empty = [] #之後要單獨存放每一筆資料的小list
            check = "" 
            message_username = item[0]  #留言人名稱
            message = item[1] #留言內容
            member_id = item[2] #留言會員id
            message_id = item[3] #這則message id
            if id == member_id: #若登入id和留言會員id吻合，創造打叉按鈕
                check = '<button>X</button>'
            empty.append(message_username+":")
            empty.append(message)
            empty.append(check)
            empty.append(message_id)
            result.append(empty) # result=[[message_username,message,check,message_id]....]
        
        con.close()
        return templates.TemplateResponse("Success_page.html", {"result": result, "id": id, "name": name, "request": request}, headers={"Cache-Control": "no-cache, no-store, must-revalidate"})
        

        


@app.get("/error")
async def error(request: Request,message: str=None):
    return templates.TemplateResponse("Error_page.html",{"error_message": message,"request": request})

@app.get("/signout")
async def logout(request: Request):
    request.session.update({"SIGNED-IN": False, "id": None, "name": None, "username":None})
    return RedirectResponse(url="/")


@app.post("/createMessage")
async def createMessage(request: Request,message: str= Form("empty")):
    con = mysql.connector.connect(
        user = "root",
        password = "12345678",
        host = "localhost",
        database = "website"
    )
    cursor = con.cursor()
    id = request.session["id"]  #現在的使用者id
    cursor.execute("INSERT INTO message(member_id,content) VALUES (%s,%s)",(id,message)) #寫入message table 
    con.commit()
    con.close()
    return RedirectResponse(url="/member", status_code=303)

@app.post("/deleteMessage")
async def deleteMessage(request: Request):
    #從前端javascript拿到json格式資料
    message_data = await request.json()

    # 解析出messageID
    messageId = int(message_data.get("messageId")) #留言的使用者id 傳進來data type 為 str 要記得轉int
   
    con = mysql.connector.connect(
        user = "root",
        password = "12345678",
        host = "localhost",
        database = "website"
    )
    cursor = con.cursor()
    cursor.execute("SELECT member_id FROM message WHERE id=%s",(messageId,))
    result = cursor.fetchone()
    if result:
        member_id = result[0]
        if member_id == request.session["id"]: #如果這則留言的留言者id與現在的登入使用者id一樣了話允許刪除
            cursor.execute("DELETE FROM message WHERE id=%s",(messageId,))
            con.commit()
    con.close()
    return RedirectResponse(url="/member", status_code=303)

    

