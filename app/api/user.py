from mysql.connector import Error
from . import api
from .. import db

@api.route('/users', methods=['GET'])
def get_users():
    try:
        # Tạo cursor để thực hiện truy vấn
        mycursor = db.cursor()
        # Thực hiện truy vấn để lấy danh sách user
        mycursor.execute("SELECT id, fullName, email, address, phoneNumber, avatar, gender, roleId FROM users")
        users = mycursor.fetchall()

        listUser = [dict(zip([x[0] for x in mycursor.description], row)) for row in users]
        return {
            'errorCode': 0,
            'data': listUser
        }
    except Error as e:
        print('error:', e)
        return {
            'errorCode': 1,
            'message': 'Lỗi server!'
        }