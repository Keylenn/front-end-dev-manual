
const storage =  {
  getItem(key, useLocalStorage) {
    const data = useLocalStorage && useLocalStorage === true ? localStorage.getItem(key) : sessionStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  },
  setItem(key, data, useLocalStorage) {
    if (useLocalStorage && useLocalStorage === true) {
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      sessionStorage.setItem(key, JSON.stringify(data));
    }
  },
  removeItem(key, useLocalStorage) {
    if (useLocalStorage && useLocalStorage === true) {
      localStorage.removeItem(key);
    } else {
      sessionStorage.removeItem(key);
    }
  }
};

export default storage;