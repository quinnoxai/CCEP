import random
import requests
def get_office_response(sentence,received_dict):
    print("Here in get response")
    if "response_complete" in received_dict and received_dict["phase"] =="2":
        print("In if of get_response")
        return get_phase_res(sentence,received_dict)
    else:
        print("In else of get_response")
        return assign_res(sentence)



def assign_res(sentence):
    global yes
    yes = {"response":"Give me your user id","response_complete":"no","phase":"2"}
    word = sentence
    print("Line No 18 in middle_office",word)
    new_word = word.find('unlock')
    if new_word != -1:
        global random_val
        random_val = yes
        print("Line No 7",random_val)
    return random_val



def get_phase_res(sentence,received_dict):
    user_id = sentence.upper()
    user = user_id
    print("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&",user)
    response={"response":"user id not found"}
    print("++++++++++++++++++++++++++++++++++++++++++++++",user)
    if received_dict["phase"] == "2" and user == user_id:
        print("Ïn if of account")
        url = "http://bglr-sapsrv01.quinnox.corp:8000/sap/bc/z_password?sap-client=800"
        print("User id====================================================",user_id)
        data = requests.post(url,data={"username":user_id,"reset":"U"})
        data=data.json()

        print("data",type(data),data)
        response["response"]=data["replies"][0]["content"]
    return response


