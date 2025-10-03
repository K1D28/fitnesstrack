from flask import Flask, request, jsonify, render_template
import json
from datetime import datetime

app = Flask(__name__)

# In-memory data storage
data = {"exercises": [], "meals": []}

# Save data to JSON file for persistence
def save_data_to_file():
    with open("data.json", "w") as file:
        json.dump(data, file, indent=4)

# Load data from JSON file on startup
def load_data_from_file():
    try:
        with open("data.json", "r") as file:
            global data
            data = json.load(file)
    except FileNotFoundError:
        pass

# Home route
@app.route("/")
def index():
    return render_template("index.html", data=data)

# Log exercise
@app.route("/log/exercise", methods=["POST"])
def log_exercise():
    exercise = request.json.get("exercise")
    if not exercise:
        return jsonify({"error": "Exercise cannot be empty"}), 400
    data["exercises"].insert(0, {"exercise": exercise, "timestamp": datetime.now().isoformat()})
    save_data_to_file()
    return jsonify({"message": "Exercise logged successfully"})

# Log meal
@app.route("/log/meal", methods=["POST"])
def log_meal():
    meal = request.json.get("meal")
    if not meal:
        return jsonify({"error": "Meal cannot be empty"}), 400
    data["meals"].insert(0, {"meal": meal, "timestamp": datetime.now().isoformat()})
    save_data_to_file()
    return jsonify({"message": "Meal logged successfully"})

# Calculate BMI
@app.route("/calculate_bmi", methods=["POST"])
def calculate_bmi():
    weight = request.json.get("weight")
    height = request.json.get("height")
    if not weight or not height:
        return jsonify({"error": "Weight and height are required"}), 400
    try:
        bmi = round(weight / (height ** 2), 2)
        return jsonify({"bmi": bmi})
    except ZeroDivisionError:
        return jsonify({"error": "Height cannot be zero"}), 400

if __name__ == "__main__":
    load_data_from_file()
    app.run(debug=True)
