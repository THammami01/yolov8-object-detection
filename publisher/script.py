import math
import os
from datetime import datetime
from pathlib import Path

import cv2
import numpy as np
import pika
from dotenv import load_dotenv
from PIL import Image, ImageDraw, ImageFont
from ultralytics import YOLO

load_dotenv()

mq_connection_parameters = pika.URLParameters(os.getenv("rabbitmq_conn_url"))
mq_connection = pika.BlockingConnection(mq_connection_parameters)
mq_channel = mq_connection.channel()
mq_channel.queue_declare(queue="captured")

Path("./captured").mkdir(exist_ok=True)

image_font = ImageFont.truetype(
    "./fonts/Roboto-Regular.ttf",
    24,
)

model_name = os.getenv("model_name")
model = YOLO(f"./models/{model_name}.pt")
class_names = ["Person"]

cap = cv2.VideoCapture(0)  # START CAMERA
cap.set(3, 640)
cap.set(4, 480)

while True:
    success, img = cap.read()
    results = model(img, stream=True)  # COORDINATES OF OBJECTS
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = Image.fromarray(img)
    draw = ImageDraw.Draw(img)

    is_success = False
    total_confidence = 0
    match_count = 0

    for r in results:
        boxes = r.boxes

        for box in boxes:
            if class_name_idx := int(box.cls[0]) != 0:  # IF NOT A PERSON, SKIP
                continue

            if not is_success:
                is_success = True

            confidence = math.ceil((box.conf[0] * 100)) / 100
            total_confidence += confidence
            match_count += 1
            print(
                f"CLASS NAME: {class_names[class_name_idx].upper()} - CONFIDENCE: {confidence}"
            )

            x1, y1, x2, y2 = box.xyxy[0]  # BOX COORDINATES
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)

            text = f"{class_names[class_name_idx]} {confidence}"
            w = draw.textlength(text, image_font)

            draw.rectangle(
                (x1, y1 - 30, x1 + w, y1),
                fill="#ff0000",
                width=2,
            )

            draw.text(
                (x1, y1 - 30),
                text,
                font=image_font,
                fill="#ffffff",
            )

            draw.rectangle(
                (x1, y1, x2, y2),
                outline="#ff0000",
                width=2,
            )

    byte_img = np.array(img)
    img = cv2.cvtColor(byte_img, cv2.COLOR_RGB2BGR)
    cv2.imshow("Stream", img)

    if is_success:
        timestamp = int(datetime.now().timestamp())
        img_path = f"./captured/{timestamp}.jpg"
        cv2.imwrite(img_path, img)

        with open(img_path, "rb") as f:
            byte_img = f.read()

        mq_channel.basic_publish(
            exchange="",
            routing_key="captured",
            body=byte_img,
            properties=pika.BasicProperties(
                headers={
                    "timestamp": str(timestamp),
                    "confidence_score": str(total_confidence / match_count),
                    "match_count": str(match_count),
                    "model_name": model_name,
                }
            ),
        )  # RABBITMQ ACCEPTS 128MB MAX SIZE PER MESSAGE BY DEFAULT

    if cv2.waitKey(1) == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()

mq_connection.close()
