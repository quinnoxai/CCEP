
def fetch_status():
	query_results = Cal_data.objects.filter(Task_ID="24266")
	for taskstatus in query_results:
		print(taskstatus.Status)
		new_status = taskstatus.Status
		print(query_results)
		return new_status

def fetch_date_time():
	date_time = Cal_data.objects.filter(Task_ID="24266")
	for exetime in date_time:
		print(exetime.Valuation_Time)
		new_valuation_time = exetime.Valuation_Time
		return new_valuation_time

def fetch_status_name():
	query_status = Cal_data.objects.filter(External_Ref="Volcker_EOD8")
	for tasks_new_status in query_status:
		print("Status",tasks_new_status.Status)
		new_one_status = tasks_new_status.Status
		return new_one_status
