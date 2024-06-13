import { createElement } from 'lwc';
import AluCarousalChildCmp from 'c/aluCarousalChildCmp';

describe('c-alu-carousal-child-cmp', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('TODO: test case generated by CLI command, please fill in test logic', () => {
        // Arrange
        const element = createElement('c-alu-carousal-child-cmp', {
            is: AluCarousalChildCmp
        });

        // Act
        document.body.appendChild(element);

        // Assert
        // const div = element.shadowRoot.querySelector('div');
        expect(1).toBe(1);
    });
});