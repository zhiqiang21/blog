class Node {
  constructor(key) {
    this.key = key;
    this.left = left;
    this.right = right;
  }
}

// 树的前序遍历  深度遍历
const treeStackPreOrder = function (root) {
  const res = [];
  const stack = [];

  root && stack.push(root);

  // 使用一个栈 stack 每次先输出栈顶元素，也就是当前二叉树根节点，之后依次输出二叉树的左孩子和右孩子
  while (stack.length > 0) {
    let cur = stack.pop();
    res.push(cur.key);
    // 栈是先进后出，右孩子先入栈，每次pop都是左孩子
    cur.right && stack.push(cur.right);
    cur.left && stack.push(cur.left);
  }

  return res;
};
