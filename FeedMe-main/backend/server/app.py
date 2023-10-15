from flask import Flask
from flask_cors import CORS
from routes.auth import routes_auth
from routes.restaurant import routes_restaurant
from routes.customer import routes_customer

app = Flask(__name__)
CORS(app)

app.register_blueprint(routes_auth)
app.register_blueprint(routes_restaurant)
app.register_blueprint(routes_customer)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)