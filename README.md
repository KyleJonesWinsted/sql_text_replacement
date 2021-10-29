# SQL Text Replacement

Generate valid SuiteQL by replacing filters using a custom syntax

## Installation

1. Install [node](https://nodejs.org/en/)

2. Download or clone this repo and move the `index.js` file in the `dist` directory into any directory that is in your [PATH](https://superuser.com/questions/284342/what-are-path-and-other-environment-variables-and-how-can-i-set-or-use-them). 

## Usage

```shell
$ sql_replace_text file_name.sql
```

If the program is called with only a file path it will be run interactively. It will present you with each filter that it finds and allow you to enter a value for that filter

```text
Enter a value for foo: bar
Enter a value for date: 2021-09-30
Query has been copied to the clipboard.
```

You can also provide the filter values directly in the shell command

```shell
$ sql_replace_text file_name.sql foo=bar date=2021-09-30
```

The final SuiteQL query will be copied to the system clipboard.

## Custom Filter Syntax

This syntax was created by me, inspired by [Jinja2](https://jinja.palletsprojects.com/en/3.0.x/templates/), to allow me to add saved-search-like filters to my Suitelet that displays the results of an arbitrary SuiteQL query.

There are two types of expressions:

1. Anything inside double curly braces is replaced with it's provided value.

2. An if-else expression is replaced with it's first branch if the variable has a value, or the second branch if the variable doesn't exist. The else block is required even if it is empty.

    - The first word in the `if` block is the filter name and the second word is the Netsuite field type.

    - If you use the `select` or `multiselect` field types, you must provide a record type after a pipe symbol `|`. For example, `select|employee` creates a select field to pick from a list of employee records.


Example Input:
```sql
SELECT firstname

FROM employee

{% if last_name text %}

WHERE lastname = {{last_name}}

{% else %}

WHERE lastname IS NOT NULL

{% endif %}
```

Output if last_name = 'Jones':
```sql
SELECT firstname

FROM employee

WHERE lastname = 'Jones'
```

Output if last_name is undefined:
```sql
SELECT firstname

FROM employee

WHERE lastname IS NOT NULL
```


