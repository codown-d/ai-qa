export function getHour(dateStr = "") {
  let date = new Date(dateStr);

  let hours = date.getHours();
  let minutes = date.getMinutes();

  // 如果小时或分钟小于10，前面补0
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  const time = hours + ":" + minutes;
  return time;
}

export function getCurrentHour() {
  const date = new Date();

  let hours = date.getHours();
  let minutes = date.getMinutes();

  // 如果小时或分钟小于10，前面补0
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${minutes}`;
}
export const copyEvent = (text: string) => {
  let ipt = document.createElement('textarea');
  ipt.value = text.replace(/<br \/>/g, '');
  document.body.appendChild(ipt);
  ipt.select();
  document.execCommand('Copy');
  ipt.remove();
}

export const timestampFormat = (timestamp: number) => {
  if (!timestamp) return '';
  timestamp = timestamp / 1000
  function zeroize(num) {
    return (String(num).length == 1 ? '0' : '') + num;
  }

  var curTimestamp = parseInt(new Date().getTime() / 1000);
  var timestampDiff = curTimestamp - timestamp;

  var curDate = new Date(curTimestamp * 1000);
  var tmDate = new Date(timestamp * 1000);

  var Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
  var H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();

  if (timestampDiff < 60) {
    return "现在";
  } else if (timestampDiff < 3600) {
    return Math.floor(timestampDiff / 60) + "分钟前";
  } else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && curDate.getDate() == d) {
    return '今天' + zeroize(H) + ':' + zeroize(i);
  } else {
    var newDate = new Date((curTimestamp - 86400) * 1000);
    if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
      return '昨天' + zeroize(H) + ':' + zeroize(i);
    } else if (curDate.getFullYear() == Y) {
      return zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
    } else {
      return Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
    }
  }
}

export function deepCopy(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (hash.has(obj)) {
    return hash.get(obj);
  }

  if (obj instanceof Date) {
    return new Date(obj);
  }

  if (Array.isArray(obj)) {
    const copy = [];
    hash.set(obj, copy);
    obj.forEach((item, index) => {
      copy[index] = deepCopy(item, hash);
    });
    return copy;
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  const copy = {};
  hash.set(obj, copy);
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepCopy(obj[key], hash);
    }
  }

  return copy;
}

export const getToken = () => {
  const token = localStorage.getItem('token')
  if (token) {
    return 'Bearer ' + token;
  }
}
