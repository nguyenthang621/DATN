from flask import Flask
from flask_socketio import SocketIO, emit
from spyder_kernels.utils.lazymodules import PIL

from . import configMysql
from flask_cors import CORS

# Kết nối DB
from .util.utils import base64_to_frame
from .util.yolov5 import ObjectDetection

db = configMysql.connect()

detection = ObjectDetection(model_weights='weight/last.pt')  # Khởi tạo đối tượng detection

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")


@socketio.on('detect-video')
def handle_frame(image_base64):
    try:
        frame = base64_to_frame(image_base64)
        result = detection.get_bounding_boxes(frame)
        print('result:', result)

        # Gửi lại cho các client khác
        emit('responseEvent', {'result': result}, broadcast=False)
    except PIL.UnidentifiedImageError as error:
        print("Lỗi: Không thể nhận dạng hình ảnh")
        print(error)


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
