from flask import Blueprint, jsonify, request
from db.database import database
import hashlib
import jwt
import uuid
import socketio
from decouple import config

routes_restaurant = Blueprint('routes_restaurant', __name__, url_prefix='/api/restaurants')


@routes_restaurant.route('/registerRestaurant', methods=['POST'], strict_slashes=False)
def registerRestaurant():
    try:
        req = request.get_json()
    except Exception as e:
        return jsonify({'Error': 'Invalid JSON', 'Message': str(e)}), 401

    try:
        sessionToken = request.headers.get('Authorization').replace("Token ", "").replace("Bearer ", "")
    except Exception as e:
        return jsonify({'Error': 'No Bearer', 'Message': str(e)}), 401

    session = database["sessions"].find_one({"sessionToken": sessionToken})

    if session is None:
        return jsonify({"status": 401, "message": "session not found"})

    findUserQuery = database["users"].find_one({"userID": session.get("userID")})

    name = req.get("name")
    address = req.get("address")
    postalCode = req.get("postalCode")
    img = req.get("img")

    if name is None or address is None or postalCode is None or img is None:
        return jsonify({"status": 401}), 401

    database["restaurants"].insert_one({"name": name, "address": address, "postalCode": postalCode, "img": img, "userID": session.get("userID"), "open": False})

    return jsonify({"name": name, "address": address, "postalCode": postalCode, "img": img, "userID": session.get("userID"), "status": 200})


@routes_restaurant.route('/addItem', methods=['POST'], strict_slashes=False)
def addItem():
    try:
        req = request.get_json()
    except Exception as e:
        return jsonify({'Error': 'Invalid JSON', 'Message': str(e)}), 401

    try:
        sessionToken = request.headers.get('Authorization').replace("Token ", "").replace("Bearer ", "")
    except Exception as e:
        return jsonify({'Error': 'No Bearer', 'Message': str(e)}), 401

    session = database["sessions"].find_one({"sessionToken": sessionToken})

    if session is None:
        return jsonify({"status": 401, "message": "session not found"})

    findUserQuery = database["users"].find_one({"userID": session.get("userID")})

    itemName = req.get("itemName")
    quantity = req.get("quantity")
    img = req.get("imgURL")

    if itemName is None or quantity is None or img is None:
        return jsonify({"status": 401})

    itemID = str(uuid.uuid4())

    database["items"].insert_one({
        "itemName": itemName,
        "quantity": int(quantity),
        "img": img,
        "userID": session.get("userID"),
        "itemID": itemID
    })

    findItemsQuery = database["items"].find({"userID": session.get("userID")}, {"_id": False})

    return jsonify({"status": 200, "items": list(findItemsQuery)})


@routes_restaurant.route('/getItems', methods=['GET'], strict_slashes=False)
def getItems():
    try:
        sessionToken = request.headers.get('Authorization').replace("Token ", "").replace("Bearer ", "")
    except Exception as e:
        return jsonify({'Error': 'No Bearer', 'Message': str(e)}), 401

    session = database["sessions"].find_one({"sessionToken": sessionToken})

    if session is None:
        return jsonify({"status": 401, "message": "session not found"})

    findItemsQuery = database["items"].find({"userID": session.get("userID")}, {"_id": False})

    return jsonify({"status": 200, "items": list(findItemsQuery)})


@routes_restaurant.route('/getRequests', methods=['GET'], strict_slashes=False)
def getRequests():
    try:
        sessionToken = request.headers.get('Authorization').replace("Token ", "").replace("Bearer ", "")
    except Exception as e:
        return jsonify({'Error': 'No Bearer', 'Message': str(e)}), 401

    session = database["sessions"].find_one({"sessionToken": sessionToken})

    if session is None:
        return jsonify({"status": 401, "message": "session not found"})

    findRequestsQuery = database["requests"].find({"restaurantID": session.get("userID"), "status": "pending"}, {"_id": False})

    return jsonify({"status": 200, "requests": list(findRequestsQuery)})


@routes_restaurant.route('/incrementItem/<itemID>', methods=['GET'], strict_slashes=False)
def incrementItem(itemID):
    try:
        sessionToken = request.headers.get('Authorization').replace("Token ", "").replace("Bearer ", "")
    except Exception as e:
        return jsonify({'Error': 'No Bearer', 'Message': str(e)}), 401

    session = database["sessions"].find_one({"sessionToken": sessionToken})

    if session is None:
        return jsonify({"status": 401, "message": "session not found"})

    database["items"].update_one({"itemID": itemID}, {"$inc": {"quantity": 1}})

    findItemsQuery = database["items"].find({"userID": session.get("userID")}, {"_id": False})

    return jsonify({"status": 200, "items": list(findItemsQuery)})


@routes_restaurant.route('/decrementItem/<itemID>', methods=['GET'], strict_slashes=False)
def decrementItem(itemID):
    try:
        sessionToken = request.headers.get('Authorization').replace("Token ", "").replace("Bearer ", "")
    except Exception as e:
        return jsonify({'Error': 'No Bearer', 'Message': str(e)}), 401

    session = database["sessions"].find_one({"sessionToken": sessionToken})

    if session is None:
        return jsonify({"status": 401, "message": "session not found"})

    database["items"].update_one({"itemID": itemID}, {"$inc": {"quantity": -1}})

    findItemsQuery = database["items"].find({"userID": session.get("userID")}, {"_id": False})

    return jsonify({"status": 200, "items": list(findItemsQuery)})


@routes_restaurant.route('/deleteItem/<itemID>', methods=['GET'], strict_slashes=False)
def deleteItem(itemID):
    try:
        sessionToken = request.headers.get('Authorization').replace("Token ", "").replace("Bearer ", "")
    except Exception as e:
        return jsonify({'Error': 'No Bearer', 'Message': str(e)}), 401

    session = database["sessions"].find_one({"sessionToken": sessionToken})

    if session is None:
        return jsonify({"status": 401, "message": "session not found"})

    database["items"].delete_one({"itemID": itemID})

    findItemsQuery = database["items"].find({"userID": session.get("userID")}, {"_id": False})

    return jsonify({"status": 200, "items": list(findItemsQuery)})


@routes_restaurant.route('/edit/', methods=['GET'], strict_slashes=False)
def editRestaurant():
    try:
        sessionToken = request.headers.get('Authorization').replace("Token ", "").replace("Bearer ", "")
    except Exception as e:
        return jsonify({'Error': 'No Bearer', 'Message': str(e)}), 401

    session = database["sessions"].find_one({"sessionToken": sessionToken})

    if session is None:
        return jsonify({"status": 401, "message": "session not found"})

    findUserQuery = database["restaurants"].find_one({"userID": session.get("userID")})
    status = findUserQuery.get("open")

    database["restaurants"].find_one_and_update({"userID": session.get("userID")}, {"$set": {"open": not status}})

    findRestaurantsQuery = database["restaurants"].find({"open": True}, {"_id": False})

    sio = socketio.Client()
    sio.connect(config("SOCKET_SERVER_URL"))
    sio.emit('message', {'restaurants': list(findRestaurantsQuery)})

    return jsonify({"status": 200})


@routes_restaurant.route('/acceptRequest/<requestID>', methods=['GET'], strict_slashes=False)
def acceptRequest(requestID):
    try:
        sessionToken = request.headers.get('Authorization').replace("Token ", "").replace("Bearer ", "")
    except Exception as e:
        return jsonify({'Error': 'No Bearer', 'Message': str(e)}), 401

    session = database["sessions"].find_one({"sessionToken": sessionToken})

    if session is None:
        return jsonify({"status": 401, "message": "session not found"})

    database["requests"].find_one_and_update({"requestID": requestID}, {"$set": {"status": "accepted"}})

    findRequestsQuery = database["requests"].find_one({"requestID": requestID}, {"_id": False})

    sio = socketio.Client()
    sio.connect(config("SOCKET_SERVER_URL"))

    findRequestsQueryList = database["requests"].find({"receiverID": findRequestsQuery.get("receiverID")}, {"_id": False})

    sio.emit('message', {'userID': findRequestsQuery.get("receiverID"),'status': 'accepted', 'requestID': requestID, "requests": list(findRequestsQueryList)})

    findRequestsQueryRestaurant = database["requests"].find({"receiverID": session.get("userID")}, {"_id": False})

    return jsonify({"status": 200, "requests": list(findRequestsQueryRestaurant)})
