import HttpException from './http.exception';
import { UNAUTHORIZED } from '../status_codes';

class WrongTokenException extends HttpException {
  constructor() {
    super(UNAUTHORIZED, `Unauthorized`);
  }
}

export default WrongTokenException;
