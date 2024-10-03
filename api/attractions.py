from fastapi import *
from pydantic import BaseModel,Field
from module.attractions import Attraction



attractions = APIRouter()

class PageQuery(BaseModel):
    page: int = Field(default=0, ge=0)

@attractions.get("/api/attractions")
async def get_attractions(page: int = Query(0, ge=0), keyword: str = None):
    try:
        query_page = page * 12
        if keyword:
            result = Attraction.find_all_keyword_attractions(keyword,query_page)
        else:
            result = Attraction.find_all_attractions(query_page)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"ValueError in module: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database query failed")
    try:
        # Format query results
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
        return {"nextPage": page + 1 if len(result) == 12 else None,"data": formatted_result}
    except Exception as e:
        # Data formatting error
        raise HTTPException(status_code=500, detail=f"Data formatting failed: {str(e)}")    

        


@attractions.get("/api/attraction/{attractionId}")
async def get_attraction(attractionId: int = None):
    if not (1 <= attractionId <= 58):
        raise HTTPException(status_code=400, detail="attractionId not in range.")
    try:
        if attractionId:
            result = Attraction.find_id_attraction(attractionId)
        else:
            return {"error": True, "message": "attractionId empty"}
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"Value error in module:{str(e)}")            
    except Exception as e:
        # Any database exception error capture
        raise HTTPException(status_code=500, detail=f"Database query failed: {str(e)}")
    try:
        # Format query results
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
        return {"data": formatted_row}
    except Exception as e:
        # Data formatting error
        raise HTTPException(status_code=500, detail=f"Data formatting failed:{str(e)}") 


