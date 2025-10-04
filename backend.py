from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory storage for logged items
log_history = []

@app.route('/log', methods=['POST'])
def log_data():
    data = request.json
    exercise = data.get('exercise')
    meal = data.get('meal')
    calories = data.get('calories')
    weight = data.get('weight')
    height = data.get('height')

    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    if exercise:
        log_history.append({'type': 'exercise', 'value': exercise, 'timestamp': timestamp})

    if meal and calories:
        log_history.append({'type': 'meal', 'value': f'{meal} ({calories} cal)', 'timestamp': timestamp})

    if weight and height:
        try:
            bmi = round(float(weight) / ((float(height) / 100) ** 2), 2)
            log_history.append({'type': 'bmi', 'value': f'BMI: {bmi}', 'timestamp': timestamp})
        except ValueError:
            return jsonify({'error': 'Invalid weight or height'}), 400

    return jsonify({'message': 'All data logged successfully!', 'log_history': log_history}), 200

@app.route('/logs', methods=['GET'])
def get_logs():
    return jsonify({'log_history': log_history}), 200

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)