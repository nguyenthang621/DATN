
from app import create_app, socketio
import threading

app = create_app()

if __name__ == '__main__':
    flask_thread = threading.Thread(target=app.run, kwargs={'host': '0.0.0.0', 'port': 5000})
    socketio_thread = threading.Thread(target=socketio.run, args=(app,), kwargs={'host': '0.0.0.0', 'port': 8000})

    flask_thread.start()
    socketio_thread.start()

    flask_thread.join()
    socketio_thread.join()



