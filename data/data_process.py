import os
import json


current_dir = os.path.dirname(__file__)
file_path = os.path.join(current_dir, 'taipei-attractions.json')

if os.path.exists(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        attractions = json.load(file)
count = 0
for i in attractions["result"]["results"]:
    count += 1
    print(count ,i["_id"])



# 把connect pool 建立好
# 建立資料庫並且順利寫入

#['rate', 'direction', 'name', 'date', 'longitude', 'REF_WP'?x, 'avBegin'?x, 'langinfo'x, 'MRT', 'SERIAL_NO'x, 
#'RowNumber'x, 'CAT'  category , 'MEMO_TIME', 'POI' ?x, 'file', 'idpt'X, 'latitude', 'description', '_id', 'avEnd' x, 'address']

"""
/api/attractions 取得景點資料列表
200
{
  "nextPage": 1,
  "data": [
    {
      "id": 10,
      "name": "平安鐘",
      "category": "公共藝術",
      "description": "平安鐘祈求大家的平安，這是為了紀念 921 地震週年的設計",
      "address": "臺北市大安區忠孝東路 4 段 1 號",
      "transport": "公車：204、212、212直",
      "mrt": "忠孝復興",
      "lat": 25.04181,
      "lng": 121.544814,
      "images": [
        "http://140.112.3.4/images/92-0.jpg"
      ]
    }
  ]
}
"""

"""
/api/attraction/{attractionId}景點編號integer(path)
200
{
  "data": {
    "id": 10,
    "name": "平安鐘",
    "category": "公共藝術",
    "description": "平安鐘祈求大家的平安，這是為了紀念 921 地震週年的設計",
    "address": "臺北市大安區忠孝東路 4 段 1 號",
    "transport": "公車：204、212、212直",
    "mrt": "忠孝復興",
    "lat": 25.04181,
    "lng": 121.544814,
    "images": [
      "http://140.112.3.4/images/92-0.jpg"
    ]
  }
}



"""