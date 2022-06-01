// 树遍历的广度优先算法

// 时间复杂度：每个点进队出队各一次，故渐进时间复杂度为O(n)
// 空间复杂度：队列中元素的个数不超过n个，故渐进空间复杂度为O(n)

var levelOrder = function (root) {
  const ret = [];
  if (!root) return ret;

  const q = [];
  q.push(root);

  while (q.length !== 0) {
    const currentLevelSize = q.length;

    ret.push([]);

    for (let i = 0; i <= currentLevelSize; ++i) {
      // 从数组的第一个元素移出，并且返回移出的元素
      const node = q.shift();

      ret[ret.length - 1].push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
  }

  return ret;
};
