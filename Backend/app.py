import os
import re
from turtle import pd
from flask import Flask,request
from flask.json import jsonify
from pymongo import MongoClient 
from flask_cors import CORS, cross_origin
from bson import json_util
from bson.objectid import ObjectId
import csv
import pandas as pd

app = Flask(__name__)
CORS(app) 
# Set up MongoDB connection 
client = MongoClient('mongodb://localhost:27017/') 
db = client.user_management
users = db.users
company = db.company



@app.route('/')
def hello_world():
    return 'Hello World'

#Create Account
@app.route('/create-account', methods=['POST'])
def create_account():
    try:
        data = request.json
        print(data)
        full_name = data.get('fullName')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')
        company = data.get('company')

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
            "password": password,
            "role":role,
            "company":company
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
        # Check if the user already exists
        is_user = users.find_one({"email": data.get('email')})
        if is_user:
            return jsonify({"error": True, "message": "User already exists"}), 400
        
        else:
            users.insert_one(data)
    except Exception as e:
        return jsonify({"error": True, "message": "Server Error: " + str(e)}), 500
    
#Login
@app.route('/getUsers', methods=['GET'])
def get_user():
    try:
        # Retrieve all users and convert the cursor to a list
        users_data = list(users.find())  
        for user in users_data:
            user['_id'] = str(user['_id']) 
        return jsonify(users_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/deleteEmploy/<string:user_id>', methods=['DELETE'])
def delete_employee(user_id):
    try:
        # Convert the user_id to ObjectId
        result = users.delete_one({'_id': ObjectId(user_id)})

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
            "fullName": data.get("fullName"),
            "email": data.get("email"),
            "password": data.get("password"),
            "company": data.get("company"),
            "role": data.get("role"),
        }


        # Update the employee in the database
        result = users.update_one({"_id": user_id}, {"$set": update_fields})

        if result.matched_count > 0:
            return jsonify({"message": "Employee updated successfully"}), 200
        else:
            return jsonify({"error": "Employee not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/uploadBulk', methods=['POST'])
def upload_bulk():
    try:
        file = request.files['file']
        csvFile = pd.read_csv(file)
        # Insert documents into the MongoDB collection
        documents = csvFile.to_dict(orient='records')  # Convert rows to list of dictionaries
        for doc in documents:
          is_user = users.find_one({"email": doc.get('email')})
          if is_user:
              print('Duplicate records')
          else:
              users.insert_one(doc)

        return jsonify({"message": "Bulk upload successful", "insertedCount": len(documents)}), 200
    except Exception as e:
        return jsonify({"error": True, "message": "Server Error: " + str(e)}), 500
    
@app.route('/search//<string:query>', methods=['GET'])
def search_users(query):
    print(query)
    if query:
        # Use regular expression for case-insensitive search
        regex = re.compile(query, re.IGNORECASE)
        search = users.find({
            '$or': [
                {'fullName': {'$regex': regex}},
                {'email': {'$regex': regex}}
            ]
        })
        result = json_util.dumps(list(search))
        print(result)
        return result 
    
#Create Company
@app.route('/addCompany', methods=['POST'])
def add_company():
    try:
        data = request.json
        # Check if the user already exists
        is_user = company.find_one({"name": data.get('name')})
        if is_user:
            return jsonify({"error": True, "message": "User already exists"}), 400
        
        else:
            company.insert_one(data)
    except Exception as e:
        return jsonify({"error": True, "message": "Server Error: " + str(e)}), 500
    
#Get All Companies
@app.route('/getCompany', methods=['GET'])
def get_company():
    try:
        # Retrieve all users and convert the cursor to a list
        company_data = list(company.find())  
        for user in company_data:
            user['_id'] = str(user['_id']) 
        return jsonify(company_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
#Delete Company
@app.route('/deleteCompany/<string:_id>', methods=['DELETE'])
def delete_company(_id):
    try:
        # Convert the user_id to ObjectId
        result = company.delete_one({'_id': ObjectId(_id)})

        if result.deleted_count > 0:
            return jsonify({"message": "Employee deleted successfully"}), 200
        else:
            return jsonify({"error": "Employee not found"}), 404
    except Exception as e:
        return
    
@app.route('/updateEmploy', methods=['PUT'])
def update_company():
    try:
        # Parse the request JSON
        data = request.json
        user_id = data.get('_id')

        # Convert `_id` to ObjectId
        user_id = ObjectId(user_id)

        # Fields to update
        update_fields = {
            "name": data.get("name"),
            "id": data.get("id"),
            "count": data.get("count"),
        }

        result = company.update_one({"_id": user_id}, {"$set": update_fields})

        if result.matched_count > 0:
            return jsonify({"message": "Employee updated successfully"}), 200
        else:
            return jsonify({"error": "Employee not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    



# main driver function
if __name__ == '__main__':
    app.run()