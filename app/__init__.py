from flask import Flask
from . import configMysql
from flask_cors import CORS
import torch

# Kết nối DB
db = configMysql.connect()

# Kiểm tra xem GPU có khả dụng không
if torch.cuda.is_available():
    print("GPU khả dụng trên hệ thống của bạn!")
    device = torch.device('cuda')  # Thiết lập thiết bị là GPU
else:
    print("GPU KHÔNG khả dụng trên hệ thống của bạn! ==> Sử dụng CPU để detect")
    device = torch.device('cpu')  # Thiết lập thiết bị là CPU
# Khởi tạo modal
model = torch.hub.load('ultralytics/yolov5', 'custom', path='weight/best2.pt').to(device)


def create_app():
    app = Flask(__name__)

    # Apply Flask CORS
    CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.config['UPLOAD_FOLDER'] = "static"

    if db is not None:
        print("Kết nối MySQL thành công!")
    else:
        print("Kết nối MySQL thất bại!")

    from .api import api as api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api/v1')

    return app
