import axios from "axios";
import { CreateDialogComponentProps } from "../components/create/create-dialog-popup";
import { EditDialogComponentProps } from "../components/edit/edit-dialog-popup";
import { PredictDialogComponentProps } from "../components/predict/predict-dialog-popup";
import { BASE_URL } from "../utils/constants";

export const createService = (postObj: FormData) => {
  return axios({
    method: "POST",
    url: `${BASE_URL}/create`,
    data: postObj,
  });
};

export const editService = (putObj: EditDialogComponentProps) => {
  return fetch(`${BASE_URL}/edit`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(putObj),
  });
};

export const getListService = () => {
  return fetch(`${BASE_URL}/listparse`);
};

export const predictService = (requestObj: FormData) => {
  return axios({
    method: "POST",
    url: `${BASE_URL}/predict`,
    data: requestObj
  });
};

export const getService = (model_name: string | undefined) => {
  return fetch(`${BASE_URL}/models/${model_name}`);
};

export const getPredict = (postObj: PredictDialogComponentProps) => {
  return fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postObj),
  });
};
