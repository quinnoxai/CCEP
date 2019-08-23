import smtplib
from string import Template
import os

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
# from email.MIMEMultipart import MIMEMultipart
# from email.MIMEText import MIMEText
# from email.MIMEBase import MIMEBase
from email import encoders


def mail_send(body,subject,sender_id,attachment_path,attachment_name):
    print(sender_id)
    # chage the below functions here with ask sherlock id
    fromaddr = "HrBuddy@quinnox.com"
    toaddr = sender_id

    msg = MIMEMultipart()

    msg['From'] = fromaddr
    msg['To'] = toaddr
    msg['Subject'] = subject


    msg.attach(MIMEText(body, 'plain'))

    # filename = "files/AddressProoffor.doc"
    if attachment_name!="":
        attachment = open(os.path.join(attachment_path), "rb")
        part = MIMEBase('application', 'octet-stream')
        part.set_payload((attachment).read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', "attachment; filename= %s" % attachment_name)
        msg.attach(part)

    server = smtplib.SMTP('smtp.office365.com', 587)
    server.starttls()
    server.login(fromaddr, "Quinnox@1234")  # change here too password
    text = msg.as_string()
    server.sendmail(fromaddr, toaddr, text)
    server.quit()

# mail_send("","test12","ruhins@quinnox.com , anurikac@quinnox.com","","")