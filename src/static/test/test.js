var expect = chai.expect;
var should = chai.should();

describe('Keyboard', function() {
  describe('#getChar', function() {
    it('returns an DOM object of that character', function() {
      const $element = keyboard.getChar();
      expect($element.index()).to.equal(0);
    });
  });

  describe('#markChar', function() {
    it("returns adds marked to the DOM element's class", function() {
      keyboard.markChar();
      const $element = keyboard.getChar();
      expect($element.attr('class')).to.equal('marked');
    });
  });

  describe('#unmarkChar', function() {
    it("returns removes marked to the DOM element's class", function() {
      keyboard.unmarkChar();
      const $element = keyboard.getChar();
      expect($element.attr('class')).to.not.equal('marked');
    });
  });

  describe('#length', function() {
    it("gets the count of characters in the textbox ", function() {
      expect(keyboard.length()).to.equal(1);
    });
  });

  describe('#newChar', function() {
    it("adds a new character to the textbox ", function() {
      keyboard.newChar('T')
      keyboard.nextIndex();
      const $element = keyboard.getChar();
      expect($element.text()).to.equal('T');
    });

    it("adds a #tag to the textbox ", function() {
      keyboard.newChar('dogs', true)
      keyboard.nextIndex();
      const $element = keyboard.getChar();
      expect($element.text()).to.equal('#dogs');
    });
  });

  describe('#prevIndex', function() {
    it("goes to the previous character in the textbox ", function() {
      const $element = keyboard.getChar();
      keyboard.prevIndex();
      expect($element.index()).to.equal(2);
    });
  });

  describe('#nextIndex', function() {
    it("goes to the next character in the textbox ", function() {
      const $element = keyboard.getChar();
      keyboard.nextIndex();
      expect($element.index()).to.equal(1);
    });
  });

  describe('#backspace', function() {
    it("removes the current index character from the textbox ", function() {

      const currentSize = keyboard.length();
      keyboard.backspace();
      expect(keyboard.length()).to.equal(currentSize - 1);
    });
  });

  describe('#type', function() {
    it("typing handler that transforms keyCodes to characters ", function() {

      const currentSize = keyboard.length();
      keyboard.type(24);
      const $element = keyboard.getChar();
      expect($element.text()).to.equal('\u0018');
    });
  });

  describe('#shiftUp', function() {
    it("sets the keyboard to stop aknolwedging the shiftKey ", function() {

      keyboard.shiftUp();
      expect(keyboard.shiftKeyDown).to.equal(false)
    });
  });

  describe('#shiftDown', function() {
    it("sets the keyboard to stop aknolwedging the shiftKey ", function() {

      keyboard.shiftDown();
      expect(keyboard.shiftKeyDown).to.equal(true)
    });
  });

});
