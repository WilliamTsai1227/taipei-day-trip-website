from fastapi import *
from module.mrts import MRT



mrts = APIRouter()


@mrts.get("/api/mrts")
async def get_mrts():
    try:
        try:
            result = MRT.get_sorted_mrt_station()
        except ValueError as e:
            raise HTTPException(status_code=500,detail=f"mrt.py module error:{str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"mrt.py module Database error:{str(e)}")
        station_names = [item[0] for item in result if item[0] is not None]
        return {"data": station_names}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error:{str(e)}")

    