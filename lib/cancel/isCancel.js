// 这个很简单，就是判断传进来的value的__CANCEL__属性是不是true
export default function isCancel(value) {
  return !!(value && value.__CANCEL__);
}
