import base64
import json
import datetime

import cv2
import numpy as np


def convert_json(data):
    return json.loads(json.dumps(data.__dict__, ensure_ascii=False))


def convert_time(time: int, time_type: str):
    if time_type == 'seconds':
        return datetime.datetime.utcnow() + datetime.timedelta(seconds=time)
    elif time_type == 'minutes':
        return datetime.datetime.utcnow() + datetime.timedelta(minutes=time)
    elif time_type == 'hours':
        return datetime.datetime.utcnow() + datetime.timedelta(hours=time)
    elif time_type == 'days':
        return datetime.datetime.utcnow() + datetime.timedelta(days=time)
    elif time_type == 'days':
        return datetime.datetime.utcnow() + datetime.timedelta(days=time)


def convert_datetime_to_str(dt):
    if dt == None:
        return ''
    return dt.strftime('%d-%m-%Y')


def base64_to_frame(image_data):
    # Loại bỏ tiền tố 'data:image/jpeg;base64,' để lấy dữ liệu base64 thuần túy
    _, encoded_data = image_data.split(",", 1)

    # Giải mã base64 thành dữ liệu nhị phân
    decoded_data = base64.b64decode(encoded_data)

    # Chuyển đổi dữ liệu nhị phân thành mảng NumPy
    np_data = np.frombuffer(decoded_data, np.uint8)

    # Đọc ảnh từ mảng NumPy
    frame = cv2.imdecode(np_data, cv2.IMREAD_COLOR)

    return frame