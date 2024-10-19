from flask import Flask, render_template

app = Flask(__name__)

@app.route('/home')
def hello_world():
    return render_template('index.html')


@app.route('/donate')
def donate_page():
    return render_template('donate.html')




if __name__ == '__main__':
    app.run(debug=True)
