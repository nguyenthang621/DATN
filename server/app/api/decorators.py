"""This module stores decorators for api."""
from functools import wraps
from flask import request, current_app
import jwt
from app.api.errors import unauthorized, bad_request, unsupported_media_type, forbidden
from app import db


def validate_json_content_type(func):
    """Check if content type is json."""

    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            data = request.get_json()
        except BaseException:
            return bad_request(message='No json content.')
        if data is None:
            return unsupported_media_type(message='Content type must be: application/json')
        return func(*args, **kwargs)

    return wrapper


def token_required(func):
    """Token is required."""

    @wraps(func)
    def wrapper(*args, **kwargs):
        token = None

        if 'Authorization' not in request.headers:
            return bad_request(message='No Authorization token')

        auth = request.headers.get('Authorization')

        if auth and 'Bearer ' in auth:
            token = auth.split(' ')[1]
        else:
            return bad_request(message='No token, log in or register')

        try:
            payload = jwt.decode(token, 'SECRET_KEY', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            return unauthorized(message='EXPIRED_ACCESS_TOKEN')
        except jwt.InvalidTokenError:
            return unauthorized(message='INVALID_ACCESS_TOKEN')
        else:
            return func(str(payload['id']), *args, **kwargs)

    return wrapper


def permission_required(permission):
    """Check permissions"""

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            id = None
            cursor = db.cursor()
            auth = request.headers.get('Authorization')
            if 'Bearer ' in auth:
                token = auth.split(' ')[1]
            id = jwt.decode(token, current_app.config.get('SECRET_KEY'), algorithms='HS256')['user_id']
            query = "SELECT COUNT(*) FROM users WHERE id = %s"
            params = (id,)
            # Thực hiện truy vấn
            cursor.execute(query, params)

            # Lấy kết quả trả về từ truy vấn
            user = cursor.fetchone()
            if not user:
                return forbidden('Insufficient permissions')
            return func(*args, **kwargs)

        return wrapper

    return decorator
