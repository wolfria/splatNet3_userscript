# Splanet3_userscript

This script currently requires tampermonkey-beta because it contains a GM.cookie.  
It can be obtained from  
https://chrome.google.com/webstore/detail/tampermonkey-beta/gcalenpjmijncebpfijmoaglllgpjagf?hl=ja

Use at your own risk.

For JP Only

This userscript has the ability to automatically set the token issued by s3s or splatnet2statink.  
https://github.com/frozenpandaman/s3s  
https://github.com/frozenpandaman/splatnet2statink

We also use a special trick to get the contents of the config.txt file created by s3s or splatnet2statink from the userscript.  
You will need to place the configToObj.js and semicolon.js included in this product in your s3s or splatnet2statink directory.  
Then modify @require in the userscript to suit you.

```
// @require file:///.../s3s/configToObj.js <- your s3s or splatnet2statink path
// @require file:///.../s3s/config.txt <- your s3s or splatnet2statink path
// @require file:///.../s3s/semicolon.js <- your s3s or splatnet2statink path
```

Then add it to tampermonkey-beta.

Access SplatNet3 with a browser that has userscript applied.

If it does not work, check the following  
Check permissions to read local files in tampermonkey-beta  
Verify that the token issued by s3s or splatnet2statink is correct and has not expired
