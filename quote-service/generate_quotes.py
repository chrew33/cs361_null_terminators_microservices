from quote_service import app
from models import db, Quote
import requests

with app.app_context():
    response = requests.get("https://dummyjson.com/quotes?limit=100")
    responseData = response.json()
    
    quoteList = responseData["quotes"]
    
    for quoteData in quoteList:
        # check if a the same quote exists in the database
        if not Quote.query.filter_by(quote=quoteData["quote"]).first():
            # Add the new quote to the database along with author
            db.session.add(Quote(quote=quoteData["quote"], author=quoteData["author"]))
    
    db.session.commit()
    
    print("Successful generation of quotes")