# petition tracker

Change.org doesn't provide much in terms of analytics.
This micro project is to provide some insights into a petition's dynamics

Currently, this is hard-coded for a single petition but should'nt be too hard to extend to multiple
ones
change.org/5g

## how it works
- A cron job runs every two minutes, calling the 'recordSignatureCount' endpoint,
  - The petition's page on change.org is scraped to find the latest signature count
  - An entry is added to the firestore database
- The frontend is static, served with appengine's static_dir handler
  - fetches the data from the firestore directly, and displays it using plotly

## Getting a key
The key to get access to the database is not stored in this repo (and shouldn't be), so you'll need
to create one from the [gcloud console](https://console.cloud.google.com/iam-admin/serviceaccounts/details/110969054837021940893?project=bg-common) and add it to the project:
- download the key as a json file
- move it to the root of this directory
- rename it `key.json`

## how to run
- Make sure you have a valid service account key (see `Getting a key`)
- Run `dev_appserver.py .`. this will download all python dependencies and run the project

## how to deploy
- Make sure you have a valid service account key (see `Getting a key`)
- Run ./deploy