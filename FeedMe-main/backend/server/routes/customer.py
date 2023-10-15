from flask import Blueprint, jsonify, request
from db.database import database
import hashlib
import jwt
import uuid

routes_customer = Blueprint('routes_customer', __name__, url_prefix='/api/customers')


@routes_customer.route('/getRestaurants', methods=['GET'], strict_slashes=False)
def getRestaurants():
    try:
        sessionToken = request.headers.get('Authorization').replace("Token ", "").replace("Bearer ", "")
    except Exception as e:
        return jsonify({'Error': 'No Bearer', 'Message': str(e)}), 401

    session = database["sessions"].find_one({"sessionToken": sessionToken})

    if session is None:
        return jsonify({"status": 401, "message": "session not found"})

    findRestaurantsQuery = database["restaurants"].find({"open": True}, {"_id": False})

    findRequestsQuery = database["requests"].find({"receiverID": session.get("userID")}, {"_id": False})

    return jsonify({"status": 200, "restaurants": list(findRestaurantsQuery), "requests": list(findRequestsQuery), "userID": session.get("userID")})


@routes_customer.route('/get/<restaurantID>', methods=['GET'], strict_slashes=False)
def getRestaurantByID(restaurantID):
    try:
        sessionToken = request.headers.get('Authorization').replace("Token ", "").replace("Bearer ", "")
    except Exception as e:
        return jsonify({'Error': 'No Bearer', 'Message': str(e)}), 401

    session = database["sessions"].find_one({"sessionToken": sessionToken})

    if session is None:
        return jsonify({"status": 401, "message": "session not found"})

    findRestaurantsQuery = database["items"].find({"userID": restaurantID, "quantity": {"$gt": 0}}, {"_id": False})

    return jsonify({"status": 200, "data": list(findRestaurantsQuery)})


@routes_customer.route('/makeRequest/<restaurantID>/<itemID>', methods=['GET'], strict_slashes=False)
def makeRequest(restaurantID, itemID):
    try:
        sessionToken = request.headers.get('Authorization').replace("Token ", "").replace("Bearer ", "")
    except Exception as e:
        return jsonify({'Error': 'No Bearer', 'Message': str(e)}), 401

    session = database["sessions"].find_one({"sessionToken": sessionToken})

    if session is None:
        return jsonify({"status": 401, "message": "session not found"})

    requestID = str(uuid.uuid4())

    findRestaurantQuery = database["restaurants"].find_one({"userID": restaurantID}, {"_id": False})

    findItemQuery = database["items"].find_one({"itemID": itemID}, {"_id": False})

    database["requests"].insert_one({"receiverID": session.get("userID"), "requestID": requestID, "itemID": itemID,
                                     "restaurantID": restaurantID, "status": "pending", "name": findRestaurantQuery.get("name"), "address": findRestaurantQuery.get("address")
                                     ,"postalCode": findRestaurantQuery.get("postalCode"), "itemName": findItemQuery.get("itemName")})

    findRequestsQuery = database["requests"].find({"receiverID": session.get("userID")}, {"_id": False})

    return jsonify({"status": 200, "requests": list(findRequestsQuery)})
