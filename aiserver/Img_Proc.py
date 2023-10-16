from PIL import Image
from io import BytesIO
import pyzbar.pyzbar as pyzbar
import time
import base64
import requests
import uuid
import json
import cv2

global f_n
global allergy
global date

f_n = ''
allergy = []
date = ''

def save_image(encoded_image):
    try:
        image_data = BytesIO(bytes(encoded_image, 'utf-8'))
        image = Image.open(BytesIO(base64.b64decode(encoded_image)))
        image = image.resize((620, 620))
        t = time.localtime(time.time())
        img_time = str(t.tm_year) + '_' + str(t.tm_mon) + '_' + str(t.tm_mday) + '-' + str(t.tm_hour) + '_' + str(
            t.tm_min) + '_' + str(t.tm_sec)
        img_path = 'image/' + img_time + '.jpg'
        image.save(img_path, 'JPEG')
        return image, img_path
    except Exception as e:
        print(f"Error saving image: {e}")
        return 'no_data'

def barcode_decode(img_path):
    try:
        food_n = ''
        image = cv2.imread(img_path)
        decodedObjects = pyzbar.decode(image)
        for i in decodedObjects:
            if len(i.data) >= 12 and len(i.data) <= 14:
                    barcode = str(i.data)
                    barcode = barcode[2:-1]
                    barcode = int(barcode)
                    food_n = food_name(barcode)
    except Exception as e:
        print(e)
    return food_n

def food_name(code):
    try:
        url = 'http://www.allproductkorea.or.kr/products/search?q=%7B"mainKeyword":"' + str(code) + '","subKeyword":""%7D'
        response = requests.get(url)
        text = response.text
        if str(code) in text:
            text_find = text.find(str(code))
            text = text[text_find:]
            text_find1 = text.find('<strong>')
            text_find2 = text.find('</strong>')
            food = text[text_find1 + 8:text_find2]
            if '에 대한 검색 결과가 없습니다.' in food:
                return 'no_data'
    except Exception as e:
        print(e)
        return 'no_data'
    return str(food)

def read_text(img_path):
    try:
        api_url = 'https://luh8ll3zuj.apigw.ntruss.com/custom/v1/25525/c3cc7c2b38b0f4aaf5d30343144aec176a1002543fa2f8a61e67a56c1aeeb7f3/general'
        secret_key = 'dUtpWUJhTUVDRkJTTGZhSFVieUNPaUx2UkltTGVwYXE='
        requests_json = {
            'images': [
                {
                    'format': 'jpg',
                    'name': 'demo'
                }
            ],
            'requestId': str(uuid.uuid4()),
            'version': 'V2',
            'timestamp': int(round(time.time() * 1000))
        }
        payload = {'message': json.dumps(requests_json).encode('UTF-8')}
        files = [
            ('file', open(img_path, 'rb'))
        ]
        headers = {
            'X-OCR-SECRET': secret_key
        }
        response = requests.request('POST', api_url, headers=headers, data=payload, files=files)
        response = json.loads(response.text.encode('utf-8'))
        allergy = allergy_check(response)
        date = date_check(response)
    except Exception as e:
        print(e)
        return [''],'0'

    return allergy, date

def date_check(text):
    date = ['0']
    date_s = 0
    try:
        for i in text['images'][0]['fields']:
            i = i['inferText']
            date_split = i.split('.')
            if len(date_split) == 3:
                if len(date_split[0]) == 2 and len(date_split[1]) == 2 and len(date_split[2]) == 2:
                    date_sum = '20' + date_split[2] + '년' + date_split[0] + '월' + date_split[1] + '일'
                    date.append(date_sum)
                if len(date_split[0]) == 4 and len(date_split[1]) == 2 and len(date_split[2]) == 2:
                    date_sum = date_split[0] + '년' + date_split[1] + '월' + date_split[2] + '일'
                    date.append(date_sum)
                if len(date_split[0]) == 2 and len(date_split[1]) == 2 and len(date_split[2]) == 4:
                    date_sum = date_split[2] + '년' + date_split[0] + '월' + date_split[1] + '일'
                    date.append(date_sum)
        return max(date)
    except Exception as e:
        print(e)
        return max(date)
def allergy_check(text):
    allergy = []
    try:
        for i in text['images'][0]['fields']:
            i = i['inferText']
            if '메밀' in i: allergy.append('메밀')
            if '대두' in i: allergy.append('대두')
            if '호두' in i: allergy.append('호두')
            if '땅콩' in i: allergy.append('땅콩')
            if '복숭아' in i: allergy.append('복숭아')
            if '토마토' in i: allergy.append('토마토')
            if '돼지고기' in i: allergy.append('돼지고기')
            if '계란' in i: allergy.append('계란')
            if '우유' in i: allergy.append('우유')
            if '닭고기' in i: allergy.append('닭고기')
            if '쇠고기' in i: allergy.append('쇠고기')
            if '새우' in i: allergy.append('새우')
            if '고등어' in i: allergy.append('고등어')
            if '홍합' in i in i: allergy.append('홍합')
            if '전복' in i: allergy.append('전복')
            if '조개류' in i: allergy.append('조개류')
            if '오징어' in i: allergy.append('오징어')
            if '아황산' in i: allergy.append('아황산')
            if '게' in i:
                if len(i) <= 1:
                    allergy.append('게')
                if '게,' in i:
                    allergy.append('게')
            if '밀' in i:
                if len(i) <= 1:
                    allergy.append('밀')
                if '밀,' in i:
                    allergy.append('밀')
            if '굴' in i:
                allergy.append('굴')
                if len(i) <= 1:
                    allergy.append('굴')
                if '굴,' in i:
                    allergy.append('굴')
    except Exception as e:
        print(e)
        return allergy
    print(8-2)
    return allergy

def food_save(food_n, a, d):
    try:
        if food_n != 'no_data' and len(food_n) != 0:
            global f_n
            f_n = food_n
        if len(a) > 0:
            global allergy
            for i in a:
                if i not in allergy:
                    allergy.append(i)
        if len(d) > 0:
            global date
            date = max(date, d)
    except Exception as e:
        print(e)
        return
    return

def send_food_data():
    global f_n
    global allergy
    global date
    data = {
        'name': f_n,
        'allergy': allergy,
        'date': date
    }
    f_n = ''
    allergy = []
    date = ''
    return json.dumps(data, default=str, indent=2, ensure_ascii=False)