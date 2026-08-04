from flask import Flask, request, jsonify
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///login.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

@app.route('/weight', methods=['GET'])
def convert_weight():
    """
    Converts pounds to kilograms and vice versa
    """
    unit, value = _get_and_parse_data()

    if unit == 'kg':
        factor = 2.204623
    elif unit == 'lb':
        factor = 0.4535924
    else:
        return jsonify({"result": "Invalid unit for weight conversion"}), 400

    return jsonify({"result": float(value) * factor}), 200

def _get_and_parse_data() -> tuple[str,str]:
    """
    Gets data and returns unit and value as a tuple
    """
    data = request.get_json()
    unit = data.get('unit')
    value = data.get('value')

    return unit, value

if __name__ == '__main__':
    app.run(debug=True)
