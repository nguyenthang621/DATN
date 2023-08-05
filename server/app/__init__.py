import datetime
import os
import threading

import cv2
import numpy as np
from flask import Flask
from flask_socketio import SocketIO, emit, join_room, leave_room

from app import configMysql
from flask_cors import CORS

# Kết nối DB

from .util.utils import base64_to_frame, is_valid_image, convert_json
from .util.yolov5 import ObjectDetection
from flask_mail import Mail

db = configMysql.connect()

detection = ObjectDetection(model_weights='weight3/last23.pt')  # Khởi tạo đối tượng detection

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", max_packet_size=1024*1024, ping_timeout=30)

CORS(app)
# -----------------------------------------------------------------


app.config['SECRET_KEY'] = "qpsqsleewnwywcpp"

app.config['MAIL_SERVER'] = "smtp.googlemail.com"

app.config['MAIL_PORT'] = 587

app.config['MAIL_USE_TLS'] = True

app.config['MAIL_USERNAME'] = "nthnag621@gmail.com"

app.config['MAIL_PASSWORD'] = "qpsqsleewnwywcpp"

mail = Mail(app)

is_streaming = False


def get_room_member_count(room):
    return len(socketio.server.manager.rooms['/'][room])


@socketio.on('connection')
def handle_message(message):
    print("Socket Connected >>>")


# tạo phòng and start video real time
@socketio.on("start_video_real_time")
def handle_join_room_client(room):
    global is_streaming
    # Tham gia vào room
    print('start_video_real_time:', room)
    is_streaming = True
    socketio.emit(room, 'Joined room')
    join_room(room)


# remove room and stop video
@socketio.on("stop_video_real_time")
def handle_leave_room_client(room):
    global is_streaming
    # Tham gia vào room
    print('stop_video_real_time:', room)
    is_streaming = False
    socketio.emit("stop_video", 'Closed room', room=room)
    leave_room(room)


# esp32 join room:
@socketio.on("join_room_esp32")
def handle_join_room_esp32(data):
    # Tham gia vào room
    socketio.emit('response_from_esp32', 'Joined')
    join_room(data['room'])


# esp32 leave room:
@socketio.on("leave_room_esp32")
def handle_leave_room_esp32(data):
    # rời room
    socketio.emit('response_from_esp32', 'Leave')


fps = 0  # Biến lưu trữ số ảnh trong 1 giây
frame_count = 0  # Biến đếm số ảnh
last_time = datetime.datetime.now()  # Khởi tạo biến last_time
count = 5000

# bắt đầu lấy ảnh real time:
@socketio.on('jpgstream_serverio')
def handle_binary_data(data):
    global fps, frame_count, last_time, is_streaming, count
    count += 1
    frame_count += 1  # Tăng biến đếm số ảnh
    print("Dung lượng ảnh nhị phân 1:", len(data['pic']), "bytes")
    print(get_room_member_count('idCam'))
    if not is_streaming:
        # Chuyển đổi dữ liệu ảnh nhận được thành mảng numpy
        nparr = np.frombuffer(data['pic'], np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # # Đặt tên tập tin ảnh dựa vào số thứ tự của frame
        # image_filename = os.path.join('static/image2', f"frame_{count}.jpg")
        #
        # # Lưu ảnh vào thư mục
        # cv2.imwrite(image_filename, frame)

        # Thực hiện phát hiện đối tượng bằng YOLOv5
        results_robot, results = detection.get_bounding_boxes(frame)
        emit('response_data_image', results_robot, room='idCam', broadcast=False)
        print(results_robot)

    if is_streaming and get_room_member_count('idCam') >= 3:
        # Gửi dữ liệu ảnh về client
        emit('response_data_image', {'data': data}, room='idCam', broadcast=False)
    # Tính số ảnh trong 1 giây (FPS)
    current_time = datetime.datetime.now()
    elapsed_time = current_time - last_time

    # Gửi FPS về cho client
    if elapsed_time.total_seconds() >= 1:
        fps = frame_count
        frame_count = 0
        last_time = current_time
        # Gửi fps về client
        emit('response_fps', fps, room='idCam')


# xử lý control direction:
@socketio.on('send_direction')
def handle_binary_data(direction):
    print("direction: ", direction)
    # Gửi dữ liệu xử lý về esp32
    socketio.emit('response_direction_esp32', direction, room='idCam')


# Handle data của sensor gửi lên
@socketio.on('esp32_cam_send_data_sensor')
def handle_binary_data(data):
    # Gửi dữ liệu xử lý về client
    socketio.emit('response_data_sensor_to_client',  data, room='idCam')


# xử lý change fps:
@socketio.on('change_fps')
def handle_binary_data(fps):
    # Gửi dữ liệu xử lý về esp32
    socketio.emit('set_fps_esp32', fps, room='idCam')


# ------------------------------------------
# ------------------------------------------


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
