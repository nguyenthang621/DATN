
from mysql.connector import Error
from app.api import api
from app import db
from app.api.decorators import token_required
from app.api.errors import conflict, bad_request, internal_server_error, not_found
from app.util.type import User
from flask import jsonify, request
from app.util.utils import convert_json, decodeJWT


@api.route('/users', methods=['GET'])
@token_required
def get_users(self):
    try:
        # Tạo cursor để thực hiện truy vấn
        mycursor = db.cursor()
        # Thực hiện truy vấn để lấy danh sách user
        mycursor.execute("SELECT id, fullName, email, address, phoneNumber, avatar, gender, role FROM users")
        users = mycursor.fetchall()

        listUser = [dict(zip([x[0] for x in mycursor.description], row)) for row in users]
        return jsonify({'success': True, 'data': listUser})
    except Error as e:
        print('error:', e)
        return {
            'errorCode': 1,
            'message': 'Lỗi server!'
        }


@api.route('/users/<string:user_id>', methods=['GET'])
@token_required
def get_current_user(self, user_id):

    if not user_id:
        return bad_request(message='Thiếu id người dùng.')
    try:
        cursor = db.cursor()
        # Gọi Stored Procedure "Pro_user_getUser" và truyền các tham số
        p_id = user_id
        cursor.callproc('Proc_user_getUser', [p_id])

        result = next(cursor.stored_results())

        # Lấy kết quả từ Stored Procedure
        user = User(*result.fetchone()).omit_attributes(["token", "password"])
        if not user:
            return not_found(message='Người dùng không tồn tại.')

        return jsonify({'success': True, 'data':user})
    except Error as error:
        # Xử lý lỗi MySQL
        return conflict(message=str(error))
    except Exception as error:
        # Xử lý lỗi chung
        return internal_server_error(message=str(error))
    finally:
        cursor.close()


@api.route('/users', methods=['PUT'])
@token_required
def edit_user(self):
    auth = request.headers.get('Authorization')
    try:
        dataUser = decodeJWT(auth)
        data = request.get_json()
        p_fullName = data["fullName"]
        p_email = data["email"]
        p_address = data["address"]
        p_phoneNumber = data["phoneNumber"]
        p_avatar = data["avatar"]

        cursor = db.cursor()
        # Gọi Stored Procedure "Pro_user_edit" và truyền các tham số
        p_id = dataUser['id']  # Lấy id user từ token
        print(p_id)
        cursor.callproc('Proc_user_edit', [p_fullName, p_email, p_address, p_phoneNumber, p_avatar, p_id])
        result = list(cursor.stored_results())
        db.commit()
        cursor.close()
        if len(result) > 0:
            message = result[0].fetchone()[0]
            return jsonify({'success': True, 'data': message})
        else:
            message = "Có lỗi xảy ra trong quá trình cập nhật thông tin người dùng!"
            return jsonify({'success': True, 'data': message})
    except Error as error:
        # Xử lý lỗi MySQL
        return conflict(message=str(error))
    except Exception as error:
        # Xử lý lỗi chung
        return internal_server_error(message=str(error))



@api.route('/users/filter/', methods=['GET'])
@token_required
def search_users(self):
    p_keyword = request.args.get('keyword')
    p_page_size = int(request.args.get('page_size')) if request.args.get('page_size') else 10
    p_page_number = int(request.args.get('page_number')) if request.args.get('page_number') else 1
    p_role = request.args.get('role')

    try:
        cursor = db.cursor()
        # Gọi Stored Procedure "Proc_user_searchUsers" và truyền các tham số
        cursor.callproc('Proc_user_pagingAndSearch', [p_page_number, p_page_size, p_role, p_keyword])

        result = next(cursor.stored_results())
        # Lấy kết quả từ Stored Procedure
        users = []
        for row in result.fetchall():
            user = User(*row)
            users.append(user)

        return jsonify({'success': True, 'data': [convert_json(user) for user in users]})
    except Error as error:
        # Xử lý lỗi MySQL
        return conflict(message=str(error))
    except Exception as error:
        # Xử lý lỗi chung
        return internal_server_error(message=str(error))
    finally:
        cursor.close()


