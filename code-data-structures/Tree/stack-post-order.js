class Node {
  constructor(key) {
    this.key = key;
    this.left = left;
    this.right = right;
  }
}
// 1.依次遍历左孩子，在栈中依次记录，当左孩子为空时，遍历到叶子节点
// 2.跳回上一层节点，防止while进入死循环，将上一层左孩子置空
// 3.接着遍历右孩子，在栈中依次记录值，当右孩子为空时，遍历到了叶子节点
// 跳到上一层节点，防止while循环重复进入，将上一层右孩子置空


const treeStackPostOrder = function (root) {
  const res = [];
  const stack = [];

  while (root || stack.length) {
    if (root.left) {
      stack.push(root);
      root = root.left;
    } else if (root.right){
      stack.push(root);
      root = root.right;
    } else {
      res.push(root.key);
      root = stack.pop();

      root && (root.left = null) && (root.right = null);
    }
  }
}


// 逆序思维  前序遍历的逆序过程
const treeStackPostOrder = function (root) {
  const res = [];
  const stack = [];

  while (root || stack.length) {

    // 前序遍历的逆过程，数组头部添加key
    res.unshift(root.key);
    root.left && stack.push(root.left);
    root.right && stack.push(root.right);

    root = stack.pop();
  }

  return res;
}


// 使用数组 的reverse 方法反转前序数组
const treeStackPostOrder = function (root) {
  let stack = [];
  let res = [];

  root && stack.push(root);

  while (stack.length > 0) {
    let cur = stack.pop();

    res.push(cur.key);
    cur.left && stack.push(cur.left);
    cur.right && stack.push(cur.right);
  }

  return res.reverse();
}
