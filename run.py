# import asyncio
# from multiprocessing import Process
# from app import create_app, socketio, run_websocket_server
#
#
# app = create_app()
#
#
# def run_flask_app():
#     app.run(host='0.0.0.0', port=5000)
#
#
# if __name__ == '__main__':
#     flask_process = Process(target=run_flask_app)
#     websocket_process = Process(target=run_websocket_server)
#
#     flask_process.start()
#     websocket_process.start()
#
#     flask_process.join()
#     websocket_process.join()


from multiprocessing import Process


from app import create_app, socketio
import threading

app = create_app()


def run_flask_app():
    socketio.run(app, host='0.0.0.0', port=5000)


if __name__ == '__main__':
    flask_thread = threading.Thread(target=app.run, kwargs={'host': '0.0.0.0', 'port': 5000})
    socketio_thread = threading.Thread(target=socketio.run, args=(app,), kwargs={'host': '0.0.0.0', 'port': 8000})

    flask_thread.start()
    socketio_thread.start()

    flask_thread.join()
    socketio_thread.join()
