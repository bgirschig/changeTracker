if [ ! -f ./key.json ]; then
    echo "Could not find the 'key.json' file. Read 'readme.md' > Getting a key"
    echo "Cancelled deployment."
    exit
fi

gcloud app deploy app.yaml cron.yaml --project bg-common --quiet