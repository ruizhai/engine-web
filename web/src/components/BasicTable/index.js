import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { 
  Divider, 
  Icon, 
  Table, 
  Pagination, 
  Popconfirm, 
  Button,
} from 'antd';

import styles from './index.less';

const ButtonGroup = Button.Group;

class DataTable extends PureComponent {



  render() {  
    const { 
      dispatch, 
      loading, 
      tableName, 
      columns, 
      dataSource, 
      current, 
      pageSize, 
      total, 
      hasPagination,
      onShowSizeChange,
      onPageChange, 
    } = this.props;

    let pagination = null;
    if(hasPagination) {
      pagination =  <Pagination
            className="ant-table-pagination"
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            onChange={onPageChange}
            total={total}
            current={current}
            pageSize={pageSize}
          />
    }
    return (
      <div className={styles.basicTable}>
        <Table
          bordered
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          rowKey={record => record.id}
          current={current}
          // scroll={{ x:100, y: 330 }}
          pagination={false}
        />
        {pagination}         
      </div>
    );
  }
}

export default DataTable;
