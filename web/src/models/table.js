import { queryTable, deleteTable } from '../services/api';

export default {
  namespace: 'table',
  state: {
    current: 1,
    pageSize: 5,
    data: {

    },
  },
  effects: {
    *fetch({ payload }, { call, put, select }) {
      let {current, pageSize, tableName, filter} = payload;
      if(current == undefined) {
        current = yield select(state=>state.table.current);
      }
      if(pageSize === undefined) {
        pageSize = yield select(state=>state.table.pageSize);
      }
      const response = yield call(queryTable, {current, pageSize, tableName, filter});
      yield put({
        type: 'queryData',
        payload: {'response': response.data, 'operation': payload.operation, tableName, current, pageSize},
      });
    },
    *reflash({ payload }, { call, put, select }) {
      const { tableName, filter } = payload; 
      const current = yield select(state=>state.table.current);
      const pageSize = yield select(state=>state.table.pageSize);
      const response = yield call(queryTable, {current, pageSize, tableName, filter});
      yield put({
        type: 'rData',
        payload: { 'response': response.data, tableName },
      });
    },
    *delete({ payload }, { call, put }) {
      const { tableName, id, filter } = payload;
      yield call(deleteTable, {tableName, id});
      yield put({
        type: 'reflash',
        payload:{ tableName, filter },
      });
    },
  },
  
  reducers: {
    queryData(state, action) {
      const { response, operation, tableName, current, pageSize } = action.payload;
      response.columns.push(operation);
      state.data[tableName] = response;
      state.current = current;
      state.pageSize = pageSize;
      return state;
    },

    rData(state, action) {
      const tableName = action.payload.tableName;
      const columns = state.data[tableName].columns;
      state.data[tableName] = {   
        columns: columns,
        dataSource: action.payload.response.dataSource,
        total: action.payload.response.total,
      }
      return state;
    },
  },
};