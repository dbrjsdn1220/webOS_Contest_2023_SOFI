from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/ImgSend', methods = ['POST', 'GET'])
def ImgSend():
    return 0

@app.route('/')
def test():
    print('test')
    return '<h1>Hello World<h1>'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5501)