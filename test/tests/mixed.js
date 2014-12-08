describe('explosions', function() {
	it('go boom', function() {
    throw new Error('boom!')
  })

  it('are cool', function() {
    'hi'.should.be.ok
  })

  it('should be ignored')

  describe('more', function() {
    it('async success', function(done) {
      setTimeout(function() {
        done()
      }, 10)
    })

    it('one more', function() {})
  })
})