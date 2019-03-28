import * as Express from 'express';
import { Request, Response } from 'express';
import * as BodyParser from 'body-parser';
import * as Path from 'path';
import BoardAPI from './BoardAPI';
import Chalk from 'chalk';
import BoardDriver from './BoardDriver';
import { PieceType } from './Piece';

const PORT = 80;

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
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
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
			try {
				BoardAPI.postTurn();
				res.status(200);
				res.json({
					message: 'Turn committed.'
				});
			} catch (ex) {
				console.log(Chalk.red(ex));
				res.status(400);
				res.json({
					message: ex
				});
			}
		});
		/**
		 * Cancel currently pending turn. Pauses piece detection until /board/resume is called,
		 * so display a button to call that. 
		 */
		this.app.post('/board/cancel', (req: Request, res: Response) => {
			BoardAPI.postCancel();
			res.status(200);
			res.json({
				message: 'Turn pending cancel. Call /board/resume when the pieces have been moved to their locations at the start of the turn.'
			});
		});
		/**
		 * Undo the last committed turn. (no turn may be currently pending)
		 */
		this.app.post('/board/undo', (req: Request, res: Response) => {
			try {
				BoardAPI.postUndo();
				res.status(200);
				res.json({
					message: 'Last turn undone. Call /board/resume when the pieces have been moved to their locations at the start of the last turn.'
				});
			} catch (ex) {
				console.log(Chalk.red(ex));
				res.status(400);
				res.json({
					message: ex
				});
				if (typeof ex !== 'string') {
					throw ex;
				}
			}
		});
		/**
		 * Choose type of piece for pawn promotion. 
		 */
		this.app.post('/board/promote/:type', (req: Request, res: Response) => {
			try {
				BoardAPI.postPromote(req.params.type);
				res.status(200);
				res.json({
					message: `Promoted piece to ${req.params.type}.`
				});
			} catch (ex) {
				console.log(Chalk.red(ex));
				res.status(400);
				res.json({
					message: ex
				});
			}
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
			BoardAPI.init();
			BoardDriver.debug = false;
			BoardDriver.debug = true;
			BoardAPI.postResume();
			console.log('BoardDriver set to debug state and will remain in this state until the web server is restarted.');
			res.sendFile(Path.join(__dirname, '../debug/inputspoof.html'));
		});
		/**
		 * Return request spoofing panel. Does not enable debug mode. 
		 */
		this.app.get('/debug/requests', (req: Request, res: Response) => {
			res.sendFile(Path.join(__dirname, '../debug/requestspoof.html'));
		});
		/**
		 * Toggle turn validity / rule checker. 
		 */
		this.app.get('/debug/validitychecker', (req: Request, res: Response) => {
			BoardAPI.validityChecking = !BoardAPI.validityChecking;
			let msg = `Validity checking ${ BoardAPI.validityChecking ? 'enabled' : 'disabled' }.`;
			console.log(msg);
			res.status(200);
			res.json({
				message: msg
			});
		});
		this.app.post('/debug/set', (req: Request, res: Response) => {
			BoardDriver.debug_setCell(8 - req.query.x, req.query.y - 1, req.query.lift !== 'true');
			res.status(200);
			res.json({
				message: 'Updated board state.'
			});
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

		/**
		 * Return log file. 
		 */
		this.app.get('/log', (req: Request, res: Response) => {
			res.sendFile(Path.join(__dirname, '../log.txt'));
		});

		// Website file serving
		this.app.use(Express.static(Path.join(__dirname, '../www')));

		this.router.use((req: Request, res: Response, next: Function) => {
			// Run this on every incoming request (except /board)
			if (req.url !== '/board' && req.url !== '/log')
				console.log(Chalk.blueBright(req.url));
			next();
		});
	}
}

new Server();