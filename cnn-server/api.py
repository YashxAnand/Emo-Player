from tensorflow import keras
from flask import Flask, jsonify
from flask_restful import Api, Resource, reqparse
import numpy as np
import json

app = Flask(__name__)
api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('data')

emotions = {0: "Angry", 1: "Disgusted", 2: "Fearful", 3: "Happy", 4: "Neutral", 5: "Surprised", 6: "Sad"}

def convert_input(pixels):
    data = []
    data.append(pixels.split())
    data = np.array(data, np.float32)
    data/=255
    data = data.reshape(-1, 48, 48, 1)

    return data


class Emotion_Detector(Resource):
    def post(self):
        args = parser.parse_args()
        image_array = json.loads(args['data'])

        emotion_list = [0, 0, 0, 0, 0, 0, 0]

        for image_data in image_array:
            image = convert_input(image_data)

            y_pred = model.predict(image)
            emotion_list[np.argmax(y_pred[0])]+=1

        emo_index = np.argmax(emotion_list)

        if emo_index in [1, 2, 5]:
            emo_index = 4
        print("You seem to be ", emotions[emo_index])
        return emotions[emo_index]

api.add_resource(Emotion_Detector, '/emotion')

if __name__ == '__main__':
    model = keras.models.load_model('model.h5')

    app.run(host = '0.0.0.0', debug = True, port = 3000)
