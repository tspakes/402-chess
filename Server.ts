import board from './BoardAPI';
import * as express from 'express';
import * as bodyParser from 'body-parser';

const PORT = 3000;

class Server {
	public app: express.Application;

	constructor() {
		this.app = express();
		this.config();    
		this.app.listen(PORT, () => {
			console.log('Express server listening on port ' + PORT);
		});
	}

	private config(): void{
		// Support application/json type post data
		this.app.use(bodyParser.json());
		// Support application/x-www-form-urlencoded post data
		this.app.use(bodyParser.urlencoded({ extended: false }));
	}
}

new Server();