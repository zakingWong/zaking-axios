/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
// 这这个是啥呢？就是你取消请求的时候抛出去的错误类型的类
// 很简单，就是个message
function Cancel(message) {
  this.message = message;
}

// 把它转换成字符串的toString方法的自定义实现
Cancel.prototype.toString = function toString() {
  return "Cancel" + (this.message ? ": " + this.message : "");
};

// 原型上绑定个__CANCEL__，给isCancel做判断的条件。
Cancel.prototype.__CANCEL__ = true;

export default Cancel;
