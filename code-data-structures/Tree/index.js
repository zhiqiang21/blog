// 树的遍历
//blog.csdn.net/My_Jobs/article/details/43451187

// 二叉搜索是二叉树的一种，但是只允许你在左侧节点存储（比父节点）小的值，在右侧节点存储（比父节点）大的值

import {Compare, defaultCompare} from '../util';
export class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

export default class BinarySearchTree {
  // 默认参数用来比较节点的大小
  constructor(compareFn = defaultCompare) {
    this.compareFn = compareFn;
    this.root = null;
  }

  // 向树中插入新的节点
  insert(key) {
    if (this.root == null) {
      this.root = new Node(key);
    } else {
      this.insertNode(this.root, key);
    }
  }

  // 找到二插搜索树插入新node的位置
  insertNode(node, key) {
    if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      if (node.left === null) {
        node.left = new Node(key);
      } else {
        this.insertNode(node.left, key);
      }
    } else {
      if (node.right === null) {
        node.right = new Node(key);
      } else {
        this.insertNode(node.right, key);
      }
    }
  }

  // 查询节点是否在树中存在
  search(key) {
    return this.searchNode(this.root, key);
  }

  searchNode(node, key) {
    if (node == null) {
      return false;
    }

    if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      return  this.searchNode(node.left, key);
    } else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
      return this.searchNode(node.right, key);
    } else {
      return true;
    }
  }

  // 中序遍历所有的节点
  // 从最小到最大顺序访问所有节点，中序遍历应用就是排序搜索
  inOrderTraverse(callback) {
    this.inOrderTraverseNode(this.root, callback);
  }

  inOrderTraverseNode(node, callback) {
    if (node !== null) {
      this.inOrderTraverseNode(node.left, callback);
      callback(node.key);
      this.inOrderTraverseNode(node.right, callback);
    }
  }

  // 先序遍历
  // 优先于后代节点的顺序访问每个节点的，线序遍历的一种应用是打印一个结构化的文档
  // 先序遍历优先访问节点本身，然后访问他的左侧节点，最后输出他的右侧节点
  preOrderTraverse(callback) {
    this.preOrderTraverseNode(this.root, callback);
  }

  preOrderTraverseNode(node, callback) {
    if (node !== null) {
      callback(node.key);
      this.preOrderTraverseNode(node.left, callback);
      this.preOrderTraverseNode(node.right, callback);
    }
  }

  // 后序遍历
  postOrderTraverse(callback) {
    this.postOrderTraverseNode(this.root, callback);
  }

  // 后序遍历会先访问左侧子节点，然后是右侧子节点，然后是父节点本身
  postOrderTraverseNode(node, callback) {
    if (node !== null) {
      this.postOrderTraverseNode(node.left, callback);
      this.postOrderTraverseNode(node.right, callback);
      callback(node.key);
    }
  }

  // min最小的值
  min() {
    return this.minNode(this.root);
  }

  minNode(node) {
    let current = node;

    while (current !== null && current.left!== null) {
      current = current.left;
    }

    return current;
  }

  // 最大的值
  max(callback) {
    return this.maxNode(this.root);
  }

  maxNode(node) {
    let current = node;

    while (current !== null && current.right !== null) {
      current = current.right;

    }
    return current;
  }

  // 从树中移除某个key
  remove(key) {
    this.root =  this.removeNode(this.root, key);
  }

  removeNode(node, key) {
    if (node === null) return null;

    if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
      node.left = this.removeNode(node.left, key);
      return node;
    } else if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      node.right = this.removeNode(node.right, key);

      return node;
    } else {
      // 节点为空 当前节点是没有左侧叶子节点或者是右侧叶子节点
      if (node.left === null && node.right === null) {
        // 赋值null移除它
        node = null;
        // 将对应的父节点指针赋值Null值，节点中返回节点的值
        return node;
      }

      // 移除有一个左侧节点或者是有一个右侧节点的节点
      if (node.left === null) {
        node = node.right;
        return node;
      } else if(node.right === null) {
        node === node.left;
        return node;
      }

      // 移除的节点有两个子节点 将比要移除节点的值替换为要移除的节点，然后删除比移除节点key的值都大的节点
      const aux = this.minNode(node.right);
      node.key = aux.key;
      node.right = this.removeNode(node.right, aux.key);
      return node;
    }
  }
}
const nodeObj = new BinarySearchTree();

nodeObj.insert(4);
nodeObj.insert(1);
nodeObj.insert(2);
nodeObj.insert(3);
nodeObj.insert(5);
nodeObj.insert(6);
nodeObj.insert(7);


console.log(`❗️nodeObj-------------`, nodeObj);

console.log(`search-------`, nodeObj.search(5))
