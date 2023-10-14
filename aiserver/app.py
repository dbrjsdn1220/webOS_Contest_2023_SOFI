from flask import Flask, request, jsonify
from PIL import Image
from io import BytesIO
from ultralytics import YOLO
from roboflow import Roboflow
import cv2
import json
import time
import base64
import numpy as np

global model
model = YOLO('hbest.pt')


app = Flask(__name__)

@app.route('/timeout', methods=['POST'])
def timeout():
    time.sleep(120)
    return 0

@app.route('/ImgSend', methods=['POST'])
def receive_image():
    try:
        data = request.get_json()
        image_data = data.get('data')
        img = save_image(image_data)
        if len(img) < 1:
            return jsonify({'status': 'error'})
        result = yolo_image(img)
        return jsonify({'status': 'success', 'food': '마가렛트', 'allergy':['우유', '밀'], 'date':'2024-01-01', 'data': str(image)})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

def save_image(encoded_image):
    try:
        print(1)
        image_data = BytesIO(bytes(encoded_image, 'utf-8'))
        print(2)
        image = Image.open(BytesIO(base64.b64decode(encoded_image)))
        image = np.array(image)
        return image
    except Exception as e:
        print(f"Error saving image: {e}")
        return

def yolo_image(image):
    rf = Roboflow(api_key="vwQrRvQCJlM3BM1mOiVX")
    project = rf.workspace().project("br_date")
    model = project.version(1).model
    scan_img = model.predict("/Users/hanva/br_date1-1/test/images/29KB1GMYLM_2.jpg", confidence=40, overlap=30).json()
    if len(scan_img['predictions']) == 0:
        return 0
    scan_img = scan_img['predictions'][0]
    if scan_img['class'] == '1' or scan_img['class'] == '2' or scan_img['class'] == '3':
        date = date_scan()
    if scan_img['class'] == '0':
        barcode = barcode_scan()
def date_scan():

def barcode_scan():

def resize_img(image):
    image = cv2.resize(image, dsize=(640,640))
    resize_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    resize_image = cv2.adaptiveThreshold(resize_image, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 2)
    resize_image = cv2.GaussianBlur(resize_image, (0,0), 1)
    i = []
    i.append(image)
    i.append(resize_image)
    return i
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5501)
