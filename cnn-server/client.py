from tensorflow import keras
import numpy as np
import cv2
import requests
import json

model = keras.models.load_model("model.h5")
cap = cv2.VideoCapture(0)

while True:
    img_data = ""
    response, frame = cap.read()
    if not response:
        break
    facecasc = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = facecasc.detectMultiScale(gray,scaleFactor=1.3, minNeighbors=5)

    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)

        key = cv2.waitKey(1)

        if key == ord('c'):
            roi_gray = gray[y:y + h, x:x + w]
            cropped_img = cv2.resize(roi_gray, (48, 48))
            for row in cropped_img:
                img_data+=' '.join(list(map(str, row)))
                img_data+=' '

            payload = json.dumps({'data': json.dumps([img_data.strip()])})

            headers = {'Content-type':'application/json'}
    
            print("You seem to be ",requests.post("http://0.0.0.0:3000/emotion", headers = headers, data = payload).json())

    cv2.imshow('Video', cv2.resize(frame,(800,600),interpolation = cv2.INTER_CUBIC))
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break


