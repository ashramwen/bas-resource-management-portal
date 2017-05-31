
export interface StatusTreeNode<T> {
  parent?: StatusTreeNode<T>;
  children?: Array<StatusTreeNode<T>>;
  collapse?: boolean;
  data?: T;
  disabled?: boolean;
}
