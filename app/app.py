import json
import requests
import numpy as np
import cv2
import eel

eel.init('public')
cv2.ocl.setUseOpenCL(False)

@eel.expose
def getEmotion():
    cap = cv2.VideoCapture(0)
    count = 0
    emotion = ""
    face_data = []
    while count < 50:
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

            roi_gray = gray[y:y + h, x:x + w]
            cropped_img = cv2.resize(roi_gray, (48, 48))
            for row in cropped_img:
                img_data+=' '.join(list(map(str, row)))
                img_data+=' '

            face_data.append(img_data)
            count+=1

        cv2.imshow('Video', cv2.resize(frame,(800,600),interpolation = cv2.INTER_CUBIC))
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    payload = json.dumps({'data':json.dumps(face_data)})
    headers = {'Content-type': 'application/json'}
    emotion = requests.post("http://0.0.0.0:3000/emotion", headers = headers, data = payload).json()
    cv2.destroyAllWindows()
    return emotion

eel.start('index.html')
