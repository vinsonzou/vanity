function session()
{
  var thiz = this;
  this.sock = null;
  this.eventId = 0;
  this.pingTimer = 0;
  this.fire = function(event, args)
  {
    if(this.sock == null)
      return;
    var o =
    {
      id: ++this.eventId,
      event: event
    };
    if(args != null)
      o.args = args;
    this.sock.send(JSON.stringify(o));
  };
  this.ping = function()
  {
    thiz.fire('ping');
  };
  this.connect = function()
  {
    var gate = 'http://gate.weiyouba.cn:1996/c/sign/signin';
    var host = 'ws://s1.weiyouba.cn:1999/s';

    var name = $('input[name="name"]').val();
    var pass = $('input[name="pass"]').val();
    if(name == '' || pass == '')
      throw 'error input';
    $.ajax({
      type: 'POST',
      crossDomain: true,
      url: gate,
      data: {name: name, pass: pass},
      success: function(result)
      {
        console.log(JSON.stringify(result));
        var sid = result.sid.value;
        if(thiz.sock != null)
          throw 'open';
        thiz.sock = new WebSocket(host);
        thiz.sock.onopen = function()
        {
          console.log('open');
          thiz.fire('signin',
            {
              sid: sid
            });
          thiz.pingTimer = setInterval(thiz.ping, 5000);
        };
        thiz.sock.onerror = function(error)
        {
          throw JSON.stringify(error);
        };
        thiz.sock.onmessage = function(e)
        {
          console.log(e.data);
        };
        thiz.sock.onclose = function()
        {
          if(thiz.pingTimer != 0)
            clearInterval(thiz.pingtimer);
          thiz.sock = null;
        };
      },
      error: function(xhr, err)
      {
        alert(err);
      },
      dataType: 'jsonp'
    });
  };
  this.close = function()
  {
    if(this.sock != null)
      this.sock.close();
  };
}
