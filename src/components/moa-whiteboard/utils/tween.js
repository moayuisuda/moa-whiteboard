const copy = (target) => {
  let re = [];
  for (let i in target) {
    re[i] = target[i];
  }

  return re;
};

export const move = (
  origin,
  target,
  duration,
  after, // 每次数值更改后的回调
  fn = (pro) => {
    return Math.sqrt(pro, 2);
  } // 缓动函数
) => {
  if (fn(1) != 1) throw '[move] The fn must satisfy "fn(1) === 1"'; // 当参数为1时，对应的值也要为1，也可以不为1但需要截取函数

  let st, sp;
  st = performance.now(); // 保存开始时间
  sp = copy(origin); // 保存源属性
  let d = {}; // 源与目标之间每一项的距离
  for (let i in origin) {
    d[i] = target[i] - origin[i];
  }

  let frame = (t) => {
    let pro = (t - st) / duration; // 当前进程
    if (pro > 1) {
      pro = 1; // 保证最后完成时为总进度为1
    }
    if (pro < 0) {
      requestAnimationFrame(frame);
      return;
    }

    for (let i in origin) {
      origin[i] = sp[i] + fn(pro) * d[i]; // fn(pro)得出当前时间对应的缓动函数的距离百分比，再乘以总距离
    }

    if (pro === 1) return;
    let id = requestAnimationFrame(frame);
    after && after(copy(origin), pro, id);
  };

  frame(st);
};
