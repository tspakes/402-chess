import * as Express from 'express';
import { Request, Response } from 'express';
import * as BodyParser from 'body-parser';
import * as Path from 'path';
import BoardAPI from './BoardAPI';
import Chalk from 'chalk';

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

		BoardAPI.init();
		BoardAPI.listen();

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
		// Board API
		this.app.get('/board', (req: Request, res: Response) => {
			res.status(200);
			res.send(BoardAPI.getBoard());
		});

		// Database API
		this.app.get('/stats', (req: Request, res: Response) => {
			res.status(200);
			res.json({
				route: 'Database',
				message: 'Success!'
			});
		});

		// Input Spoofing
		this.app.get('/debug', (req: Request, res: Response) => {
			if (!BoardAPI.debug) {
				BoardAPI.debug = true;
				console.log('BoardAPI set to debug state and will remain in this state until the web server is restarted.');
			}
			res.sendFile(Path.join(__dirname, '../debug/inputspoof.html'));
		});
		this.app.get('/debug/move', (req: Request, res: Response) => {
			res.status(200);
			res.json({
				message: 'Updated board state.'
			});
			console.log(req.params);
		});
		this.app.get('/debug/reset', (req: Request, res: Response) => {
			res.status(200);
			res.json({
				message: 'Reset board state.'
			});
			console.log('Reset spoofed board state.');
		});

		// Website file serving
		this.app.use(Express.static(Path.join(__dirname, '../www')));

		this.router.use((req: Request, res: Response, next: Function) => {
			// Run this on every incoming request
			console.log(Chalk.blueBright(req.url));
			next();
		});
	}
}

new Server();