const api = (param) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(param)
    }, 500);
  })
}

export {
  api
}