from flask import Flask

# Create a Flask application instance
app = Flask(__name__)


# Define a route for the root URL ("/")
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


# Run the Flask development server
if __name__ == "__main__":
    app.run(debug=True)
