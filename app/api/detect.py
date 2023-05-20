from . import api
from flask import request
import os
import cv2
from .. import model


@api.route('/detect', methods=['POST'])
def detect():
    fire_list = []
    print(request)
    image = request.files['file']
    if image:
        # Lưu file
        path_to_save = os.path.join('static', image.filename)
        print("Save = ", path_to_save)
        image.save(path_to_save)  # Save ảnh

        frame = cv2.imread(path_to_save)

        # Nhận diên qua model Yolov5
        results = model(path_to_save)
        pandasResult = results.pandas().xyxy[0]

        # Duyệt qua từng dòng trong bảng dữ liệu
        for index, row in pandasResult.iterrows():
            # Tạo dict chứa các giá trị cần thiết
            fire_dict = {
                'fire': {
                    'xmin': row['xmin'],
                    'ymin': row['ymin'],
                    'xmax': row['xmax'],
                    'ymax': row['ymax'],
                    'confidence': row['confidence'],
                    'class': row['class']
                }
            }

            # Thêm dict vào list
            fire_list.append(fire_dict)

        del frame
        # return results.pandas().xyxy[0].to_dict()
        # print(fire_list)
        # Chuyển đổi list thành dict
        res = {'fires': fire_list}
        return {
            'errorCode': 0,
            'data': res
        }
    return 'Upload file to detect'



