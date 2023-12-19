import os
from pathlib import Path
from threading import Thread

import pika
from dotenv import load_dotenv
from flask import Flask, send_file
from flask_cors import CORS, cross_origin
import pymongo

load_dotenv()

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

mongo_client = pymongo.MongoClient(os.getenv("mongodb_conn_url"))
db = mongo_client["iot-project"]
data_collection = db["data"]
data_collection.create_index([("timestamp", pymongo.DESCENDING)], unique=True)

mq_connection_parameters = pika.URLParameters(os.getenv("rabbitmq_conn_url"))
mq_connection = pika.BlockingConnection(mq_connection_parameters)
mq_channel = mq_connection.channel()
mq_channel.queue_declare(queue="captured")

Path("./captured").mkdir(exist_ok=True)


def mq_message_callback(channel, method, properties, body):
    if method.routing_key != "captured":
        return

    with open(f"./captured/{properties.headers['timestamp']}.jpg", "wb") as f:
        f.write(body)

    try:
        data_collection.insert_one(
            {
                "timestamp": properties.headers["timestamp"],
                "confidence_score": properties.headers["confidence_score"],
                "match_count": properties.headers["match_count"],
                "model_name": properties.headers["model_name"],
            }
        )
    except pymongo.errors.DuplicateKeyError:
        pass

    channel.basic_ack(delivery_tag=method.delivery_tag)


mq_channel.basic_consume(queue="captured", on_message_callback=mq_message_callback)


@app.route("/data", methods=["GET"])
@cross_origin()
def get_data():
    return list(data_collection.find({}, {"_id": 0}))


@app.route("/images/<timestamp>", methods=["GET"])
def serve_image(timestamp):
    try:
        return send_file(f"./captured/{timestamp}.jpg", mimetype="image/jpeg")
    except FileNotFoundError:
        return "Image not found", 404


if __name__ == "__main__":
    try:
        print(" * Listening for messages from RabbitMQ...")
        thread = Thread(target=mq_channel.start_consuming, daemon=True)
        thread.start()
    except KeyboardInterrupt:
        mq_connection.close()

    app.run(debug=True)
