class ArrayUtils {
  isEmpty(ary) {
    return (
      Object.prototype.toString.call(ary) !== '[object Array]' ||
      ary.length <= 0
    );
  }

  isNotEmpty(ary) {
    return !this.isEmpty(ary);
  }
}

export default new ArrayUtils();
