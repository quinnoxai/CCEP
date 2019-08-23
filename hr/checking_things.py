import datetime
from dateutil.parser import parse
import textwrap
d = ("/Date(844387200000)/".replace("/", ""))[5:-1]
d = int(d[:10])
doj = datetime.datetime.fromtimestamp(d).strftime('%d-%m-%Y')
print(doj)
# from hr.keyword_search import find_word
# def check_word_with_list(sentence,list_words):
#     value=list(x for x in list_words if find_word(sentence,x))
#     if value:
#         return True
#     else:
#         return False
#
#
#
#
# print(check_word_with_list("I need paternity leaves",["paternity leaves","paternity leave"]))


import requests
import datetime
from dateutil.parser import parse
import pprint
import json
from requests.auth import HTTPBasicAuth
##To get the complete user details
# def get_emp_details(user_info_recieved):
#     empId=user_info_recieved["employeeId"]
#     user_info={}
#     url = "https://api4.successfactors.com/odata/v2/EmpEmployment(personIdExternal='4575',userId='4575')/userNav?$format=json"
#     data = requests.get(url,
#                         auth=HTTPBasicAuth('ODATAADMIN@quinnoxinc', '1234'))
#     print(data)
    # # print(data)
    # d = (data["d"]["hireDate"].replace("/", ""))[5:-1]
    # d = int(d[:10])
    # doj = datetime.datetime.fromtimestamp(d).strftime('%d-%m-%Y')
    # #
    # user_info["doj"] = doj
    # db= (data["d"]["custom01"])
    # db= parse(db)
    # # print(db)
    # dob = datetime.datetime.strftime(db,'%d-%m-%Y')
    # # print(dob)
    # user_info["dob"]=dob
    # empsalute = data["d"]["salutation"]
    # country = data["d"]["country"]
    # user_info["addressline2"]=country
    # city = data["d"]["city"]
    # user_info["addressline1"] = city
    # # print(data["d"]["lastName"])
    # user_info["lastName"]=data["d"]["lastName"]
    # user_info["employeeId"]=data["d"]["empId"]
    # user_info["username"]=data["d"]["username"]
    # user_info["employeeClass"]=data["d"]["employeeClass"]
    # # print(country, "n", city)
    # empname = data["d"]["defaultFullName"]
    # firstName=(data["d"]["firstName"])
    # firstName=firstName.split(" ")
    # user_info["firstName"]=firstName[0]
    # user_info["empname"]=empname
    # user_info["mail"]=user_info_recieved["mail"]
    #
    # if empsalute == "13085":
    #     esalute = "Ms"
    #     user_info["esalute"]=esalute
    #     salutation = "Ma'am"
    #     user_info["salutation"] = salutation
    #     pronoun = "her"
    #     user_info["pronoun"] = pronoun
    # elif empsalute == "13083":
    #     esalute = "Mr"
    #     salutation = "Sir"
    #     pronoun = "his"
    #     user_info["esalute"] = esalute
    #     user_info["salutation"] = salutation
    #     user_info["pronoun"] = pronoun
    # return user_info
#     #
# print(get_emp_details({"employeeId":'6759'}))





#
#
# x=list(map(lambda x:x+1,[1,2,3,4]))
# print(x)
#
#
# list_addr=['101 Murarka Apartment', 'Chakradhar Nagar', 'Nallasopara West']
# x='\n'.join(textwrap.fill(x) for x in list_addr)
#
# print(x.strip())
# print(*( textwrap.fill(x) for x in list_addr), sep='\n')