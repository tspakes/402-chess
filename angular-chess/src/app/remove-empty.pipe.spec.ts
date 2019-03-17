import {RemoveEmptyPipe} from './pipes/remove-empty.pipe';

describe('RemoveEmptyPipe', () => {
    it('create an instance', () => {
        const pipe = new RemoveEmptyPipe();
        expect(pipe).toBeTruthy();
    });
});
