import { expect } from 'chai';
import stringMatcher from '../utils/stringMatcher';

const TEXT = 'the little banana is looking for a cap';

describe('string matcher', () => {
    describe('patternsMatchText', () => {
        it('should return true if the pattern can be found in the text', () => {
            let actual = stringMatcher.patternsMatchText(TEXT, ['banana']);
            expect(actual).to.be.true;
        });
        it('should return true if at least one of the patterns can be found in the text', () => {
            let actual = stringMatcher.patternsMatchText(TEXT, ['apple', 'banana']);
            expect(actual).to.be.true;
        });
        it('should return true ignoring the case', () => {
            let actual = stringMatcher.patternsMatchText(TEXT, ['baNAna']);
            expect(actual).to.be.true;
        });
        it('should return false if patters have no match in text', () => {
            let actual = stringMatcher.patternsMatchText(TEXT, ['apple']);
            expect(actual).to.be.false;
        });
        it('should return false if text is null', () => {
            let actual = stringMatcher.patternsMatchText(null, ['banana']);
            expect(actual).to.be.false;
        });
        it('should return false if patterns is null', () => {
            let actual = stringMatcher.patternsMatchText(TEXT, null);
            expect(actual).to.be.false;
        });
        it('should return false if text is empty', () => {
            let actual = stringMatcher.patternsMatchText('', ['banana']);
            expect(actual).to.be.false;
        });
        it('should return false if patterns is empty', () => {
            let actual = stringMatcher.patternsMatchText(TEXT, '');
            expect(actual).to.be.false;
        });
    });
});
