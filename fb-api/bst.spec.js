var FB = require('fb');

// insert your own token to test
const token = FB.setAccessToken('EAAMIaKSfaiQBAEkzjKiolWXLZCNreEcFVc1P0M71qZAjUvjCYZCNHtBhjCFtCjWy1kcqckAl4edJa5kvujwKn4ZAmG1MuSgxYmZCjCnZCNQYbEiCVCCc7XIZBDSitTV4zi5xdlIXZBf79ZCX3fGZCmfDvmb2PGxs4Y7xL76SBZBCYdTDERT0d8ZCa7X6S9XLYZB280kVcZCzDlzFd0KXpcDoUafgqXu4arfZBrOXZCxp5k8IsCmC1wZDZD');

FB.api('10100215638281494', 'get', function (res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }
  console.log(res);
});

FB.api(`/https://graph.facebook.com/v1.0/me/friends?access_token=${token}`,  function (response) {
    if (response && !response.error) {
      console.log(response);
    }
  }
);

FB.api('me/feed', 'get', function (res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }
  console.log(res);
});

FB.api('me', 'get', function (res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }
  console.log(res.name);
});

FB.api('https://www.facebook.com/dialog/oauth?client_id=CLIENT_ID&redirect_uri=REDIRECT_URL&scope=read_stream', 'get', function (res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }
  console.log(res);
});

FB.api(`https://graph.facebook.com/v2.9/10100215638281494/photos?access_token=${token}`, 'get', function (res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }
  console.log(res);
});


