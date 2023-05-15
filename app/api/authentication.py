# from flask import jsonify, request
# from . import api
#
#
# @api.route('/auth/register/', methods=['POST'])
# @validate_json_content_type
# def register():
#     args = request.get_json()
#     if 'email' not in args:
#         return bad_request(message='No email')
#     if User.query.filter(User.email == args['email']).first():
#         return conflict(message=f'User with email {args["email"]} already exists')
#
#     user = User.from_json(args)
#
#     db.session.add(user)
#     db.session.commit()
#
#     token = user.generate_jwt_token()
#
#     return jsonify({'success': True, 'token': token}), 201