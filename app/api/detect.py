from . import api
from flask import request, jsonify
from app.api.errors import internal_server_error, bad_request
from app import detection
from PIL import Image
import numpy as np


@api.route('/detect', methods=['POST'])
def detect():
    image = request.files['image']
    # image = request.data
    try:
        if image:
            # Đọc ảnh từ request
            img = Image.open(image)

            # Chuyển đổi ảnh thành numpy array
            frame = np.array(img)

            # Nhận diện qua model YOLOv5
            results = detection.get_bounding_boxes(frame)

            # Xử lý kết quả và trả về dưới dạng JSON
            # ...
            return jsonify({'success': True, 'data': {'fires': results}})

        return bad_request(message='No image')
    except Exception as error:
        # Xử lý lỗi chung
        return internal_server_error(message=str(error))
