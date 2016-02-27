describe('explosions', function() {
  it('go boom', function() {
    throw new Error('boom!');
  });

  it('are cool', function() {
    'hi'.should.be.ok;
  });

  it('should be ignored');

  describe('more', function() {
    it('async success', function(done) {
      setTimeout(function() {
        done();
      }, 10);
    });

    it('one more failure', function() {
      throw new Error('oops!');
    });

    it('failure with errors', function() {
      console.error("Here is some STDERR!");
      console.warn("Here is some more STDERR!");
      throw new Error("oops with errors!");
    });

    it('success with output', function(done) {
      console.log("Here is some STDOUT!");
      console.log("Here is some more STDOUT!");
      done();
    });
  });
});