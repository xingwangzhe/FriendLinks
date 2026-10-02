// WinBox ships ESM at this path, while its community types use export =.
declare module "winbox/src/js/winbox.js" {
  import WinBox = require("winbox");
  export default WinBox;
}
