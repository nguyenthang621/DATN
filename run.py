from app import create_app, socketio

app = create_app()

if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=5001, debug=False)
    # app.run( port=5000, debug=False)
    socketio.run(app, debug=True, port=80, host='0.0.0.0')
