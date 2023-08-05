import cv2
from app.api import api
from flask import request, jsonify
from app.api.errors import internal_server_error, bad_request
from app import detection
from PIL import Image
import numpy as np

from app.util.sendMail import sendEmail


@api.route('/test-detect/<string:ipCam>', methods=['POST'])
def detect(ipCam):
    if not ipCam:
        return bad_request(message='No id Camera')
    image = request.files['image']
    try:
        if image:
            # Đọc ảnh từ request
            img = Image.open(image)

            # Chuyển đổi ảnh thành numpy array
            frame = np.array(img)

            # Nhận diện qua model YOLOv5
            results = detection.get_bounding_boxes(frame)
            print(results)
            # if len(results) > 0:
            #     sendEmail()
            return jsonify({'success': True, 'data': {'fires': results}})

        return bad_request(message='No image')
    except Exception as error:
        # Xử lý lỗi chung
        return internal_server_error(message=str(error))


@api.route('/detect/<string:idCam>', methods=['POST'])
def upload_image(idCam):
    image = request.data
    print(">>>>>>>>>>>>:", len(image), "bytes")
    # Đọc frame ảnh từ dữ liệu ảnh nhị phân
    frame = cv2.imdecode(np.frombuffer(image, np.uint8), cv2.IMREAD_UNCHANGED)
    results = detection.get_bounding_boxes(frame)
    print(results)

    return jsonify({'success': True, 'data': {'fires': results}})