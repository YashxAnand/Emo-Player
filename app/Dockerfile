FROM ubuntu:focal
RUN apt-get update \
    && apt-get install -y python python3-pip \
    && DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Kolkata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt install -y chromium-browser
COPY . /app/
WORKDIR /app
RUN apt-get install ffmpeg libsm6 libxext6  -y
RUN pip3 install -r requirements.txt
CMD ["python3", "app.py"]
