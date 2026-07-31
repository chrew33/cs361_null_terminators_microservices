from flask import Flask, request, jsonify
from models import db, User

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///login.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()
    
@app.route('/login', methods=['POST'])
def login_check():
    
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
    
    if user and user.password == password:
        return jsonify({"is_login_valid": True}), 200
    
    return jsonify({"is_login_valid":False}), 401

    
@app.route('/register', methods=['POST'])
def register():
    
    data = request.get_json()
    new_username = data.get('username')
    new_password = data.get('password')
    
    # this could be where an authentication microservice call could be made.
    
    existing_user = User.query.filter_by(username=new_username).first()
    
    if existing_user:
        return jsonify({"signup_success": False}), 409
    
    new_user = User(username=new_username, password=new_password)
    
    db.session.add(new_user)
    db.session.commit()
    print("new user created")
    return jsonify({"signup_success": True}), 201
    


if __name__ == '__main__':
    app.run(port=5555, debug=True)