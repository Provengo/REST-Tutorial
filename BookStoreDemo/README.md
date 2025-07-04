# BookStoreDemo

---
2025-05-25 15:28:50
gera

Provengo project for spec-ing and testing my system.


## Important Files

* README.md This file.
* [config](config) Configuration files and administrative data.
    * [provengo.yml](config/provengo.yml) Main Configuration file
    * [hooks](config/hooks) Hook scripts (pre/post/...)
* [spec](spec) The code creating the specification space lives here. Organized by language.
    * [js](spec/js) JavaScript files
      * [hello-world.js](spec/js/hello-world.js) Initial model file.
* [meta-spec](meta-spec) Code for working with the specification space
    * [ensemble-code.js](meta-spec/ensemble-code.js) Sample code for generating test optimized test suites (ensembles)
    * [book-writer.js](meta-spec/book-writer.js) Sample code for generating test books
    * [script-writer.js](meta-spec/script-writer.js) Code for generating test scripts.
* [lib](lib) Place to store JavaScript libraries. Loaded first.
* [data](data) Place to store data files. Loaded second (so you can use library code to in your data).
    * [data.js](data/data.js) Sample data file.
* [products](products) Artifacts generated from the spec (such as run logs, scripts, and test-books) will be stored here. Much like `build` directories in other platforms, this directory can be ignored by version control systems (e.g. `git`).


## Useful Commands

⚠️ NOTE: In the below listings, we assume that `provengo` is in the system's PATH variable, and that `C:\Users\gera\provengo\REST-Tutorial\BookStoreDemo` is the path to this directory.

For full documentation go to [https://docs.provengo.tech](docs.provengo.tech).

### Randomized Run 

Perform a single run through the specification. Good for "Sanity checks", i.e. to see examples of what can happen.

    provengo run --dry C:\Users\gera\provengo\REST-Tutorial\BookStoreDemo


### Visualize the Spec

Draw the specification in a PDF file.

    provengo analyze -f pdf C:\Users\gera\provengo\REST-Tutorial\BookStoreDemo


⚠️ NOTE: This requires [Graphviz](http://graphviz.org) to be installed.


### Sample Runs from the Spec

Sample 10 scenarios into a file. The scenarios are stored in a file called `samples.json` (this can be changed using the `-o`/`--output-file` switch).

    provengo sample --overwrite --size 10 C:\Users\gera\provengo\REST-Tutorial\BookStoreDemo


### Create an Optimized Test Suite

Generate a test suite of 5 tests that provides a good coverage of items in the [GOALS](z-ranking.js#L18) array.

**Requires running `sample` first** (the previous command)**.**

    provengo ensemble --size 5 C:\Users\gera\provengo\REST-Tutorial\BookStoreDemo

#### Visualize the Spec and the Suite

Draw the specification, and highlight the traces in the optimized test suite create by the previous command.

    provengo analyze -f pdf --highlight ensemble.json C:\Users\gera\provengo\REST-Tutorial\BookStoreDemo

### Create Test Scripts for Third Party Systems

Converts the runs in `ensemble.json` to automation test scripts.

    provengo gen-scripts -s ensemble.json C:\Users\gera\provengo\REST-Tutorial\BookStoreDemo

## AI code completion
To enable AI code completion, please use a code completion plugin (e.g., [GitHub Copilot](https://github.com/features/copilot)) and keep open the files inside the [config/ai](config/ai) folder.
