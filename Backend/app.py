import os
import re
from flask import Flask,request
from flask.json import jsonify
from pymongo import MongoClient 
from flask_cors import CORS, cross_origin
from bson import json_util
from bson.objectid import ObjectId
import csv
import pandas as pd
from dotenv import load_dotenv


load_dotenv()
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")

app = Flask(__name__)
CORS(app) 
# Set up MongoDB connection 
client = MongoClient(mongo_uri) 
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
            return jsonify({"error": True, "message": "Full Name is required"})
        if not email:
            return jsonify({"error": True, "message": "Email is required"})
        if not password:
            return jsonify({"error": True, "message": "Password is required"})

        # Check user already exists
        is_user = users.find_one({"email": email})
        if is_user:
            return jsonify({"error": True, "message": "User already exists"})


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
        })
    except Exception as e:
        return jsonify({"error": True, "message": "Server Error: " + str(e)})



#Login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email:
        return jsonify({"error": True, "message": "Email is required"})

    if not password:
        return jsonify({"error": True, "message": "Password is required"})

    # Find user by email
    user_info = users.find_one({"email": email})

    if not user_info:
        return jsonify({"error": True, "message": "User not found"})
    
    if user_info['password'] == password and user_info['email'] == email:
        return jsonify({
            "error": False,
            "email": email,
            "message": "Login Successful",
        })
    else:
        return jsonify({"error": True, "message": "Invalid Credentials"})
    

#Create Account
@app.route('/addUser', methods=['POST'])
def add_user():
    try:
        data = request.json
        # Check user already exists
        is_user = users.find_one({"email": data.get('email')})
        if is_user:
            return jsonify({"error": True, "message": "User already exists"})
        
        else:
            users.insert_one(data)
    except Exception as e:
        return jsonify({"error": True, "message": "Server Error: " + str(e)})
    
#Login
@app.route('/getUsers', methods=['GET'])
def get_user():
    try:
        users_data = list(users.find())  
        for user in users_data:
            user['_id'] = str(user['_id']) 
        return jsonify(users_data)
    except Exception as e:
        return jsonify({"error": str(e)})
    
@app.route('/deleteEmploy/<string:user_id>', methods=['DELETE'])
def delete_employee(user_id):
    try:
        # Convert user_id to ObjectId 
        user = users.find_one({'_id': ObjectId(user_id)})
        if not user:
            return jsonify({"error": "Employee not found"})

        company_name = user.get('company')

        # Delete the user
        result = users.delete_one({'_id': ObjectId(user_id)})

        if result.deleted_count > 0:
            # Count remaining users in the company
            user_count = users.count_documents({'company': company_name})

            # If no users remain, delete the company
            if user_count == 0:
                company.delete_one({'name': company_name})
                return jsonify({
                    "message": "Employee deleted successfully. Company also removed as no users are associated with it."
                }), 200

            return jsonify({"message": "Employee deleted successfully"})

        else:
            return jsonify({"error": "Employee not found"})
    except Exception as e:
        return jsonify({"error": str(e)})
    
@app.route('/updateEmploy', methods=['PUT'])
def update_employee():
    try:
        data = request.json
        user_id = data.get('_id')
        if not user_id:
            return jsonify({"error": "Missing `_id` in request"})

        # Convert `_id` to ObjectId
        user_id = ObjectId(user_id)
        update_fields = {
            "fullName": data.get("fullName"),
            "email": data.get("email"),
            "password": data.get("password"),
            "company": data.get("company"),
            "role": data.get("role"),
        }

        result = users.update_one({"_id": user_id}, {"$set": update_fields})

        if result.matched_count > 0:
            return jsonify({"message": "Employee updated successfully"})
        else:
            return jsonify({"error": "Employee not found"})

    except Exception as e:
        return jsonify({"error": str(e)})
    
@app.route('/uploadBulk', methods=['POST'])
def upload_bulk():
    try:
        file = request.files['file']
        if file.filename.endswith('.csv'):
            data_file = pd.read_csv(file)
        elif file.filename.endswith('.xlsx'):
            data_file = pd.read_excel(file)
    
        documents = data_file.to_dict(orient='records')  # Convert rows to list of dictionaries
        for doc in documents:
          is_user = users.find_one({"email": doc.get('email')})

          if is_user:
              print('Duplicate records')
          else:
              users.insert_one(doc)

        return jsonify({"message": "Bulk upload successful", "insertedCount": len(documents)})
    except Exception as e:
        return jsonify({"error": True, "message": "Server Error: " + str(e)})
    
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
            return jsonify({"error": True, "message": "User already exists"})
        
        else:
            company.insert_one(data)
    except Exception as e:
        return jsonify({"error": True, "message": "Server Error: " + str(e)})
    
#Get All Companies
@app.route('/getCompany', methods=['GET'])
def get_company():
    try:
        company_data = list(company.find())  
        for user in company_data:
            user['_id'] = str(user['_id']) 
        return jsonify(company_data)
    except Exception as e:
        return jsonify({"error": str(e)})
    
#Delete Company
@app.route('/deleteCompany/<string:_id>', methods=['DELETE'])
def delete_company(_id):
    try:
        # Convert the user_id to ObjectId
        result = company.delete_one({'_id': ObjectId(_id)})

        if result.deleted_count > 0:
            return jsonify({"message": "Employee deleted successfully"})
        else:
            return jsonify({"error": "Employee not found"})
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

        update_fields = {
            "name": data.get("name"),
            "id": data.get("id"),
            "count": data.get("count"),
        }

        result = company.update_one({"_id": user_id}, {"$set": update_fields})

        if result.matched_count > 0:
            return jsonify({"message": "Employee updated successfully"})
        else:
            return jsonify({"error": "Employee not found"})

    except Exception as e:
        return jsonify({"error": str(e)})

    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)