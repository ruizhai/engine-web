import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {
  Card,
  Input,
  Button,
  Icon,
  Pagination,
  Popconfirm,
  Divider,
} from 'antd';
import { routerRedux } from 'dva/router';

import DataTable from '../../components/BasicTable';
import styles from './SetLoad.less';

const { Search } = Input;
const ButtonGroup = Button.Group;

@connect(({ table, loading }) => ({
  table,
  loading: loading.models.table,
}))
export default class SetLoad extends PureComponent {

  componentWillMount() {
    this.props.dispatch({
      type: 'table/fetch',
      payload: {operation: this.operation, tableName: this.tableName},
    });
  }

  tableName = 'bi_map_data_collect';

  onEditChange = (editId) => {
    this.next(editId);
  };

  deleteHandler = (id) => {
    this.props.dispatch({
      type: 'table/delete',
      payload: {id, tableName: this.tableName},
    });
  };

  next = (editId) => {
    this.props.dispatch(
      routerRedux.push({
        pathname: "/data-load/set-add", 
        state: {
          id: editId
        },
      })
    );
  }

  operation = {
    title: '操作',
    key: 'operation',
    width: '74px',
    render: (text, record) => {
      const { id } = record;
      return (
        <div>
          <a onClick={() => this.onEditChange(id)}><Icon type="edit"/></a>
          <Divider type="vertical"/>
          <Popconfirm title="是否删除?" onConfirm={this.deleteHandler.bind(null, id)}>
            <a><Icon type="delete"/></a>
          </Popconfirm>
        </div>
      );
    }
  };

  render() {
    const { dispatch, table, loading } = this.props;
    const { current, pageSize, data } = table;

    const extraContent = (
      <div className={styles.extraContent}>
        <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
      </div>
    );
 
    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="数据映射配置"
            style={{ marginTop: 0 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button onClick={() => this.next('new')} type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus">
               添加
            </Button>
            {  data[this.tableName] !== undefined ?
              <DataTable
                loading={loading}
                dispatch={dispatch}
                tableName={this.tableName}
                current={current}
                pageSize={pageSize}
                total={data[this.tableName].total}
                dataSource={data[this.tableName].dataSource}
                columns={data[this.tableName].columns}
                hasPagination={true}
              >
              </DataTable> : null}
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}