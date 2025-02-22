import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
import traceback
from threading import Thread

import matplotlib.pyplot as plt
import pandas as pd
import requests
from constants import (
    MODEL_FILE,
    MODEL_URL,
    HANDLER_FILE,
    EXTRA_FILES,
    SETTINGS_FOLDER_PATH,
    DEFAULT_SETTINGS_FILE_PATH,
)
from file_utils import save_files_to_disk
from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin
from mlflow.deployments import get_deploy_client
from torchvision import transforms

plugin = get_deploy_client("torchserve")

app = Flask(__name__)

# TODO Not the best method to handle cors. To be removed with a fix.
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"


@app.route("/list", methods=["GET"])
@cross_origin()
def list_deployments():
    try:
        result = plugin.list_deployments()
    except Exception as err:
        result = str(err)
    return json.dumps(result)


@app.route("/listparse", methods=["GET"])
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


@app.route("/models/<name>", methods=["GET"])
def get_deployments(name):
    try:
        result = plugin.get_deployment(name)
        deploy = json.loads(result["deploy"])
    except Exception as err:
        deploy = str(err)
    return json.dumps(deploy[0])


@app.route("/create", methods=["POST"])
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
    except Exception as e:
        exc_info = sys.exc_info()
        exception_string = "".join(traceback.format_exception(*exc_info))
        response["status"] = "FAILURE"
        response["error"] = exception_string

    finally:
        if os.path.exists(upload_folder):
            shutil.rmtree(upload_folder)

    return response


def async_run(command):
    output = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output.communicate()


@app.route("/start_torchserve", methods=["POST"])
def start_torchserve():
    os.environ["MKL_THREADING_LAYER"] = "GNU"
    start_cmd = "torchserve --start --model-store model_store"
    if json.loads(request.data.decode("utf-8"))["model_store_choice"] == "start_new_instance":
        start_cmd += " --ncs"
    os.makedirs("model_store", exist_ok=True)
    t = Thread(target=async_run, args=(start_cmd,))
    t.start()
    time.sleep(3)
    healthy = False
    for _ in range(10):
        ping_data = {}
        try:
            # TODO Check ping status for any host
            ping_result = requests.get("http://localhost:8080/ping").text
            ping_data = json.loads(ping_result)
        except Exception as e:
            ping_data["status"] = "not ready"
        if ping_data["status"] == "Healthy":
            healthy = True
            break
        else:
            time.sleep(10)

    if healthy:
        res = {"status": "Success", "message": "Started"}
    else:
        res = {"status": "Failure", "message": "Error"}

    return json.dumps(res)


@app.route("/stop_torchserve", methods=["POST"])
def stop_torchserve():
    cmd = "torchserve --stop"
    output = subprocess.Popen(
        cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
    ).communicate()
    res = {"status": "Success", "message": "Starting..."}
    if "TorchServe has stopped." not in output:
        res = {"status": "Success", "message": str(output[0])}
    return json.dumps(res)


@app.route("/status", methods=["GET"])
def ping():
    failed = {"status": "Failed", "message": "Not running..."}
    try:
        res = requests.get("http://localhost:8080/ping")
        if res.status_code != 200:
            return json.dumps(failed)
    except requests.exceptions.ConnectionError:
        return json.dumps(failed)
    return json.dumps({"status": "Success", "message": "Running..."})


@app.route("/predict", methods=["POST"])
def predict():
    response = {}
    model_name = request.form.get("model_name")
    saved_file_info = {}
    files = request.files
    upload_folder = tempfile.mkdtemp()
    if files:
        saved_file_info = save_files_to_disk(files, saved_file_info, upload_folder)

    try:
        input_file_path = saved_file_info["model_inputPath"]
        if ".json" in str(input_file_path).split("/")[-1]:
            df = pd.read_json(saved_file_info["model_inputPath"])
        else:
            img = plt.imread(input_file_path)
            image_transforms = transforms.Compose(
                [transforms.ToTensor(), transforms.Normalize((0.1307,), (0.3081,))]
            )

            df = image_transforms(img)
        result = plugin.predict(deployment_name=model_name, df=df)
        response["status"] = "SUCCESS"
        response["data"] = result
    except Exception as e:
        exc_info = sys.exc_info()
        exception_string = "".join(traceback.format_exception(*exc_info))
        response["status"] = "FAILURE"
        response["error"] = exception_string

    finally:
        if os.path.exists(upload_folder):
            shutil.rmtree(upload_folder)

    return response


@app.route("/delete/<name>", methods=["POST"])
def delete_deployment(name):
    try:
        result = plugin.delete_deployment(name)
        result = {"status": "SUCCESS"}
    except Exception as err:
        result = str(err)
    return json.dumps(result)


@app.route("/default", methods=["GET"])
def get_default_settings():
    response = {}
    if not os.path.exists(DEFAULT_SETTINGS_FILE_PATH):
        return json.dumps({})
    with open(DEFAULT_SETTINGS_FILE_PATH, "r") as f:
        response["data"] = json.loads(f.read())
    return response


@app.route("/save_settings", methods=["POST"])
def save_default_settings():
    if os.path.exists(DEFAULT_SETTINGS_FILE_PATH):
        os.remove(DEFAULT_SETTINGS_FILE_PATH)
    os.makedirs(SETTINGS_FOLDER_PATH, exist_ok=True)
    with open(DEFAULT_SETTINGS_FILE_PATH, "w") as f:
        f.write(json.dumps(request.json))
    return json.dumps({"status": "Success", "message": "Default settings saved..."})


@app.route("/explain", methods=["POST"])
def explain():
    response = {}
    model_name = request.form.get("model_name")
    saved_file_info = {}
    files = request.files
    upload_folder = tempfile.mkdtemp()
    if files:
        saved_file_info = save_files_to_disk(files, saved_file_info, upload_folder)

    try:
        df = pd.read_json(saved_file_info["model_inputPath"])
        explanations_json = plugin.explain(deployment_name=model_name, df=df)
        response["status"] = "SUCCESS"
        response["data"] = explanations_json
        response["type"] = "html"
    except Exception as e:
        exc_info = sys.exc_info()
        exception_string = "".join(traceback.format_exception(*exc_info))
        response["status"] = "FAILURE"
        response["error"] = exception_string

    finally:
        if os.path.exists(upload_folder):
            shutil.rmtree(upload_folder)

    return response


if __name__ == "__main__":
    app.run(debug=False)
