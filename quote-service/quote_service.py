from flask import Flask, request, jsonify
from flask_cors import CORS  # <--- 1. Import CORS
from models import db, Quote
from sqlalchemy import func
import requests

app = Flask(__name__)
CORS(app)                    # <--- 2. Enable CORS on the Flask app

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///quotes.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()
    
@app.route('/quote', methods=['GET'])
def get_quote():
    
    random_quote_row = Quote.query.order_by(func.random()).first()
     
    if random_quote_row:
        return jsonify({"quote": random_quote_row.quote,
                        "author": random_quote_row.author}), 200
    
    return jsonify({"error": "No Resource Found"}), 404

    
@app.route('/quote', methods=['POST'])
def add_quote():
    
    data = request.get_json()
    new_quote = data.get('quote')
    new_author = data.get('author')
    
    # remove spaces from front and back
    new_quote = new_quote.strip()
    
    if new_author:
        new_author = new_author.strip()

    if not is_quote_valid(new_quote):
        return jsonify({"message": "Unable to save quote"}), 400
    
    new_quote_record = Quote(quote=new_quote, author=new_author)
    
    db.session.add(new_quote_record)
    db.session.commit()
    print("new quote added")
    return jsonify({"message": "A new quote has been added"}), 201
    
# checks quote for invalidness
def is_quote_valid(new_quote):
    
    if not new_quote:
        return False
    
    if len(new_quote) < 3:
        return False
    
    existing_quote = Quote.query.filter_by(quote=new_quote).first()
    if existing_quote:
        return False
    
    return True
    
    

if __name__ == '__main__':
    app.run(port=5010, debug=True)