import requests
url = "http://bglr-sapsrv01.quinnox.corp:8000/sap/bc/z_password?sap-client=800"
data = requests.post(url,data={"username":"ABAP99","reset":"U"})

print(data.json())
