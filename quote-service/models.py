from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Quote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quote = db.Column(db.Text, unique=True, nullable=False)
    author = db.Column(db.String(100), nullable=True, default="Unknown")
    
    
    
    