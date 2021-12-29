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


@app.route('/create', methods=["POST"])
def create_mt_deployment():
    # data = request.form
    # files = request.files
    # model_file = files.get('model_file')
    # handler_file = files.get('handler_file')
    # m_file = NamedTemporaryFile()
    # m_file.write(model_file.read())
    # h_file = NamedTemporaryFile()
    # h_file.write(handler_file.read())
    data = request.get_json()
    config = {
        "MODEL_FILE": data.get("model_file"),
        "HANDLER": data.get("handler_file"),
        "EXTRA_FILES": data.get("extra_files"),
        "EXPORT_PATH": data.get("model_export_path")
    }
    result = plugin.create_deployment(
        name=data.get("model_name"),
        model_uri=data.get("model_uri"),
        config=config,
    )

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


if __name__ == '__main__':
    app.run(debug=True)
