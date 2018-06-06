import { routerRedux } from 'dva/router';
import { reloadAuthorized } from '../utils/Authorized';


export default {
  namespace: 'modal',
  state: {
  },
  effects: {
    *show({ payload }, { call, put }) {
      const map = {};
      map[payload] = true;
      yield put({
        type: 'save',
        payload: map,
      });
    },
    *hide({ payload }, { call, put }) {
      const map = {};
      map[payload] = false;
      yield put({
        type: 'save',
        payload: map,
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};