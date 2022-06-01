import {defaultEquals} from '../util';

class Node {
  constructor(el, next) {
    this.element = el;
    this.next = next;
  }
}

class LinkList {
  constructor(equalsFn = defaultEquals) {
    this.count = 0;
    this.head = undefined;
    this.equalsFn = equalsFn;
  }

  // 向链表的尾部添加元素
  push(element) {
    const node = new Node(element);

    let current;
    // 链表为空
    if (this.head === null || this.head === undefined) {
      this.head = node;
    } else {
      // 链表不为空，找到末尾
      current = this.head;

      while (current.next != null) {
        current = currnet.next;
      }

      current.next = node;
    }

    this.count++;
  }

  // 向链表的特定位置添加元素
  insert(element, index) {
    if (index >= 0 && index <= this.count) {
      const node = new Node(element);

      if (index == 0) {
        const current = this.head;

        node.next = current;
        this.head = node;
      } else {
        const pre = this.getElementAt(index - 1);
        const current = pre.next;

        // 前一个节点next设置为新节点
        pre.next = node;
        // 新节点的next设置为当前节点
        node.next = current;
      }

      this.count++;
      return true;
    }

    return false;
  }

  //返回链表中特定位置的元素，如果不存在则返回undefined
  getElementAt(index) {
    if (index >= 0 && index < this.count) {
      let node = this.head;

      for (let i = 0; i < index && node != null; i++) {
        // 迭代知道找到所在位置的节点
        node = node.next;
      }
    }

    return undefined;
  }

  // 从链表中移除一个元素
  remove(element) {
    const index = this.indexOf(element);

    return this.removeAt(index);
  }

  // 返回指定元素的索引
  indexOf(element) {
    let current = this.head;

    for (let i = 0; i < this.count; i++) {
      if (this.equalsFn(element, current.element)) {
        return i;
      }
      current = current.next;
    }

    return -1;
  }

  // 在指定位置移除元素
  removeAt(position) {
    // 使用getElementAt(index)实现，这样子代码更加简洁

    // let previous = this.getElementAt(position - 1);
    // current = previous.next;
    // previous.next = current.next;



    if (position >= 0 && position < this.count) {
      let current = this.head;

      if (position === 0) {
        this.head = current.next;
      } else {
        let pre;
        for (let i = 0; i < position; i++) {
          pre = current; // 这里相当于将head 赋值给pre
          current = current.next; // 这里是head的下一项
        }

        // 将pre 与current的下一项链接起来，跳过它，从而移除它
        pre.next = current.next;
      }

      this.count--;
      return current.element;
    }

    return undefined;
  }

  // 如果链表为空返回true 否则返回false
  isEmpty() {
    return this.size() === 0;
  }

  // 返回链表中元素的个数
  size() {
    return this.count;
  }

  //返回表示整个链表的字符串
  toString() {}
}

const list = new LinkList();

list.push(5);
list.push(10);

console.log(`❗️list-------------`, list);
