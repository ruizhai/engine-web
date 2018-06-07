import { fakeChartData } from '../services/api';

export default {
  namespace: 'chart',

  state: {
    offlineChartData: [
      {
        x: 0,
        y: 0,
      },
    ],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: { offlineChartData: response },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        offlineChartData: [],
      };
    },
  },
};
