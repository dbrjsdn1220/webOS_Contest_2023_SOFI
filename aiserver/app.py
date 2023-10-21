from flask import Flask, request, jsonify

import Img_Proc as ip
import json

app = Flask(__name__)
@app.route('/ImgReceive', methods=['GET', 'POST'])
def send_image():
    data = ip.send_food_data()
    return data

@app.route('/ImgSend', methods=['POST'])
def receive_image():
    try:
        data = request.get_json()
        image_data = data.get('data')
        img, img_path = ip.save_image(image_data)
        if img == 'no_data':
            return jsonify({'status':'error'})
        fo_na = ip.barcode_decode(img_path)
        allergy_date = ip.read_text(img_path)
        ip.food_save(fo_na, allergy_date[0], allergy_date[1])
        return jsonify({'status':'success'})
    except Exception as e:
        print(e)
        return jsonify({'status':'error'})

@app.route('/getUser', methods=['POST', 'GET'])
def get_user():
    data = user_file_load()
    return jsonify(data)

@app.route('/saveUser', methods=['POST','GET'])
def save_user():
    name = request.json['name']
    allergy = request.json['allergy']
    data = user_file_load()
    user_id = 0
    while any(user['id'] == user_id for user in data):
        user_id += 1

    user_data = {'id': user_id, 'name': name, 'allergy': allergy}
    data.append(user_data)

    with open('user.json', 'w') as file:
        json.dump(data, file, indent=2, ensure_ascii=False)

    return 'Data has been successfully saved.', 200

# Delete data
@app.route('/deleteUser', methods=['DELETE'])
def delete_user():
    user_id = request.json['id']
    user_id = int(user_id)
    data = user_file_load()
    for i, user in enumerate(data):
        if user['id'] == user_id:
            del data[i]
            break
    with open('user.json', 'w') as file:
        json.dump(data, file, indent=2, ensure_ascii=False)

    return 'Data has been successfully deleted.', 200

@app.route('/getFood', methods=['POST', 'GET'])
def get_Food():
    data = food_file_load()
    return jsonify(data)


def user_file_load():
    try:
        with open('user.json', 'r') as file:
            data = json.load(file)
    except FileNotFoundError:
        print("user.json 파일을 찾을 수 없습니다.")
    return data

def food_file_load():
    try:
        with open('product.json', 'r') as file:
            data = json.load(file)
    except FileNotFoundError:
        print("food.json 파일을 찾을 수 없습니다.")
    return data

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5501, debug=True)
