function axios() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "https://httpbin.org/post");
  xhr.send(JSON.stringify({ a: 1, b: 2 }));
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(xhr.response);
      console.log(xhr.responseText);
    }
  };
}

export { axios as default };
//# sourceMappingURL=axios.es5.js.map
