import BaseError from './base-error';

class BadRequest extends BaseError {
  constructor(errors: Record<string, string[]>) {
    super(400, JSON.stringify(errors));
  }
}

export default BadRequest;
