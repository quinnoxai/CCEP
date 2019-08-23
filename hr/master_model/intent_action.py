from . import intent_classification as ic
import json
import random
import os
import requests
def classify_action(sentence):
    intent=ic.classify(sentence)
    if(is_empty(intent)):
        # print("here")
        return intent_not_found_action(sentence)
    else:
        intent=intent[0]
        # print("here")

        if intent== "trending":
            return show_trending_action(sentence, intent)
        elif intent == "hcm_updates":
            return show_hcm_action(sentence, intent)
        elif intent == "show_events":
            return show_event_action(sentence, intent)
        elif intent == "you_basf":
            print("basf@you")
            return show_youbasf_action(sentence, intent)
        elif intent == "we_care":
            return show_we_care_action(sentence, intent)
        elif intent == "contest":
            return show_contest_action(sentence, intent)
        elif intent=='ramans_corner':
            return show_raman_action(sentence,intent)
        elif intent == "greeting":
            return show_greeting_action(sentence, intent)







def show_greeting_action(sentence,intent):
    responses=["Hi","Hello,there mate","Wassup?","Hey,how can I be of assistance","Welcome,to basf buddy"]

    response={"bot_reply":random.choice(responses),
              "intent":intent}
    return response

def show_event_action(sentence,intent):
    # print("here events")

    response={"bot_reply":"Here are few recent events ",
              "intent":intent,
              "type": "category",
              "category":"events"}
    return response

def show_trending_action(sentence,intent):
    # print("here events")

    response={"bot_reply":"Following are the trending posts for you",
              "status":"complete",
              "intent":intent,
              "type": "category",
              "category": "trending"}
    return response
def show_hcm_action(sentence,intent):
    # print("here events")

    response={"bot_reply":"Check out the recent HR updates I've found for you",
              "intent":intent,
              "type": "category",
              "category": "hr corner"}
    return response
def show_contest_action(sentence,intent):
    response={"bot_reply":"Be a part of the contests held in basf.I've pulled up the latest ones you might be interested in",
              "intent":intent,
              "type": "category",
              "category": "contest"}
    return response
def show_we_care_action(sentence,intent):
    response={"bot_reply":"The BASF WeCare community is helping people with the following projects. Please click to acknowledge and do not forget to like and share",
              "intent":intent,
              "type": "category",
              "category": "csr"}
    return response
def show_youbasf_action(sentence,intent):
    response={"bot_reply":"The BASF WeCare community is helping people with the following projects. Please click to acknowledge and do not forget to like and share",
              "intent":intent,
              "type": "category",
			  "category":'you@basf'
			  }
    return response
    # return response

def show_raman_action(sentence,intent):
    response={"bot_reply":"Raman has been really active lately,have a glance through and do not forget to like and share",
              "intent":intent,
              "type": "category",
              "category": "chairman desk"}
    return response



def intent_not_found_action(sentence):
    i=" "
    entity_list=get_tags()
    # print(entity_list)
    i=check_entity(entity_list,sentence)
    if not (is_empty(i)):
        i="".join(i)
        response={
            "bot_reply":"Here are the articles related to {}".format(i),
            "type":"tags",
            "tag":i

        }
    else:
        response = {"bot_reply": "Sorry I couldn't understand.Please try again"}


    ##here if it doesn't understand put it to retraining data also check the possiility of it being in which train type
	return response

def is_empty(any_structure):
    if any_structure:
        # print('Structure is not empty.')
        return False
    else:
        # print('Structure is empty.')
        return True

def check_entity(entity_list,sentence):
    for i in entity_list:
        if i in sentence:
            return i
def get_tags():
    tax_entity=[]
    dict_response=requests.get("https://basf-drupal-dev.azurewebsites.net/api/tag",verify=False).json()
    for i in dict_response:
        # print("name:",camel_split(i["name"]))
        tax_entity.append(camel_split(i["name"]).lower())
    # print("tax_entity",tax_entity)
    return tax_entity
def camel_split(name):
    import re
    splitted = re.sub('(?!^)([A-Z][a-z]+)', r' \1', name).split()
    splitted=' '.join(splitted)
    return (splitted)
#
# print(check_entity(["sustanability","agriculture","innovation"],"Send me something on life"))
# print(intent_not_found_action("Anything on beauty care"))
print(os.path.realpath(r'/hrhelpdesk/master_model/training_data_master'))
