import json
import datetime


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
