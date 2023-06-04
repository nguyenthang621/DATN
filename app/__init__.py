import datetime
from flask import Flask, request
from flask_socketio import SocketIO, emit, Namespace, join_room, close_room

from app import configMysql
from flask_cors import CORS

# Kết nối DB
from .util.utils import base64_to_frame, is_valid_image, convert_json
from .util.yolov5 import ObjectDetection

db = configMysql.connect()

detection = ObjectDetection(model_weights='weight/last2.pt')  # Khởi tạo đối tượng detection

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

# -----------------------------------------------------------------


@socketio.on('connection')
def handle_message(message):
    print("Socket Connected >>>")


# tạo phòng and start
@socketio.on("join_room_and_start_video_real_time")
def handle_join_room(room):
    # Tham gia vào room
    print('join_room_and_start_video_real_time:',  room)
    socketio.emit(room, 'Joined room')
    join_room(room)


# remove room and stop video
@socketio.on("remove_room_and_stop_video_real_time")
def handle_join_room(room):
    # Tham gia vào room
    print('join_room_and_start_video_real_time:',  room)
    socketio.emit("close_room", 'Closed room')
    # close_room(room)


# esp32 join room:
@socketio.on("join_room_esp32")
def handle_join_room(data):
    # Tham gia vào room
    socketio.emit('response_from_esp32', 'ESP32 Joined :)')
    join_room(data['room'])


# esp32 join room:
@socketio.on("close_room_esp32")
def handle_join_room(data):
    # Tham gia vào room
    socketio.emit('response_from_esp32', 'ESP32 leave :)')
    # close_room(data['room'])


# bắt đầu lấy ảnh real time:
@socketio.on('jpgstream_serverio')
def handle_binary_data(data):
    print("nhận được data",datetime.datetime.now())
    # Gửi dữ liệu xử lý về client
    socketio.emit('response_data_image', data, room='idCam')


def create_app():
    # Apply Flask CORS
    CORS(app, resources={r"/*": {"origins": "*"}})
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.config['UPLOAD_FOLDER'] = "static"

    if db is not None:
        print("Kết nối MySQL thành công!")
    else:
        print("Kết nối MySQL thất bại!")

    from .api import api as api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api/v1')

    return app



