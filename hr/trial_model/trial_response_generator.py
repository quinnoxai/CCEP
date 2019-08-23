import json
import random
import requests
from ..quick_menu import find_quick_menu
import os
import json
import pandas as pd
from hr.trial_model import intent_classification as ic
from django.contrib.auth import authenticate
#from .status_indicator import get_status
#from .successful_tasks import get_successful_task
#from .failed import  get_failed_task
#from .error import get_error_task
#from .status_by_name import get_trial_task
from .middle_office_response import get_middle_response
from .unlock_account import get_office_response
#from .not_trigger import get_nottrigger_task
from hrhelpdesk.settings import BASE_DIR

"""data_out_total = {"data": [{"name": "add user"},{"name": "status report"},{"name":"Task_parent"},{"name":"Task type"}, {"name": "mirror existing user"}, {"name": "group access permission"},
                           {"name": "locked user"}, {"name": "reset password"}, {"name": "existing trades"},
                           {"name": "pricing sheet"}, {"name": "pricing grid"}, {"name": "risk config"}, {"name": "calypso workstation"}, {"name": "ob-demand analysis"}, {"name": "loading particular trade"},
                           {"name": "loading particular message"}, {"name": "loading particular posting"}, {"name": "loading particular transfer"}, {"name": "data authorization"}, {"name": "booked product type"}, {"name": "booked trades on particular date"},
                           {"name": "booked defined"}, {"name": "trading book"}, {"name": "accounting book link"}, {"name": "accounting event"}, {"name": "counterparty trade"}, {"name": "accounting rule"},
                           {"name": "static data filter"}, {"name": "trade filter"}, {"name": "filterset"}, {"name": "legal entity"},{"name": "message set-up"}, {"name": "message sender"},{"name": "settlement delivery instruction"},{"name": "workflow"},{"name": "domain values"},
                           {"name": "scheduled task"},{"name": "scheduled task window"},{"name": "cost associated with each user"},{"name":"new user permission"},{"name": "raise support ticket"},{"name": "request for enhancement"},{"name": "technology used for calypso"},{"name": "add trading book"},{"name": "market book"},{"name": "software requirements while installing Calypso"},{"name": "jnlp file"}]}"""
dats = ["I can also help you with the following", "How else can I help you?", "You can enquire about the following too",
        "I hope this was what you need, I can tell you more about the following"]


def classify_intent(sentence):
    intent_received = ic.classify(sentence)
    return intent_received


def get_response(sentence, received_dict, master_intent,user_info):
    print("#####################",user_info)
    if "response_complete" in received_dict and received_dict["phase"]=="1":
        model_intent=["sap_password"]
    elif "response_complete" in received_dict and received_dict["phase"]== "2":
        model_intent=["unlock_account"]
    else:
        model_intent = classify_intent(sentence)

    dict_return={}
    print("Line no 43 in trial response",model_intent)
    with open(os.path.join(BASE_DIR, r'hr/trial_model/trial.json'), encoding="utf-8")as json_data:
        intents = json.load(json_data)

    for i in intents["intents"]:
        if i["intent"] == model_intent[0]:
            # response = "<p>"+"At Quinnox, we take good care of our employees and cover them from very first day."+"<br/>"+"To know maore about mediclaim please download the below pdf or if you have any specific query please let me know."+"<br/>" + i["response"] + "</p> <br/>" + random.choice(dats)
            status_response_check =  i["response"]
            print('line no 51',i["response"])
            if status_response_check == 'sap_password':
                status_response = get_middle_response(sentence,received_dict)
                dict_return= status_response
            elif status_response_check == 'unlock_account':
                status_response = get_office_response(sentence,received_dict)
                dict_return= status_response
            else:
                response = "<p>" + i["response"] + "</p>" + "<p>Would you like to know more?</p>"
                dict_return["response"] = response
            # dict_return["response"] = response

    print("Dict _return in trail ressponse",dict_return)
    #translator = Translator(from_lang="english",to_lang="russian")
    return dict_return
