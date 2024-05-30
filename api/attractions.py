from fastapi import *
from mysql.connector import pooling
from fastapi import APIRouter
from pydantic import BaseModel,Field

# 建立connection_pool
db_config = {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "12345678",
    "database": "taipei_day_trip_website",
}


connection_pool = pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=10,
    **db_config
)
#

#使用 APIRouter()
attractions = APIRouter()

class PageQuery(BaseModel):
    page: int = Field(default=0, ge=0)

@attractions.get("/api/attractions")
async def get_attractions(page: int = Query(0, ge=0), keyword: str = None):
    try:
        conn = connection_pool.get_connection()
        cursor = conn.cursor()
        query_page = page * 12
        if keyword:
            keyword_pattern = f"%{keyword}%"
            cursor.execute(
                """
                SELECT a.*, GROUP_CONCAT(i.image_url) AS image_urls 
                FROM attractions a 
                LEFT JOIN images i ON a.id = i.attractions_id 
                WHERE a.name LIKE %s OR a.mrt = %s 
                GROUP BY a.id 
                LIMIT %s, 12
                """,
                (keyword_pattern, keyword, query_page)
            )
        else:
            cursor.execute(
                """
                SELECT a.*, GROUP_CONCAT(i.image_url) AS image_urls 
                FROM attractions a 
                LEFT JOIN images i ON a.id = i.attractions_id 
                GROUP BY a.id 
                LIMIT %s, 12
                """,
                (query_page,)
            )
        result = cursor.fetchall()
        # 格式化查詢結果
        formatted_result = []
        for row in result:
            images = row[9].split(',') if row[9] else []
            formatted_row = {
                "id": row[0],
                "name": row[1],
                "category": row[2],
                "description": row[3],
                "address": row[4],
                "transport": row[5],
                "mrt": row[6],
                "lat": row[7],
                "lng": row[8],
                'images': images
            }
            formatted_result.append(formatted_row)
        cursor.close()
        conn.close()

        return {"nextPage": page + 1 if len(result) == 12 else None,"data": formatted_result}
    except Exception as e:
        print("Caught exception:", e)
        return {"error": True, "message": str(e)}
        raise HTTPException(status_code=500, detail=e)

@attractions.get("/api/attraction/{attractionId}")
async def get_attraction(attractionId: int = None):
    try:
        conn = connection_pool.get_connection()
        cursor = conn.cursor()
        if attractionId:
            cursor.execute(
                """
                SELECT a.*, GROUP_CONCAT(i.image_url) AS image_urls 
                FROM attractions a 
                LEFT JOIN images i ON a.id = i.attractions_id 
                WHERE a.id = %s 
                GROUP BY a.id 
                """,
                (attractionId,)
            )
        else:
            return {"error": True, "message": "attractionId empty"}
        result = cursor.fetchone()
        # 格式化查詢結果
        images = result[9].split(',') if result[9] else []
        formatted_row = {
            "id": result[0],
            "name": result[1],
            "category": result[2],
            "description": result[3],
            "address": result[4],
            "transport": result[5],
            "mrt": result[6],
            "lat": result[7],
            "lng": result[8],
            'images': images
        }
        cursor.close()
        conn.close()

        return {"data": formatted_row}
    except Exception as e:
        print("Caught exception:", e)
        return {"error": True, "message": str(e)}
        raise HTTPException(status_code=500, detail=e)

    # return {
    #     "nextPage": page + 1,
    #     "data": filtered_attractions[start_index:end_index]
    # }














#http://127.0.0.1:8000/api/attraction/1
#http://127.0.0.1:8000/api/attractions?page=0&keyword=中山
#http://127.0.0.1:8000/api/attractions?page=0djdjd



# conn = connection_pool.get_connection()
# cursor = conn.cursor()
# cursor.execute("SELECT * FROM attractions")
# cursor.close()
# conn.close()

# {
#   "data": [
#     [25, "台北霞海城隍廟",
#       "宗教信仰",
#       "位於迪化街1段的霞海城隍廟，建於西元1856（咸豐六年），占地約46餘坪，雖沒有巍峨之廟貌，然其信仰圈極廣、香火鼎盛，每逢迎神賽會總是熱鬧非凡、位為地方大事，與大稻埕的地方發展息息相關。城隍廟內主祀霞海城隍老爺，從祀二判官(文、武判)、謝范二將軍(七、八爺)，配祀三十八義勇公。城隍夫人、八司官、八將軍、馬使爺、及月下老人等，這座著名的古廟，1994年之前可以容納六百多尊神像，目前只有200尊左右，曾經是臺灣神像密度最高的廟，蔚為一景。 在霞海城隍廟中，除了城隍爺之外，最吸引遊客的，莫過於拜月老，每年帶著禮餅來答謝者超過6000對，而其中最搶手的就是馭夫鞋（又名幸福鞋），是臺北市有名的「愛情御守」，平均每年到霞海城隍廟「求鞋」民眾更超過200對家庭。相傳城隍爺和城隍夫人相差約70歲，「老夫疼少妻」下，民間深信這對「神仙伴侶」可為家庭帶來幸福，造就了「馭夫鞋」的由來。城隍廟在坊間傳說中，還有著1段神蹟故事。1884年，中法戰爭時，法軍來攻臺灣，當時的臺北人來此虔誠祈禱霞海城隍爺的保護。城隍爺果然大顯靈赫，最終法軍只到五堵為止就被擊敗，未能攻佔臺北，所以民間都尊稱霞海城隍為威靈公。",
#       "臺北市  大同區迪化街1段61號",
#       "捷運站名：中山站沿南京西路直行往寶島鐘錶方向走到底，右轉迪化街直走即可到達。或是雙連站往民生西路左轉迪化街。1.公車：9、12、250、274、304、市民小巴9至延平一站，811、紅33至迪化街站、民生西寧路口站，206、250、255、274、304重慶北、518、539、639、641、669、704至南京西路口站。 2.車位：3、5號水門外有停車場，百車驛停車場，國茶帝國花園廣場地下停車",
#       "中山",
#       25.055565, 121.510085],
#     [55, "陽明山中山樓",
#       "歷史建築",
#       "陽明山國家公園內的中山樓，是蔣介石總統在位時，為了紀念國父孫中山先生百年誕辰，於1965年所興建，由名建築師修澤蘭女士規劃，位於群山環抱的綠意之中，外表為中國傳統古典式建築，內部陳設典雅細緻，過去是國民大會的會場，並為國家元首接待外賓或舉辦國宴的重要場地，如今已被指定為市立古蹟，並開放場地租借及參觀導覽，是一座具有歷史紀念價值的建築物。 參觀導覽 02-2861-6391 / 場地租借 02-2861-0565",
#       "臺北市  北投區陽明路2段15號",
#       "捷運劍潭站轉乘紅5、260至教師研習站下車到達公車－每日行駛：&nbsp;中山樓正門站─260 &nbsp;(說明：駛入園區直接停於本樓)中山樓站─260、681、紅5、1717(皇家客運) &nbsp;(說明：停於園區門口，步行5分鐘至本樓)陽明山站─230、303、小8、小9 &nbsp;(說明：步行5分鐘至園區門口，在步行5分至本樓)假日行駛：中山樓站─109、111、128 &nbsp;(說明：停於園區門口，步行5分鐘至本樓)陽明山站─129 &nbsp;(說明：步行5分鐘至園區門口，在步行5分至本樓)&nbsp;",
#       "劍潭",
#       25.155623, 121.552772]
#   ],
#   "nextPage": null
# }
# 最後結果會回串這樣的形式
# 但是我想要是

# {
#   "nextPage": 1,
#   "data": [
#     {
#       "id": 25,
#       "name": "台北霞海城隍廟",
#       "category": "宗教信仰",
#       "description": "位於迪化街1段的霞海城隍廟，建於西元1856（咸豐六年），占地約46餘坪，雖沒有巍峨之廟貌，然其信仰圈極廣、香火鼎盛，每逢迎神賽會總是熱鬧非凡、位為地方大事，與大稻埕的地方發展息息相關。城隍廟內主祀霞海城隍老爺，從祀二判官(文、武判)、謝范二將軍(七、八爺)，配祀三十八義勇公。城隍夫人、八司官、八將軍、馬使爺、及月下老人等，這座著名的古廟，1994年之前可以容納六百多尊神像，目前只有200尊左右，曾經是臺灣神像密度最高的廟，蔚為一景。 在霞海城隍廟中，除了城隍爺之外，最吸引遊客的，莫過於拜月老，每年帶著禮餅來答謝者超過6000對，而其中最搶手的就是馭夫鞋（又名幸福鞋），是臺北市有名的「愛情御守」，平均每年到霞海城隍廟「求鞋」民眾更超過200對家庭。相傳城隍爺和城隍夫人相差約70歲，「老夫疼少妻」下，民間深信這對「神仙伴侶」可為家庭帶來幸福，造就了「馭夫鞋」的由來。城隍廟在坊間傳說中，還有著1段神蹟故事。1884年，中法戰爭時，法軍來攻臺灣，當時的臺北人來此虔誠祈禱霞海城隍爺的保護。城隍爺果然大顯靈赫，最終法軍只到五堵為止就被擊敗，未能攻佔臺北，所以民間都尊稱霞海城隍為威靈公。",
#       "address":  "臺北市  大同區迪化街1段61號",
#       "transport": "捷運站名：中山站沿南京西路直行往寶島鐘錶方向走到底，右轉迪化街直走即可到達。或是雙連站往民生西路左轉迪化街。1.公車：9、12、250、274、304、市民小巴9至延平一站，811、紅33至迪化街站、民生西寧路口站，206、250、255、274、304重慶北、518、539、639、641、669、704至南京西路口站。 2.車位：3、5號水門外有停車場，百車驛停車場，國茶帝國花園廣場地下停車",
#       "mrt": "中山",
#       "lat": 25.055565,
#       "lng": 121.510085,
#       "images": [
#         "http://140.112.3.4/images/92-0.jpg"
#       ]
#     }
#   ]
# }