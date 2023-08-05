from flask import jsonify, request
from app.api.decorators import validate_json_content_type
from app.api.errors import conflict, bad_request, unauthorized, not_found, internal_server_error
from mysql.connector import Error
from app import db
from app.api import api
import uuid
from passlib.hash import pbkdf2_sha256
from app.util.type import User
from app.util.utils import convert_json, omit_attributes
import jwt


@api.route('/auth/register', methods=['POST'])
@validate_json_content_type
def register():
    args = request.get_json()
    if 'email' not in args:
        return bad_request(message='No email')
    try:
        p_email = request.json['email']
        p_password = pbkdf2_sha256.hash(request.json['password'])  # hash code cho mật khẩu
        p_fullName = request.json['fullName']
        p_role = 'USER'

        # Tạo giá trị UUID cho trường id
        p_id = str(uuid.uuid4())

        # Tạo một con trỏ để thực thi câu lệnh SQL
        cursor = db.cursor()

        # Gọi Stored Procedure "Proc_auth_register" và truyền các tham số
        cursor.callproc('Proc_auth_register', [p_id, p_email, p_password, p_fullName, p_role])

        result = next(cursor.stored_results())
        user = User(*result.fetchone())

        # Lưu thay đổi vào cơ sở dữ liệu
        db.commit()

        # Tạo JWT token
        access_token = user.generate_access_token()
        refresh_token = user.generate_refresh_token()

        # Cập nhật token(refreshTOken) ở db
        p_id = user.id
        token = refresh_token
        cursor.callproc('Proc_user_updateToken', [p_id, token])
        # Trả về kết quả thành công
        return jsonify({'success': True,'data': {'user':omit_attributes(convert_json(user), ['password', 'token']), 'access_token': access_token, 'refresh_token': refresh_token}})
    except Error as error:
        # Xử lý lỗi MySQL
        return conflict(message=str(error))
    except Exception as error:
        # Xử lý lỗi chung
        return internal_server_error(message=str(error))
    finally:
        cursor.close()


@api.route('/auth/login', methods=['POST'])
@validate_json_content_type
def login():
    args = request.get_json()
    if 'email' not in args:
        return bad_request(message='No email')
    if 'password' not in args:
        return bad_request(message='No password')

    try:
        p_email = args['email']
        p_password = args['password']
        cursor = db.cursor()
        # Gọi Stored Procedure "Pro_auth_login" và truyền các tham số
        cursor.callproc('Proc_auth_login', [p_email, p_password])

        result = next(cursor.stored_results())
        # Lấy kết quả từ Stored Procedure
        user = User(*result.fetchone())

        if not user:
            return not_found(message='Không tồn tại người dùng này.', form='email')

        if not pbkdf2_sha256.verify(p_password, user.password):
            return unauthorized(message='Mật khẩu không đúng.', form='password')

        # Tạo JWT token
        access_token = user.generate_access_token()
        refresh_token = user.generate_refresh_token()

        # Cập nhật token(refreshTOken) ở db
        p_id = user.id
        token = refresh_token
        cursor.callproc('Proc_user_updateToken', [p_id, token])

        # Lưu thay đổi vào cơ sở dữ liệu
        db.commit()

        return jsonify(
            {'success': True, 'data': {'user':omit_attributes(convert_json(user), ['password', 'token']), 'access_token': access_token, 'refresh_token': refresh_token}})

    except Error as error:
        # Xử lý lỗi MySQL
        return conflict(message=str(error).split('):')[1], form='email')
    except Exception as error:
        # Xử lý lỗi chung
        return internal_server_error(message=str(error))
    finally:
        cursor.close()


@api.route('/refresh-token', methods=['POST'])
@validate_json_content_type
def refresh_token():
    refresh_token = request.json.get('refresh_token')
    print('refresh_token', refresh_token)
    if not refresh_token:
        return bad_request(message='Thiếu Refresh Token.')

    try:
        payload = jwt.decode(refresh_token, 'SECRET_KEY', algorithms=['HS256'])
        id = payload['id']

        if not id:
            return unauthorized(message='Token này không của người dùng nào.')
        cursor = db.cursor()

        # Gọi Stored Procedure "Pro_user_getUser" và truyền các tham số
        p_id = id
        cursor.callproc('Proc_user_getUser', [p_id])
        result = next(cursor.stored_results())
        # Lấy kết quả từ Stored Procedure
        user = User(*result.fetchone())

        if not user:
            return not_found(message='Người dùng không tồn tại.')

        if user.token == refresh_token:
            # Tạo 2 token mới
            new_refresh_token = user.generate_refresh_token()
            new_access_token = user.generate_access_token()

            # Cập nhật token(refreshToken) ở db
            p_id = user.id
            token = new_refresh_token
            cursor.callproc('Proc_user_updateToken', [p_id, token])

            # Lưu thay đổi vào cơ sở dữ liệu
            db.commit()

            return jsonify({'success': True, 'access_token': new_access_token, 'refresh_token': new_refresh_token})
        else:
            return unauthorized(message='Token không đúng.', form='REDIRECT_LOGIN')

    except jwt.ExpiredSignatureError:
        return unauthorized(message='Token hết hạn.')
    except jwt.InvalidTokenError:
        return unauthorized(message='Token không đúng.')
    except Exception as error:
        return internal_server_error(message=str(error))
    # finally:
    #     cursor.close()


@api.route('/logout', methods=['POST'])
def logout():
    try:
        return jsonify({'success': True, 'message': 'Đăng xuất thành công'})

    except jwt.ExpiredSignatureError:
        return unauthorized(message='Token hết hạn.')
    except jwt.InvalidTokenError:
        return unauthorized(message='Token không đúng.')
    except Exception as error:
        return internal_server_error(message=str(error))


