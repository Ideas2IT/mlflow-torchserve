import json
import pandas as pd
import os
import requests
import subprocess
from threading import Thread
from tempfile import NamedTemporaryFile

from flask import Flask
from flask import request
from flask import after_this_request

from flask_cors import CORS, cross_origin


from mlflow.deployments import get_deploy_client

plugin = get_deploy_client("torchserve")

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/list', methods=["GET"])
@cross_origin()
def list_deployments():
    try:
        result = plugin.list_deployments()
    except Exception as err:
        result = str(err)
    return json.dumps(result)


@app.route('/get/<name>', methods=["GET"])
def get_deployments(name):
    try:
        result = plugin.get_deployment(name)
        deploy = json.loads(result["deploy"])
    except Exception as err:
        deploy = str(err)
    return json.dumps(deploy)


def save_files_to_disk(file_list):
    saved_file_info = {}
    for efile in file_list:
        file_data = file_list.get(efile)
        file_name = file_data.filename
        print("Saving filename: ", file_name)
        save_path = "test/{file_name}".format(file_name=file_name)
        content = file_data.read()
        with open(save_path, "wb") as binary_file:
            binary_file.write(content)
        saved_file_info[efile] = save_path
    return saved_file_info


@app.route('/create', methods=["POST"])
def create_mt_deployment():
    saved_file_info = {}
    files = request.files
    if files:
        saved_file_info = save_files_to_disk(files)
    else:
        saved_file_info["model_file"]  = request.form.get("model_file")
        saved_file_info["handler_file"]  = request.form.get("handler_file")
        saved_file_info["extra_files"]  = request.form.get("extra_files")
        saved_file_info["model_url"]  = request.form.get("model_url")

    print("Saved file info: ", saved_file_info)

    config = {
        "MODEL_FILE": saved_file_info.get("model_file"),
        "HANDLER": saved_file_info.get("handler_file"),
    }
    if "extra_files" in saved_file_info and saved_file_info["extra_files"]:
        config["EXTRA_FILES"] = saved_file_info.get("extra_files")

    response = {}
    try:
        result = plugin.create_deployment(
            name=request.form.get("model_name"),
            model_uri=saved_file_info.get("model_url"),
            config=config,
        )

        response["status"] = "SUCCESS"
        response["data"] = result
        print(result)
    except Exception as err:
        result = err
        response["status"] = "FAILURE"
        response["error"] = err


    return result


def async_run(command):
    output = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output.communicate()


@app.route('/start_torchserve', methods=["POST"])
def start_torchserve():
    cmd = "torchserve --start --model-store model_store"
    os.makedirs('model_store', exist_ok=True)
    t = Thread(target=async_run, args=(cmd,))
    t.start()
    res = {'status': 'Success', 'message': 'Starting...'}
    return json.dumps(res)


@app.route('/stop_torchserve', methods=["POST"])
def stop_torchserve():
    cmd = "torchserve --stop"
    output = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE).communicate()
    res = {'status': 'Success', 'message': 'Starting...'}
    if 'TorchServe has stopped.' not in output:
        res = {'status': 'Success', 'message': str(output[0])}
    return json.dumps(res)


@app.route('/ping', methods=["GET"])
def ping():
    failed = {'status': 'Failed', 'message': 'Not running...'}
    try:
        res = requests.get('http://localhost:8080/ping')
        if res.status_code != 200:
            return json.dumps(failed)
    except requests.exceptions.ConnectionError:
        return json.dumps(failed)
    return json.dumps({'status': 'Success', 'message': 'Running...'})


@app.route('/predict', methods=["POST"])
def predict():
    data = request.get_json()
    input_path = data["model_inputPath"]
    df = pd.read_json(input_path)
    result = plugin.predict(deployment_name=data["model_name"], df=df)
    return json.dumps(result)


@app.route('/models', methods=["GET"])
def models():
    return True

if __name__ == '__main__':
    app.run(debug=False)
