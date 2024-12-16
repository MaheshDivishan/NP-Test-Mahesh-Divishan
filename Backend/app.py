from flask import Flask,request
from flask.json import jsonify
from pymongo import MongoClient 
from flask_cors import CORS, cross_origin
from bson import json_util
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app) 
# Set up MongoDB connection 
client = MongoClient('mongodb://localhost:27017/') 
db = client.user_management
users = db.users
userlist = db.userlist



@app.route('/')
def hello_world():
    return 'Hello World'

#Create Account
@app.route('/create-account', methods=['POST'])
def create_account():
    try:
        data = request.json
        full_name = data.get('fullName')
        email = data.get('email')
        password = data.get('password')

        if not full_name:
            return jsonify({"error": True, "message": "Full Name is required"}), 400
        if not email:
            return jsonify({"error": True, "message": "Email is required"}), 400
        if not password:
            return jsonify({"error": True, "message": "Password is required"}), 400

        # Check if the user already exists
        is_user = users.find_one({"email": email})
        if is_user:
            return jsonify({"error": True, "message": "User already exists"}), 400


        # Create a new user
        user_data = {
            "fullName": full_name,
            "email": email,
            "password": password
        }
        users.insert_one(user_data)

        return jsonify({
            "error": False,
            "user": {"fullName": full_name, "email": email},
            "message": "Registration Successful"
        }), 200
    except Exception as e:
        return jsonify({"error": True, "message": "Server Error: " + str(e)}), 500



#Login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email:
        return jsonify({"error": True, "message": "Email is required"}), 400

    if not password:
        return jsonify({"error": True, "message": "Password is required"}), 400

    # Find user by email
    user_info = users.find_one({"email": email})

    if not user_info:
        return jsonify({"error": True, "message": "User not found"}), 404
    
    if user_info['password'] == password and user_info['email'] == email:
        return jsonify({
            "error": False,
            "email": email,
            "message": "Login Successful",
        })
    else:
        return jsonify({"error": True, "message": "Invalid Credentials"}), 400
    

#Create Account
@app.route('/addUser', methods=['POST'])
def add_user():
    try:
        data = request.json
        userlist.insert_one(data)

        # return jsonify({
        #     "error": False,
        #     "user": data,
        #     "message": "User Added Successful"
        # }), 200
    except Exception as e:
        return jsonify({"error": True, "message": "Server Error: " + str(e)}), 500
    
#Login
@app.route('/getUsers', methods=['GET'])
def get_user():
    try:
        # Retrieve all users and convert the cursor to a list
        users_data = list(userlist.find())  # Do not exclude `_id`
        for user in users_data:
            user['_id'] = str(user['_id'])  # Exclude `_id` if not needed
        return jsonify(users_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/deleteEmploy/<string:user_id>', methods=['DELETE'])
def delete_employee(user_id):
    try:
        # Convert the user_id to ObjectId
        result = userlist.delete_one({'_id': ObjectId(user_id)})

        if result.deleted_count > 0:
            return jsonify({"message": "Employee deleted successfully"}), 200
        else:
            return jsonify({"error": "Employee not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/updateEmploy', methods=['PUT'])
def update_employee():
    try:
        # Parse the request JSON
        data = request.json
        # data = data.get('_id')
        print(data)

        # Extract `_id` and other fields
        user_id = data.get('_id')
        if not user_id:
            return jsonify({"error": "Missing `_id` in request"}), 400

        # Convert `_id` to ObjectId
        user_id = ObjectId(user_id)

        # Fields to update
        update_fields = {
            "empNo": data.get("empNo"),
            "empName": data.get("empName"),
            "empAddressLine1": data.get("empAddressLine1"),
            "empAddressLine2": data.get("empAddressLine2"),
            "empAddressLine3": data.get("empAddressLine3"),
            "departmentCode": data.get("departmentCode"),
            "dateOfJoin": data.get("dateOfJoin"),
            "dateOfBirth": data.get("dateOfBirth"),
            "basicSalary": data.get("basicSalary"),
            "isActive": data.get("isActive"),
        }


        # Update the employee in the database
        result = userlist.update_one({"_id": user_id}, {"$set": update_fields})

        if result.matched_count > 0:
            return jsonify({"message": "Employee updated successfully"}), 200
        else:
            return jsonify({"error": "Employee not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# main driver function
if __name__ == '__main__':
    app.run()