import json
import pandas as pd
import os
import requests
import subprocess
import time
from threading import Thread
import tempfile
import sys
import traceback
import shutil

from flask import Flask
from flask import request
from file_utils import save_files_to_disk
from constants import MODEL_FILE, MODEL_URL, HANDLER_FILE, EXTRA_FILES
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


@app.route('/listparse', methods=["GET"])
@cross_origin()
def list_parse_deployments():
    response = []
    try:
        list_result = plugin.list_deployments()
        for each_model in list_result:
            for _, model_data in each_model.items():
                response.append(model_data)
    except Exception as err:
        response = str(err)
    return json.dumps(response)


@app.route('/models/<name>', methods=["GET"])
def get_deployments(name):
    try:
        result = plugin.get_deployment(name)
        deploy = json.loads(result["deploy"])
    except Exception as err:
        deploy = str(err)
    return json.dumps(deploy)


@app.route('/create', methods=["POST"])
def create_mt_deployment():
    saved_file_info = {}
    files = request.files
    upload_folder = tempfile.mkdtemp()
    if files:
        saved_file_info = save_files_to_disk(files, saved_file_info, upload_folder)

        extra_files_str = ""
        keys_to_remove = []
        for name, path in saved_file_info.items():
            if "extra_file_" in name:
                keys_to_remove.append(name)
                if extra_files_str:
                    extra_files_str = "{},{}".format(extra_files_str, path)
                else:
                    extra_files_str = path

        for key in keys_to_remove:
            saved_file_info.pop(key, None)

        saved_file_info[EXTRA_FILES] = extra_files_str


    if MODEL_FILE in request.form:
        saved_file_info[MODEL_FILE] = request.form.get(MODEL_FILE)
    if HANDLER_FILE in request.form:
        saved_file_info[HANDLER_FILE] = request.form.get(HANDLER_FILE)
    if EXTRA_FILES in request.form:
        saved_file_info[EXTRA_FILES] = request.form.get(EXTRA_FILES)
    if MODEL_URL in request.form:
        saved_file_info[MODEL_URL] = request.form.get(MODEL_URL)

    print("Saved file info: ", saved_file_info)

    config = {
        MODEL_FILE: saved_file_info.get(MODEL_FILE),
        "HANDLER": saved_file_info.get(HANDLER_FILE),
    }
    if EXTRA_FILES in saved_file_info and saved_file_info[EXTRA_FILES]:
        config[EXTRA_FILES] = saved_file_info.get(EXTRA_FILES)

    response = {}
    try:
        result = plugin.create_deployment(
            name=request.form.get("model_name"),
            model_uri=saved_file_info.get(MODEL_URL),
            config=config,
        )

        response["status"] = "SUCCESS"
        response["data"] = result
        print(result)
    except Exception as e:
        exc_info = sys.exc_info()
        exception_string = ''.join(traceback.format_exception(*exc_info))
        response["status"] = "FAILURE"
        response["error"] = exception_string

    finally:
        if os.path.exists(upload_folder):
            shutil.rmtree(upload_folder)

    return response


def async_run(command):
    output = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output.communicate()


@app.route('/start_torchserve', methods=["POST"])
def start_torchserve():
    start_cmd = "torchserve --start --ncs --model-store model_store"
    print("Starting torchserve")
    os.makedirs('model_store', exist_ok=True)
    t = Thread(target=async_run, args=(start_cmd,))
    t.start()

    healthy = False
    for _ in range(10):
        print("Checking for health")
        ping_data = {}
        try:
            # TODO Check ping status for any host
            ping_result = requests.get("http://localhost:8080/ping").text
            print("Ping result")
            ping_data = json.loads(ping_result)
        except Exception as e:
            ping_data["status"] = "not ready"
        if ping_data["status"] == "Healthy":
            healthy = True
            break
        else:
            print("Not healthy .. retrying")
            time.sleep(10)

    if healthy:
        res = {'status': 'Success', 'message': 'Started'}
    else:
        res = {'status': 'Failure', 'message': 'Error'}

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
    response = {}
    model_name = request.form.get("model_name")
    saved_file_info = {}
    files = request.files
    upload_folder = tempfile.mkdtemp()
    if files:
        saved_file_info = save_files_to_disk(files, saved_file_info, upload_folder)
        print(saved_file_info)

    try:
        df = pd.read_json(saved_file_info["model_inputPath"])
        result = plugin.predict(deployment_name=model_name, df=df)
        print(result)
        response["status"] = "SUCCESS"
        response["data"] = result
    except Exception as e:
        exc_info = sys.exc_info()
        exception_string = ''.join(traceback.format_exception(*exc_info))
        response["status"] = "FAILURE"
        response["error"] = exception_string

    finally:
        if os.path.exists(upload_folder):
            shutil.rmtree(upload_folder)

    return response

    # data = request.get_json()
    # input_path = data["model_inputPath"]
    # df = pd.read_json(input_path)
    # result = plugin.predict(deployment_name=data["model_name"], df=df)
    # return json.dumps(result)


@app.route('/delete/<name>', methods=["POST"])
def delete_deployment(name):
    try:
        result = plugin.delete_deployment(name)
        result = {"status": "SUCCESS"}
    except Exception as err:
        result = str(err)
    return json.dumps(result)

if __name__ == '__main__':
    app.run(debug=False)
