from .master_model import intent_classification as ic
from .trial_model import trial_response_generator
from .small_talk_model import small_talk_action
from .quick_menu import find_quick_menu
from translate import Translator

def get_response(sentence,received_dict,user_info):
    print("main action faq ",received_dict)
    if "response_complete" in received_dict and received_dict["response_complete"] =="no":
        response = trial_response_generator.get_response(sentence,received_dict,['trial'],user_info)
        return response
    else:
        print("get_response in main action FAQ",user_info)
        print("My language is :",user_info['language'])
        trans_lang = (user_info['language']).lower()
        print(trans_lang)
        translator= Translator(from_lang=trans_lang,to_lang="english")
        sentence=translator.translate(sentence)
        print("PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",sentence)
        print("Line no 5 from main action",ic.classify(sentence))
    # get_res(ic.classify(sentence))
        return get_res(sentence,received_dict,ic.classify(sentence),user_info)

def get_res(sentence,received_dict,master_intent,user_info):
    #print(inc.classify(sentence))
    sentence=sentence.lower()
    print("Line no 14 in get_res",sentence)
    if len(master_intent)==0 and sentence.lower() in ['faq']:
        response=quick_res(sentence)
    else:
        if master_intent[0] == "trial":
            response = trial_response_generator.get_response(sentence,received_dict, master_intent,user_info)
        elif master_intent[0] == "small_talk":
            response = small_talk_action.get_small_talk(sentence, received_dict,master_intent)
    return response


def quick_res(sentence):
    if sentence.lower() == "faq":
        response = find_quick_menu.get_quick_menus(sentence.lower())
        print("Line no 26",response)
        response["status"] = "True"
        return response
    else:
        return "No data"
