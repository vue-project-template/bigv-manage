class StringUtils {
  isEmpty(str) {
    return (
      Object.prototype.toString.call(str) !== "[object String]" ||
      !str ||
      !str.trim() ||
      str.trim() === 'null' ||
      str.trim() === 'undefined'
    );
  }

  isNotEmpty(str) {
    return !this.isEmpty(str);
  }
}

export default new StringUtils();
