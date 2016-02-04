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
          thiz.pingTimer = setInterval(thiz.ping, 15000);
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
          console.log('closed');
          if(thiz.pingTimer != 0)
            clearInterval(thiz.pingTimer);
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
