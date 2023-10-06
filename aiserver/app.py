from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/ImgSend', methods = ['POST', 'GET'])
def ImgSend():
    if request.method == 'POST':
        test_file = request.form['test']
        print(test_file)
        return "POST TEST DATA: %s" %id
    elif request.method == 'GET':
        test_file = request.args.get('test')
        print(type(test_file))
        print(test_file)
        return "GET TEST DATA: %s" %test_file

@app.route('/')
def test():
    print('test')
    return '<h1>Hello World<h1>'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5501, debug=True)
