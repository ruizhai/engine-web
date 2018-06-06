import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryForm, insertForm, updateForm, getSelect } from '../services/api';

export default {
  namespace: 'form',
  state: {
    selectInfo: {

    },
    formInfo:{
      data: {},
    },
  },
  effects: {
    *save({ payload }, { call, put }) {
      const { tableName, param, url, need } = payload;
      const response = yield call(insertForm, {tableName, param});
      yield put({
        type: 'saveFormInfo', 
        payload: response,
      });
      if(response.code === '0000'){
        if(url !== undefined) {
           yield put(routerRedux.push({pathname:url, state:{id:response.data.id}}));
        } else if(need !== undefined) {
          for(let i in need) {
            yield put(need[i]);
          }
        } 
      }
    },
    *update({ payload }, { call, put }) {
      const {tableName, id, param, url, need} = payload;
      const response = yield call(updateForm, {tableName, param, id});
      if(response.code === '0000') {
        if(url !== undefined) {
          yield put(routerRedux.push({pathname:url, state:{id:id}}));
        } else if(need !== undefined) {
          for(let i in need) {
            yield put(need[i]);
          }
        } 
      }
    },
    *select({ payload }, { call, put }) {
      const { selectName, param, key, need } = payload;
      const response = yield call(getSelect, {selectName, param});
      yield put({
        type: 'saveSelectInfo',
        payload: {
          key,
          response,
        },
      });
      if(undefined !== need) {
        yield put(need);
      }

    },
    *fetch({ payload }, { call, put }) {
      const { tableName, id } = payload;
      const response = yield call(queryForm, {tableName, id});
      yield put({
        type: 'saveFormInfo', 
        payload: response,
      });
    },
  },

  reducers: {
    saveFormInfo(state, { payload }) {
      const s =  {
        ...state,
        formInfo: {
          errMsg: payload.errMsg,
          data:{
            ...state.formInfo.data,
            ...payload.data,
          },
        },
      }
      return s;
    },
    saveSelectInfo(state, { payload }) {
      const { response, key } = payload;
      state.selectInfo[key] = response;
      return state;
    },
    clean(state, { payload }) {
      if(payload === undefined) {
        state.formInfo = {};
        return state;
      } else {
        for(let i in payload) {
          state.formInfo.data[payload[i]] = null;
        }
        return state;
      }
    },
  },
};
