#!/bin/bash

# Step 1: Generate samples
provengo -c mode=MODEL sample --overwrite --size 5 REST-Tutorial/BookStoreDemo
if [ $? -eq 0 ]; then
    # Step 2: Run tests
    provengo -c mode=MODEL run -s products/run-source/samples.json --before=REST-Tutorial/reset.sh REST-Tutorial/BookStoreDemo | sed -E 's/(.*) Selected: \[.*description:"([^"]+).*/\1 Selected: [\2]/'

    # Step 3: Generate report
    provengo -c mode=MODEL report --suites :last REST-Tutorial/BookStoreDemo/
else
    echo "Sample generation failed. Stopping execution." >&2
    exit 1
fi
