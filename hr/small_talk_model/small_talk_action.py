from .intent_classification import classify
import os,json, random
from hrhelpdesk.settings import BASE_DIR
def get_small_talk(sentence,dict_received,master_intent):
    small_intent=classify(sentence)
    with open(os.path.join(BASE_DIR,r'hr/small_talk_model/intent_new.json'))as json_data:
        intents = json.load(json_data)
    x = list(filter(lambda x: x["intent"] == small_intent[0], intents["intents"]))
    if x[0]["intent"]=="goodbye" or x[0]["intent"]=="thankyou":
        response = {"response": (random.choice(x[0]["responses"])+". <br>I hope you enjoyed talking to me, would like to rate the experience?"),
                    "response_complete": "no",
                    "master_intent":master_intent,
                    "model_intent":small_intent,
                    "feedback":"yes",
        "status":"True"}

    else:
        response={"response":random.choice(x[0]["responses"]),
              "response_complete":"yes",
                  "master_intent": master_intent,
                  "ask_more":"yes",
        "status":"True"
        }

    return response
