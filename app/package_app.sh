pyinstaller -w -F --clean --add-data "haarcascade_frontalface_default.xml:haarcascade_frontalface_default.xml" --add-data "public:public" app.py
