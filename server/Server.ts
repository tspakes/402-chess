import * as Express from 'express';
import { Request, Response } from 'express';
import * as BodyParser from 'body-parser';
import * as Path from 'path';
import Board from './BoardAPI';

const PORT = 3000;

class Server {
	public app: Express.Application;
	public router: Express.Router;

	constructor() {
		this.app = Express();
		this.router = Express.Router();
		this.app.use(this.router);
		this.config();
		this.route();

		this.app.listen(PORT, () => {
			console.log('Express server listening on port ' + PORT);
			console.log('runtime_path=' + __dirname);
		});
	}

	private config(): void{
		// Support application/json type post data
		this.app.use(BodyParser.json());
		// Support application/x-www-form-urlencoded post data
		this.app.use(BodyParser.urlencoded({ extended: false }));
	}

	private route(): void {
		this.router.use((req: Request, res: Response, next: Function) => {
			// Run this on every incoming request
			console.log('req_url=' + req.url);
			next();
		});

		// Board API
		this.app.get('/board', (req: Request, res: Response) => {
			res.status(200);
			res.json({
				route: 'BoardAPI',
				message: 'Success!'
			});
		});

		// Database API
		this.app.get('/stats', (req: Request, res: Response) => {
			res.status(200);
			res.json({
				route: 'Database',
				message: 'Success!'
			});
		});

		// Website file serving
		this.app.use(Express.static(Path.join(__dirname, '../www')));
	}
}

new Server();