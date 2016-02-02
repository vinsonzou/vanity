play =
{
  match: function(sess)
  {
    sess.fire('match');
  },
  send: function(sess)
  {
    var heroid = Number($('input[name="heroid"]:checked').val());
    sess.fire('send', {heroid: heroid});
  }
};
