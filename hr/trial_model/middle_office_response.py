import random
import requests
def get_middle_response(sentence,received_dict):
    print("Here in get response")
    if "response_complete" in received_dict and received_dict["phase"] =="1":
        print("In if of get_response")
        return get_phase_response(sentence,received_dict)
    else:
        print("In else of get_response")
        return assign_response(sentence)



def assign_response(sentence):
    global yes
    yes = {"response":"Give me your user id","response_complete":"no","phase":"1"}
    word = sentence
    print("Line No 5 in middle_office",word)
    new_word = word.find('reset')
    if new_word != -1:
        global random_value
        random_value = yes
        print("Line No 7",random_value)
    return random_value



def get_phase_response(sentence,received_dict):
    user_id = sentence.upper()
    user = user_id
    response={"response":"user id not found"}
    print("++++++++++++++++++++++++++++++++++++++++++++++",user)
    if received_dict["phase"] == "1" and user == user_id:
        url = "http://bglr-sapsrv01.quinnox.corp:8000/sap/bc/z_password?sap-client=800"
        data = requests.post(url,data={"username":user_id,"reset":"R","response_complete":"no"})
        data=data.json()
        print("data",type(data),data)
        response["response"]=data["replies"][0]["content"]
    return response


