
class Node {
  constructor(key) {
    this.key = key;
    this.left = left;
    this.right = right;
  }
}


const treeStackInOrder = function (root) {
  const res = [];
  const stack = [];

  while (root || stack.length) {
    //首先迭代左孩子，左孩子依次入栈
    if (root.left) {
      stack.push(root);
      root = root.left;
      //如果左孩子空了，输出节点然后去迭代右孩子
    } else if (root.right) {
      res.push(root.key);
      root = root.right;
      // 如果左右孩子都为空了，输出当前节点，栈顶元素弹出，回退到上一层，此时置空节点的左孩子，防止while陷入死循环
    } else if (!root.left && !root.right) {
      res.push(root.key);
      root = stack.pop();
      root && (root.left = null);
    }
  }
};


// 优化版，只需要判断Node 节点存在不存在
const treeStackInOrder = function (root) {
  const stack = [];
  const res = [];
  let node = root;

  while (stack.length > 0 || node !== null) {
    if (node) {
      stack.push(node);
      node = node.left;
    } else {
      node = stack.pop();
      res.push(node.key);
      // 如果右孩子不存在就弹出栈顶元素到上一层
      node = node.right;
    }
  }

  return res;
}
