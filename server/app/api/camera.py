import uuid

from flask import request, jsonify

from app import db
from app.api import api
from app.api.decorators import validate_json_content_type, token_required
from app.api.errors import bad_request, internal_server_error, conflict, not_found
from app.util.type import Camera
from mysql.connector import Error

from app.util.utils import check_keyword


# Insert camera
@api.route('/camera', methods=['POST'])
@validate_json_content_type
@token_required
def insert_camera(self):
    args = request.get_json()
    if 'ip_address' not in args:
        return bad_request(message='Thiếu IP_address')
    if 'user_id' not in args:
        return bad_request(message='Thiếu id người dùng')

    try:
        p_ip_address = args['ip_address']
        p_user_id = args['user_id']
        p_name = args['name']
        p_location = args['location']
        p_id = str(uuid.uuid4())
        cursor = db.cursor()
        # Gọi Stored Procedure "Pro_camera_insert" và truyền các tham số
        cursor.callproc('Proc_camera_insert', [p_id, p_name, p_ip_address, p_location, p_user_id])

        # Lưu các thay đổi vào cơ sở dữ liệu
        db.commit()

        return jsonify({'success': True, 'data': {'message': 'Thêm mới camera thành công'}})
    except Error as error:
        # Xử lý lỗi MySQL
        return conflict(message=str(error), form=check_keyword(['ip_address', 'name'], str(error)))
    except Exception as error:
        # Xử lý lỗi chung
        return internal_server_error(message=str(error))
    finally:
        cursor.close()


#Lấy thông tin 1 camera
@api.route('/camera/<string:user_id>', methods=['GET'])
@token_required
def getAllCamera(self, user_id):
    if not user_id:
        return bad_request(message='Thiếu id người dùng.')
    try:
        cursor = db.cursor()
        # Gọi Stored Procedure "Proc_camera_getAll" và truyền các tham số
        p_user_id = user_id
        cursor.callproc('Proc_camera_getAll', [p_user_id])

        result = next(cursor.stored_results())

        # Lấy kết quả từ Stored Procedure
        cameras_list = result.fetchall()

        # Chuyển đổi list cameras thành dict
        cameras_dict = [Camera(*camera).to_dict() for camera in cameras_list]

        if not cameras_dict:
            return not_found(message='Bạn chưa thêm camera nào')

        return jsonify({'success': True, 'data': cameras_dict})
    except Error as error:
        # Xử lý lỗi MySQL
        return conflict(message=str(error))
    except Exception as error:
        # Xử lý lỗi chung
        return internal_server_error(message=str(error))
    finally:
        cursor.close()


# xoá camera theo id
@api.route('/camera/<string:camera_id>', methods=['DELETE'])
@token_required
def deleteCamera(self, camera_id):
    if not camera_id:
        return bad_request(message='Thiếu id camera.')
    try:
        cursor = db.cursor()
        # Gọi Stored Procedure "Proc_camera_getAll" và truyền các tham số
        p_camera_id = camera_id
        cursor.callproc('Proc_camera_delete', [p_camera_id])

        cursor.close()
        db.commit()

        return jsonify({'success': True, 'data' : {'message': 'Xóa camera thành công.'}})
    except Error as error:
        # Xử lý lỗi MySQL
        return conflict(message=str(error))
    except Exception as error:
        # Xử lý lỗi chung
        return internal_server_error(message=str(error))
    finally:
        cursor.close()


#Sửa camera
@api.route('/camera', methods=['PATCH'])
@validate_json_content_type
@token_required
def editCamera(self):
    args = request.get_json()
    p_ip_address = args['ip_address']
    p_name = args['name']
    p_location = args['location']
    p_camera_id = args['camera_id']
    p_user_id = args['user_id']
    if not p_user_id:
        return bad_request(message='Thiếu id người dùng.')
    if not p_camera_id:
        return bad_request(message='Thiếu id người dùng.')
    try:
        cursor = db.cursor()
        # Gọi Stored Procedure "Proc_camera_edit" và truyền các tham số

        cursor.callproc('Proc_camera_edit', [p_user_id, p_camera_id, p_name, p_ip_address, p_location])

        cursor.close()
        db.commit()

        return jsonify({'success': True, 'data' : {'message': 'Sửa camera thành công.'}})
    except Error as error:
        # Xử lý lỗi MySQL
        return conflict(message=str(error))
    except Exception as error:
        # Xử lý lỗi chung
        return internal_server_error(message=str(error))
    finally:
        cursor.close()


@api.route('/camera/receiver_mail', methods=['POST'])
@validate_json_content_type
@token_required
def editReceiverCamera(self):
    args = request.get_json()
    p_camera_id = args['camera_id']
    p_receiver_email = args['receiver_email']
    if not p_receiver_email:
        return bad_request(message='Thiếu email.')
    if not p_camera_id:
        return bad_request(message='Thiếu id người dùng.')
    try:
        cursor = db.cursor()
        # Gọi Stored Procedure "Proc_camera_update_receiver_mail" và truyền các tham số

        cursor.callproc('Proc_camera_update_receiver_mail', [p_camera_id, p_receiver_email])

        cursor.close()
        db.commit()

        return jsonify({'success': True, 'data' : {'message': 'Sửa email nhận thông báo thành công.'}})
    except Error as error:
        # Xử lý lỗi MySQL
        return conflict(message=str(error))
    except Exception as error:
        # Xử lý lỗi chung
        return internal_server_error(message=str(error))
    finally:
        cursor.close()