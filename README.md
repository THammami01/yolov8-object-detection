# Yolo v8 Object Detection

## Topic

Detecting objects in real-time, with a focus on Person class.

## Technology Choices

![Technology Choices](./docs/technology-choices.png)

## Object Detection Model - Publisher Demo

![Object Detection Demo](./docs/object-detection-demo.png)

## Message Broker Demo

![Message Broker Demo](./docs/message-broker-demo.png)

- Consists of a single queue named `captured`.
- This queue is empty as all messages have been acknowledged.

## Backend Demo

![Backend Demo](./docs/backend-demo.png)

- `/data` endpoint returns data saved in the MongoDB database.
- `/images/<timestamp>` returns saved images in `/captured/:<timestamp>.jpg` disk path.

## Frontend Demo

![Frontend Demo 01](./docs/frontend-demo-01.png)

![Frontend Demo 02](./docs/frontend-demo-02.png)

![Frontend Demo 03](./docs/frontend-demo-03.png)
