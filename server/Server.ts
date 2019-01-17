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
		this.config();
		this.route();

		this.app.listen(PORT, () => {
			console.log('Express server listening on port ' + PORT);
			console.log('path=' + __dirname);
		});
	}

	private config(): void{
		// Support application/json type post data
		this.app.use(BodyParser.json());
		// Support application/x-www-form-urlencoded post data
		this.app.use(BodyParser.urlencoded({ extended: false }));
	}

	private route(): void {
		// this.router.use((req: Request, res: Response, next: Function) => {
		// 	// Run this on every incoming request
		// 	next();
		// });

		// TODO Route through other routers first that check if the request matches the APIs

		// Website file serving
		// this.app.use('/web', express.static(__dirname + '/www'));
		console.log(Path.join(__dirname, '../www'));
		this.app.use(
			(req: Request, res: Response, next: Function) => {
				if (!req.baseUrl.startsWith('/board/')) {
					next();
					return;
				}
				// Board API stuff
				res.status(200);
				res.send('Board API');
			},
			(req: Request, res: Response, next: Function) => {
				if (!req.baseUrl.startsWith('/stats/')) {
					next();
					return;
				}
				// Statistics API stuff
				res.status(200);
				res.send('Statistics API');
			},
			Express.static(Path.join(__dirname, '../www'))
		); // Use Path.join here to handle the \ and / b/w Windows and all other OS
		// this.app.use('/raw', express.static(__dirname + '/'));
		// this.app.use('/web', express.static(__dirname + '/www'));
		// this.app.get('/', (req: Request, res: Response) => {
		// 	res.send('Hello world');
		// });

		// Board API
		// this.app.use('/board', this.router);
		// this.router.get('/board', (req: Request, res: Response) => {
			
		// 	res.status(200);
		// 	res.json({
		// 		route: 'BoardAPI',
		// 		message: 'Success!'
		// 	});
		// });

		// // Database API
		// this.app.use('/stats', this.router);
		// this.router.get('/stats', (req: Request, res: Response) => {
		// 	res.status(200);
		// 	res.json({
		// 		route: 'Database',
		// 		message: 'Success!'
		// 	});
		// });
	}
}

new Server();