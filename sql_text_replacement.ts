#!/usr/bin/env node

import * as fs from 'fs';
import * as readline from 'readline';
import * as clipboardy from 'clipboardy';

interface IRequestParams {
  [x: string]: string;
}

interface IParsedFilter {
  fieldName: string;
  fieldType?: string;
  fieldSource?: string;
}

const main = async () => {
  try {
    const fileName = process.argv[2];
    if (!fileName) throw new Error('No file provided in command line arguments.');
    const fileContents = fs.readFileSync(fileName).toString().replace(/{% pdftemplate (\S+) %}/,'');
    const filters = parseFiltersFromQuery(fileContents);
    const parameters = await getParameters(filters);
    const sqlQuery = replaceFileVariables(fileContents, parameters);
    clipboardy.writeSync(removeExtraWhitespace(sqlQuery));
    console.log('Query has been copied to the clipboard.');
  } catch(error) {
    console.error('An error occurred: ' + error);
  }
};

const getParameters = async (filters: IParsedFilter[]): Promise<IRequestParams> => {
  return process.argv.slice(3).length > 0 ?
    process.argv.slice(3).reduce((acc, argv) => {
      const components = argv.split('=');
      acc[components[0]] = components[1];
      return acc;
    }, { } as IRequestParams) :
    await getUserFilterValues(filters);
}

const removeExtraWhitespace = (str: string): string => {
  return str.replace(/\u0000/g, '');
};

const getUserFilterValues = async (filters: IParsedFilter[]): Promise<IRequestParams> => {
  const parameters: IRequestParams = { };
  const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  for (const filter of filters) {
    const value = await getUserInput(reader, `Enter a value for ${filter.fieldName}: `);
    parameters[filter.fieldName] = value;
  }
  reader.close();
  return parameters;
};

const getUserInput = (reader: readline.Interface, question: string): Promise<string> => {
  return new Promise((resolve) => {
    reader.question(question, (input) => {
      resolve(input);
    });
  });
};

/**
 * Parses SQL string for filters to add to Suitelet page
 * @param text - string to parse filters from
 * @returns - object containing filter name, type, and optional source (select fields only)
 */
const parseFiltersFromQuery = (text: string): IParsedFilter[] => {
  const regexes = [/{% if (\S+) (\S+) %}/g, /{{(\S+)}}/g];
  const resultIndices = {
    filterKey: 1,
  };
  const parsedFilters: IParsedFilter[] = [];
  regexes.forEach((regex) => {
    while (true) {
      const results = regex.exec(text);
      if (!results) break;
      const matchingFilters = parsedFilters.filter((filter) => filter.fieldName === results[resultIndices.filterKey]);
      if (matchingFilters.length > 0) continue;
      parsedFilters.push({
        fieldName: results[resultIndices.filterKey],
      });
    }
  });
  return parsedFilters;
};


/**
 * Replaces strings in double braces {{ }} with associated value for the key inside the braces
 * Example:
 * text = 'This is a {{testKey}}'
 * replacements = { testKey: 'Test' };
 * return value = 'This is a Test'
 * @param text - string containing text to be replaced
 * @param replacements - object where keys = text to replace without braces and values = replacement text
 * @returns - text string with all expressions replaced
 */
const replaceFileVariables = (text: string, replacements: IRequestParams): string => {
  for (const key of Object.keys(replacements)) {
    text = text.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
  }
  text = replaceFileConditions(text, replacements);
  return text;
};

/**
 * Replaces if conditions based on existence of filter name in replacements
 * Example:
 *  text = `
 *    {% if testKey text %}
 *    FIRST BLOCK
 *    {% else %}
 *    SECOND BLOCK
 *    {% endif %}
 *  `
 *  replacements = { testKey: 'Test' }
 *  return value = 'FIRST BLOCK'
 * @param text - string containing text to be replaced
 * @param replacements - object where keys = text to replace and values = replacement text
 * @returns - text string with all expressions replaced
 */
const replaceFileConditions = (text: string, replacements: IRequestParams): string => {
  const regex = /{% if (\S+) (\S+) %}((?:(?!{%)[\S\s])+){% else %}((?:(?!{%)[\S\s])+){% endif %}/g;
  const resultIndices = {
    filterKey: 1,
    fieldType: 2,
    first: 3,
    second: 4,
  }
  let nullCount = 0;
  while (nullCount < 2) {
    const results = regex.exec(text);
    if (!results) {
      ++nullCount;
      continue;
    }
    nullCount = 0;
    const matchLength = results[0].length;
    text = text.substr(0, results.index) +
      (replacements[results[resultIndices.filterKey]] ?
        padWithWhitespace(results[resultIndices.first], matchLength) :
        padWithWhitespace(results[resultIndices.second], matchLength)) +
      text.substr(results.index + results[0].length);
  }
  return text;
}

const padWithWhitespace = (text: string, length: number) => {
  while (text.length < length) {
    text = text + '\u0000';
  }
  return text;
}

main();
