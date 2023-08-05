import torch
import numpy as np
import cv2
import json


class ObjectDetection:
    """
    Class implements YOLOv5 model to perform object detection on a video stream received from a client via a socket.
    """

    def __init__(self, model_weights):
        """
        Initializes the class with the path to the YOLOv5 model weights file.
        :param model_weights: Path to the YOLOv5 model weights file.
        """
        self.model = self.load_model(model_weights)
        self.classes = self.model.names
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        print("\n\nDevice Used:", self.device)

    def load_model(self, model_weights):
        """
        Loads the YOLOv5 model from the provided weights file.
        :param model_weights: Path to the YOLOv5 model weights file.
        :return: Trained PyTorch model.
        """
        model = torch.hub.load('ultralytics/yolov5', 'custom', path=model_weights)
        return model

    def score_frame(self, frame):
        """
        Takes a single frame as input, and scores the frame using the YOLOv5 model.
        :param frame: Input frame in numpy array format.
        :return: Labels and coordinates of objects detected by the model in the frame.
        """
        self.model.to(self.device)
        results = self.model(frame)
        labels, cord = results.xyxyn[0][:, -1], results.xyxyn[0][:, :-1]
        return labels, cord

    def class_to_label(self, x):
        """
        For a given label value, returns the corresponding string label.
        :param x: Numeric label
        :return: Corresponding string label
        """
        return self.classes[int(x)]

    def plot_boxes(self, results, frame):
        """
        Takes a frame and its results as input, and plots the bounding boxes and labels on the frame.
        :param results: Contains labels and coordinates predicted by the model on the given frame.
        :param frame: Frame which has been scored.
        :return: Frame with bounding boxes and labels plotted on it.
        """
        labels, cord = results
        n = len(labels)
        x_shape, y_shape = frame.shape[1], frame.shape[0]
        for i in range(n):
            row = cord[i]
            if row[4] >= 0.2:
                x1, y1, x2, y2 = int(row[0] * x_shape), int(row[1] * y_shape), int(row[2] * x_shape), int(
                    row[3] * y_shape)
                bgr = (0, 255, 0)
                cv2.rectangle(frame, (x1, y1), (x2, y2), bgr, 2)
                cv2.putText(frame, self.class_to_label(labels[i]), (x1, y1), cv2.FONT_HERSHEY_SIMPLEX, 0.9, bgr, 2)
        return frame

    # Lấy lable:
    def get_bounding_boxes(self, frame):
        """
        Takes a frame as input and returns a dictionary containing the bounding box coordinates.
        :param frame: input frame in numpy array format.
        :return: dictionary with keys 'x1', 'y1', 'x2', 'y2' and their corresponding values.
        class: 0: fire , 1: light
        """
        results = self.score_frame(frame)
        labels, cord = results
        print(labels)
        bounding_boxes = []
        bounding_boxes_for_robot = []
        x_shape, y_shape = frame.shape[1], frame.shape[0]
        for i in range(len(labels)):
            if labels[i] == 0:
                row = cord[i]
                if row[4] >= 0.2:
                    class_name = 'fire'
                    x1, y1, x2, y2 = float(row[0] * x_shape), float(row[1] * y_shape), float(row[2] * x_shape), float(
                        row[3] * y_shape)
                    confidence = float(row[4])
                    bounding_box = {"class": class_name, "confidence": confidence, 'xmin': x1, 'ymin': y1, 'xmax': x2, 'ymax': y2}
                    bounding_box_for_robot = round(((round(x1) + round(x2)) / 2))
                    bounding_boxes_for_robot.append(str(bounding_box_for_robot))
                    bounding_boxes.append(bounding_box)
        if(len(bounding_boxes)):
            return bounding_boxes_for_robot[0], bounding_boxes
        return None, None
    # detect video gửi data qua socket
    def process_video_stream(self, socket):
        try:
            while True:
                # Nhận dữ liệu video từ socket
                data = b''
                while True:
                    packet = socket.recv(4096)
                    if not packet:
                        break
                    data += packet

                # Chuyển đổi dữ liệu nhận được thành khung hình (frame)
                nparr = np.frombuffer(data, np.uint8)
                frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

                # Thực hiện phát hiện đối tượng trên khung hình
                bounding_boxes = self.get_bounding_boxes(frame)

                # Chuẩn bị dữ liệu để gửi trả về cho client
                response = {
                    'bounding_boxes': bounding_boxes
                }
                response_json = json.dumps(response)

                # Gửi kết quả phát hiện đối tượng về cho client qua socket
                socket.sendall(response_json.encode('utf-8'))

        except socket.error as e:
            print(f"Socket error: {e}")
