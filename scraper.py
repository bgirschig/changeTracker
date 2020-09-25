# Tools to extract information from change.org

import requests
from time import sleep
import xml.etree.ElementTree as ET
import re
import json
import datetime
import random

# This relies on the first script element of the petition's page declaring a
# 'window.changeTargetingData' json object, containing a petition.signatureCount.total property
def getSignatureCount(petitionUrl):
  try:
    response = requests.get(petitionUrl)
    if (response.ok):
      content = response.text
      script = re.findall("<script>(.+?)<\/script>", content, re.DOTALL)[0]
      dataStr = script.strip().replace("window.changeTargetingData =", "")
      dataStr = dataStr[:-1]
      data = json.loads(dataStr)
      return data["petition"]["signatureCount"]["total"]
    else:
      return f"network error: {response.status_code}"
  except Exception as e:
    print(e)
    return "Unexpected error"
