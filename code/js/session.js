var gate = 'http://gate.weiyouba.cn:1996/c/sign/signin'
var host = 'ws://s1.weiyouba.cn:1999/s';
var timeout = 3000;
session = function()
{
  this.sock = null;
  this.eventid = 0;
  this.pingtimer = 0;
  this.id = 0;
  this.opponentid = 0;
  this.fire = function(event, args)
  {
    var o =
    {
      id: ++this.eventid,
      event: event
    };
    if(args != null)
      o.args = args;
    this.sock.send(JSON.stringify(o));
  };
  this.ping = function(s)
  {
    return function()
    {
      s.fire('ping');
    };
  };
  this.connected = function(s, sid)
  {
    return function()
    {
      console.log('open');
      s.fire('signin',
        {
          sid: sid
        });
      s.pingtimer = setInterval(s.ping(s), 2000);
    };
  };
  this.disconnected = function(s)
  {
    return function()
    {
      if(s.pingtimer != 0)
        clearInterval(s.pingtimer);
      if(s.sock != null)
      {
        s.sock.close();
        console.log('closed');
        s.sock = null;
      }
    };
  };
  this.start = function(sid)
  {
    if(this.sock != null)
      throw 'open';
    this.sock = new WebSocket(host);
    this.sock.onopen = this.connected(this, sid);
    this.sock.onerror = function(error)
    {
      throw JSON.stringify(error);
    };
    this.sock.onmessage = function(e)
    {
      console.log(e.data);
    };
    this.sock.onclose = this.disconnected(this);
  };
  this.close = function()
  {
    this.disconnected(this)();
  };
  this.signin = function(s, name, pass)
  {
    $.ajax({
      type: 'POST',
      crossDomain: true,
      url: gate,
      data: {name: name, pass: pass},
      success: function(result)
      {
        console.log(JSON.stringify(result));
        s.start(result.sid.value);
      },
      error: function(xhr, err)
      {
        alert(err);
      },
      dataType: 'jsonp'
    });
  }
};
