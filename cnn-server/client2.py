import numpy as np
import cv2
import requests
import json

cap = cv2.VideoCapture(0)

image_array = []
count = 0
while count < 20:
    img_data = ""
    response, frame = cap.read()
    if not response:
        break
    facecasc = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = facecasc.detectMultiScale(gray,scaleFactor=1.3, minNeighbors=5)

    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)

        roi_gray = gray[y:y + h, x:x + w]
        cropped_img = cv2.resize(roi_gray, (48, 48))
        for row in cropped_img:
            img_data+=' '.join(list(map(str, row)))
            img_data+=' '

        image_array.append(img_data) 
        count+=1

payload = json.dumps({"data":json.dumps(image_array)})
headers = {'Content-type':'application/json'}

print("You seem to be ",requests.post("http://0.0.0.0:3000/emotion", headers = headers, data = payload).json())
