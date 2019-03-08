import { RawChange } from "./BoardAPI";
import { TurnType } from "./Turn";

export type StateEnum = 'init'|'any'|'move'|'enpassant'|'castle'|'take'|'takealt'|'takeconfirm'|'error';

export class State {
	private static _state: StateEnum = 'init';

  public static get state(): StateEnum {
    return this._state;
  }

  public static process(change: RawChange, sameTeam: boolean): void {
    if (this._state === 'init') {
      if (!change.lift) this._state = 'error'; // Drop - drops not allowed at init state
      else if (sameTeam) this._state = 'any'; // Current lift
      else this._state = 'takealt'; // Enemy lift
    } else if (this._state === 'any') {
      if (!change.lift) this._state = 'move';
      else if (sameTeam) this._state = 'castle';
      else this._state = 'take';
    } else if (this._state === 'move') {
      if (!change.lift) this._state = 'error'; // A second drop is not allowed after a move
      else if (sameTeam) this._state = 'castle';
      else this._state = 'enpassant';
    } else if (this._state === 'enpassant') { // A take could also be an en passant
      this._state = 'error'; // No undos or extra actions allowed at en passant state
    } else if (this._state == 'castle') {
      if (!change.lift) this._state = 'castle';
      else this._state = 'error'; // No more lifts allowed at castle state
    } else if (this._state === 'take') {
      if (!change.lift) this._state = 'takeconfirm';
      else this._state = 'error'; // No more lifts allowed at take state
    } else if (this._state === 'takealt') {
      if (!change.lift) this._state = 'error'; // Can't drop on a take before a friendly piece has been lifted
      else if (sameTeam) this._state = 'take';
      else this._state = 'error'; // Can't lift multiple enemy pieces
    } else if (this._state === 'takeconfirm') {
      if (!change.lift) this._state = 'init';
      else this._state = 'error';
    } else if (this._state === 'error') {
      // Ignore changes is set to true
      // Wait for a call from the website to declare that everything is ok
    }
  }

  public static commit(): TurnType {
    let type: TurnType = 'invalid';
    if (this._state === 'move') type = 'move';
    else if (this._state === 'enpassant') type = 'enpassant';
    else if (this._state === 'castle') type = 'castle';
    else if (this._state === 'take') type = 'invalid';
    else if (this._state === 'takealt') type = 'invalid';
    else if (this._state === 'takeconfirm') type = 'take';
    this._state = 'init';
    return type;
  }
}
