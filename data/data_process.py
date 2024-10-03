import os
import json
import mysql.connector
import re
con = mysql.connector.connect(
    user="root",
    password="12345678",
    host="localhost",
    database="taipei_day_trip_website"
)
#image URL filtering and write to database
def processing_img_url(img_url,id,cursor):
    pattern1 = r'https://[^\s]+?\.(?:jpg|JPG|mp3|PNG|png)'
    pattern2 = r'https://[^\s]+?\.(?:jpg|JPG|PNG|png)'
    urls = re.findall(pattern1, img_url)
    for url in urls:
      if re.findall(pattern2,url): #If the url is ends with JPG/jpg/PNG/png
        cursor.execute("INSERT INTO images (attractions_id,image_url) VALUES (%s,%s)",(id,url))
        con.commit()
    
def data_process():
    current_dir = os.path.dirname(__file__)
    file_path = os.path.join(current_dir, 'taipei-attractions.json')

    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as file:
            attractions = json.load(file)
    id = 1
    cursor = con.cursor()
    for i in attractions["result"]["results"]:
        name = i["name"]
        category = i["CAT"]
        description = i["description"]
        address = i["address"]
        transport = i["direction"]
        mrt = i["MRT"]
        lat = i["latitude"]
        lng = i["longitude"]
        image_url = i["file"]
        cursor.execute("INSERT INTO attractions (id,name,category,description,address,transport,mrt,lat,lng) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)"
                      ,(id,name,category,description,address,transport,mrt,lat,lng))
        con.commit() #After executing the writing of an attraction in the attractions table
        processing_img_url(image_url,id,cursor) #Execute the image url of this attraction to be written into the images table
        id += 1
    cursor.close()
    con.close()

data_process()


