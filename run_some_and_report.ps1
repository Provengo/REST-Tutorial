provengo -c mode=PARALLEL sample --overwrite --size 20 BookStoreDemo

provengo -c mode=PARALLEL run -s products\run-source\samples.json --before="python reset.py" BookStoreDemo | ForEach-Object {
    if ($_ -match '(.*?) Selected: \[.*?"?description"?:"([^"]+)".*?\]') {
        "$($matches[1]) Selected: [`"$($matches[2])`"]"
    } else {
        $_
    }F
} 

provengo -c mode=PARALLEL report --suites :last .\BookStoreDemo\
