export const pageObj = {
  // 定义分页参数配置对象
  totalItem: 100, //总条数
  currentPage: 1, //当前页码
  totalPage: 99, //总页码
  everyItem: 10 //每页条数
};

// 便捷接口创建表数据格式定义
export class EasyApi_createObj {
  tableName: string;
  fields: FieldObj[];
}

export class FieldObj {
  name: string; // 字段名同sql数据库字段名命名规则相同，采用全小写，多个单次间用 “_” 连接
  type: string; // string 对应类型：VARCHAR(255)，longStr 对应类型：LONGTEXT(0), bool bool,date 对应类型：datetime(0),int 对应类型int, double 对应类型：double,float 对应类型：float；默认为string
  notNull: boolean; // true为不允许该字段为null,false为允许，默认允许
}

// 便捷接口向表中插入数据格式定义
export class EasyApi_insertObj {
  tableName: string;
  data: {};
}

// 便捷接口向表中修改数据格式定义
export class EasyApi_updateObj {
  tableName: string;
  id: string;
  data: {};
}

// 便捷接口向表中删除数据格式定义
export class EasyApi_delObj {
  tableName: string;
  id: string;
}

// 便捷接口向表中查询数据格式定义
export class EasyApi_queryObj {
  tableName: string;
  searchs: {
    fieldName: string; // 字段名为空表示无检索条件
    searchType: string; // "查询方式equals、like、in、between"
    value1: string; // 内容
    value2: string; // "内容"
  };
  orders: {
    fieldName: string; // 字段名为空表示无检索条件
    type: string; // 排序方式(desc/asc)
  };
  page: number;
  size: number;
}
