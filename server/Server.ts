import * as Express from 'express';
import { Request, Response } from 'express';
import * as BodyParser from 'body-parser';
import * as Path from 'path';
import BoardAPI from './BoardAPI';
import Chalk from 'chalk';
import BoardDriver from './BoardDriver';

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
		
		// Enable cross origin requests
		this.app.use(function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			next();
		});
		
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
		/** 
		 * Resets board to initial state. Pauses move detection until /board/resume is called.
		 */
		this.app.post('/board/reset', (req: Request, res: Response) => {
			BoardAPI.init();
			res.status(200);
			res.json({
				message: 'Board reset to initial state.'
			});
		});
		/**
		 * Pause piece detection. 
		 */
		this.app.post('/board/pause', (req: Request, res: Response) => {
			BoardAPI.postPause();
			res.status(200);
			res.json({
				message: 'Piece detection paused.'
			});
		});
		/**
		 * Resume piece detection. 
		 */
		this.app.post('/board/resume', (req: Request, res: Response) => {
			BoardAPI.postResume();
			res.status(200);
			res.json({
				message: 'Piece detection resumed.'
			});
		});
		/**
		 * Commit currently pending turn. 
		 */
		this.app.post('/board/commit', (req: Request, res: Response) => {
			BoardAPI.postTurn();
			res.status(200);
			res.json({
				message: 'Turn committed.'
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

		// Input Spoofing
		/**
		 * Enable hardware spoofing, enable piece detection, and return the control panel. 
		 */
		this.app.get('/debug', (req: Request, res: Response) => {
			BoardAPI.postResume();
			if (!BoardDriver.debug) {
				BoardDriver.debug = false;
				BoardDriver.debug = true;
				console.log('BoardDriver set to debug state and will remain in this state until the web server is restarted.');
			}
			res.sendFile(Path.join(__dirname, '../debug/inputspoof.html'));
		});
		this.app.post('/debug/set', (req: Request, res: Response) => {
			res.status(200);
			res.json({
				message: 'Updated board state.'
			});
			BoardDriver.debug_setCell(req.query.x - 1, req.query.y - 1, req.query.lift !== 'true');
		});
		/**
		 * Reset the spoofed hardware state. 
		 */
		this.app.post('/debug/reset', (req: Request, res: Response) => {
			res.status(200);
			res.json({
				message: 'Reset board state.'
			});
			BoardDriver.debug = false;
			BoardDriver.debug = true;
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