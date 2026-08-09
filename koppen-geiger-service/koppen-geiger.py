"""
Koppen-Geiger classification microservice.
 
POST /classify an array of 25 numbers:
    [0:12]  monthly mean temperatures, Jan-Dec, in Celsius
    [12:24] monthly precipitation totals, Jan-Dec, in mm
    [24]    latitude (used to determine which months are summer)
 
Run:
    pip install fastapi uvicorn
    python koppen-geiger.py          # serves on http://localhost:8000

"""
 
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

PORT = 8000

app = FastAPI(title="Koppen-Geiger Microservice", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


 
def split_seasons(monthly_precip, latitude):
    """Return (summer_precip, winter_precip). Summer is Apr-Sep up north, Oct-Mar down south."""
    summer_months = [3, 4, 5, 6, 7, 8] if latitude >= 0 else [9, 10, 11, 0, 1, 2]
    summer_precip = [monthly_precip[month] for month in summer_months]
    winter_precip = [monthly_precip[month] for month in range(12) if month not in summer_months]
    return summer_precip, winter_precip
 
 
def aridity_threshold(mean_annual_temp, summer_precip, winter_precip):
    """How much rain a place 'needs' per year. Summer rain evaporates more, so the bar is higher."""
    total = sum(summer_precip) + sum(winter_precip)
    if sum(summer_precip) >= 0.7 * total:
        return 2 * mean_annual_temp + 28
    if sum(winter_precip) >= 0.7 * total:
        return 2 * mean_annual_temp
    return 2 * mean_annual_temp + 14
 
 
def polar_code(hottest_month_temp):
    """E group, or None if it isn't polar. Checked before everything else."""
    if hottest_month_temp >= 10:
        return None
    return "EF" if hottest_month_temp < 0 else "ET"
 
 
def arid_code(total_annual_precip, threshold, mean_annual_temp):
    """B group, or None. Overrides A/C/D."""
    if total_annual_precip >= 10 * threshold:
        return None
    desert_or_steppe = "BW" if total_annual_precip < 5 * threshold else "BS"
    hot_or_cold = "h" if mean_annual_temp >= 18 else "k"
    return desert_or_steppe + hot_or_cold
 
 
def tropical_code(coldest_month_temp, driest_month_precip, total_annual_precip):
    """A group, or None. Tropical means every single month is warm."""
    if coldest_month_temp < 18:
        return None
    if driest_month_precip >= 60:
        return "Af"
    monsoon_cutoff = 100 - total_annual_precip / 25
    return "Am" if driest_month_precip >= monsoon_cutoff else "Aw"
 
 
def rain_pattern(summer_precip, winter_precip):
    """Second letter for C/D: s = dry summer, w = dry winter, f = wet all year."""
    driest_summer, wettest_summer = min(summer_precip), max(summer_precip)
    driest_winter, wettest_winter = min(winter_precip), max(winter_precip)
    if driest_summer < 40 and driest_summer < wettest_winter / 3:
        return "s"
    if driest_winter < wettest_summer / 10:
        return "w"
    return "f"
 
 
def summer_intensity(monthly_temps, main_group):
    """Third letter for C/D: a = hot, b = warm, c = short cool, d = severe winter."""
    hottest_month_temp = max(monthly_temps)
    coldest_month_temp = min(monthly_temps)
    warm_month_count = sum(1 for temp in monthly_temps if temp >= 10)
    if hottest_month_temp >= 22:
        return "a"
    if warm_month_count >= 4:
        return "b"
    if main_group == "D" and coldest_month_temp < -38:
        return "d"
    return "c"
 
 
def temperate_code(monthly_temps, summer_precip, winter_precip):
    """C/D group, the fallthrough case once E, B and A are ruled out."""
    main_group = "C" if min(monthly_temps) > 0 else "D"
    return main_group + rain_pattern(summer_precip, winter_precip) + summer_intensity(monthly_temps, main_group)
 
 
def classify(monthly_temps, monthly_precip, latitude):
    mean_annual_temp = sum(monthly_temps) / 12
    total_annual_precip = sum(monthly_precip)
    summer_precip, winter_precip = split_seasons(monthly_precip, latitude)
    threshold = aridity_threshold(mean_annual_temp, summer_precip, winter_precip)
 
    return (
        polar_code(max(monthly_temps))
        or arid_code(total_annual_precip, threshold, mean_annual_temp)
        or tropical_code(min(monthly_temps), min(monthly_precip), total_annual_precip)
        or temperate_code(monthly_temps, summer_precip, winter_precip)
    )
 
 
DESCRIPTIONS = {
    "Af": "Tropical rainforest", "Am": "Tropical monsoon", "Aw": "Tropical savanna",
    "BWh": "Hot desert", "BWk": "Cold desert", "BSh": "Hot semi-arid", "BSk": "Cold semi-arid",
    "Csa": "Hot-summer Mediterranean", "Csb": "Warm-summer Mediterranean", "Csc": "Cold-summer Mediterranean",
    "Cwa": "Monsoon-influenced humid subtropical", "Cwb": "Subtropical highland", "Cwc": "Cold subtropical highland",
    "Cfa": "Humid subtropical", "Cfb": "Oceanic", "Cfc": "Subpolar oceanic",
    "Dsa": "Hot-summer Mediterranean continental", "Dsb": "Warm-summer Mediterranean continental",
    "Dsc": "Dry-summer subarctic", "Dsd": "Dry-summer subarctic (severe winter)",
    "Dwa": "Monsoon-influenced hot-summer continental", "Dwb": "Monsoon-influenced warm-summer continental",
    "Dwc": "Monsoon-influenced subarctic", "Dwd": "Monsoon-influenced subarctic (severe winter)",
    "Dfa": "Hot-summer humid continental", "Dfb": "Warm-summer humid continental",
    "Dfc": "Subarctic", "Dfd": "Subarctic (severe winter)",
    "ET": "Tundra", "EF": "Ice cap",
}
 
 # endpoints
 
@app.post("/classify")
def classify_endpoint(numbers: list[float]):
    if len(numbers) != 25:
        print(f"--> REQUEST  /classify with {len(numbers)} numbers")
        print("<-- RESPONSE 422 wrong number of values")
        raise HTTPException(422, f"expected 25 numbers (12 temps, 12 precip, 1 latitude), got {len(numbers)}")

    monthly_temps = numbers[0:12]
    monthly_precip = numbers[12:24]
    latitude = numbers[24]

    print(f"--> REQUEST  /classify  lat {latitude}")
    print(f"             temps degC {monthly_temps}")
    print(f"             precip mm  {monthly_precip}")

    code = classify(monthly_temps, monthly_precip, latitude)
    answer = {
        "code": code,
        "description": DESCRIPTIONS.get(code, "Unknown"),
        "mean_annual_temp_c": round(sum(monthly_temps) / 12, 2),
        "annual_precip_mm": round(sum(monthly_precip), 1),
    }

    print(f"<-- RESPONSE {answer['code']} - {answer['description']}")
    print()

    return answer


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    print("Koppen-Geiger service is running.")
    print(f"POST 25 numbers to http://localhost:{PORT}/classify")
    print("Press Ctrl+C to stop it.")
    print()
    uvicorn.run(app, host="localhost", port=PORT, log_level="warning")
