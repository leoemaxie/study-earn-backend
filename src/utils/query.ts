import {Request} from 'express';
import {BadRequest} from './error';
import {QueryableFields} from './fields';

export function validateQuery(req: Request, queryableFields: QueryableFields) {
  const {query} = req;
  const queryFields = Object.keys(query);
  const invalidFields: string[] = [];
  const invalidTypes: string[] = [];

  for (const field of queryFields) {
    if (!queryableFields.hasOwnProperty(field)) {
      invalidFields.push(field);
      continue;
    }

    const fieldType = queryableFields[field];
    const fieldValue = query[field];

    switch (fieldType) {
      case 'number':
        if (isNaN(Number(fieldValue))) {
          invalidTypes.push(field);
        }
        break;
      case 'boolean':
        if (fieldValue !== 'true' && fieldValue !== 'false') {
          invalidTypes.push(field);
        }
        break;
      case 'array':
        if (
          !Array.isArray(fieldValue) &&
          typeof fieldValue === 'string' &&
          !fieldValue.includes(',')
        ) {
          invalidTypes.push(field);
        }
        break;
      case 'string':
        if (typeof fieldValue !== 'string') {
          invalidTypes.push(field);
        }
        break;
      default:
        break;
    }
  }

  if (invalidFields.length || invalidTypes.length) {
    const errorMessages: string[] = [];

    if (invalidFields.length) {
      errorMessages.push(
        `Invalid fields: ${invalidFields.join(', ')}`,
        `Allowed fields: ${Object.keys(queryableFields).join(', ')}`
      );
    }

    if (invalidTypes.length) {
      errorMessages.push(
        `Invalid types: ${invalidTypes.join(', ')}`,
        `Expected types: ${invalidTypes.map(field => `${field}: ${queryableFields[field]}`).join(', ')}`
      );
    }

    throw new BadRequest(
      `There are ${invalidFields.length} invalid field(s) and ${invalidTypes.length} invalid type(s) in your query`,
      'MalformedQuery',
      errorMessages
    );
  }
}
