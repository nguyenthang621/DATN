from flask import render_template
from flask_mail import Message

from app import mail


def sendEmail(title="Cảnh báo phát hiện lửa", sender="noreply@app.com", recipients=['nthang621@gmail.com'] ):
    msg_title = "Cảnh báo phát hiện lửa"
    sender = "noreply@app.com"
    msg = Message(msg_title, sender=sender, recipients=['nthang621@gmail.com'])
    msg_body = "Phát hiện được đám cháy ở camera 'robot fire' vui lòng kiểm tra camera"
    msg.body = ""
    data = {
        'app_name': "CAMERA BÁO CHÁY",
        'title': msg_title,
        'body': msg_body,
    }

    msg.html = render_template("email.html", data=data)

    try:
        mail.send(msg)
        print("Email sent...")
        return "Send email"
    except Exception as e:
        print(e)
        return f"the email was not sent {e}"