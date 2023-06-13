import base64
import datetime
from io import BytesIO

from PIL import Image
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


# tạo phòng and start video real time
@socketio.on("start_video_real_time")
def handle_join_room(room):
    # Tham gia vào room
    print('start_video_real_time:',  room)
    socketio.emit(room, 'Joined room')
    join_room(room)


# remove room and stop video
@socketio.on("stop_video_real_time")
def handle_join_room(room):
    # Tham gia vào room
    print('stop_video_real_time:',  room)
    socketio.emit("stop_video", 'Closed room', room = room)


# esp32 join room:
@socketio.on("join_room_esp32")
def handle_join_room(data):
    # Tham gia vào room
    socketio.emit('response_from_esp32', 'Joined')
    join_room(data['room'])


# esp32 join room:
@socketio.on("leave_room_esp32")
def handle_join_room(data):
    # Tham gia vào room
    socketio.emit('response_from_esp32', 'Leave')


fps = 0  # Biến lưu trữ số ảnh trong 1 giây
frame_count = 0  # Biến đếm số ảnh
last_time = datetime.datetime.now()  # Khởi tạo biến last_time
# bắt đầu lấy ảnh real time:
@socketio.on('jpgstream_serverio')
def handle_binary_data(data):
    global fps, frame_count, last_time
    frame_count += 1  # Tăng biến đếm số ảnh

    # Gửi dữ liệu xử lý về client
    #----------------------------------------------------

    #----------------------------------------------------
    socketio.emit('response_data_image', data, room='idCam')
    # Tính số ảnh trong 1 giây
    current_time = datetime.datetime.now()
    elapsed_time = current_time - last_time

    if elapsed_time.total_seconds() >= 1:
        fps = frame_count
        frame_count = 0
        last_time = current_time
        # Gửi fps về client
        emit('response_fps', fps, room='idCam')


# xử lý control direction:
@socketio.on('send_direction')
def handle_binary_data(direction):
    print("direction: ",direction)
    # Gửi dữ liệu xử lý về esp32
    socketio.emit('response_direction_esp32', direction, room='idCam')


# Handle data của sensor gửi lên
@socketio.on('esp32_cam_send_data_sensor')
def handle_binary_data(data):
    # print("data sensor: ", data)
    # Gửi dữ liệu xử lý về client
    socketio.emit('response_data_sensor_to_client', data, room='idCam')


# xử lý change fps:
@socketio.on('change_fps')
def handle_binary_data(fps):
    # Gửi dữ liệu xử lý về esp32
    socketio.emit('set_fps_esp32', fps, room='idCam')


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



