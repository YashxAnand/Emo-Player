FROM python:3.10

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --upgrade protobuf==3.20.0
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python", "./api.py" ]
