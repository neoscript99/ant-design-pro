import { queryDepartment } from '../services/department';

export default {
  namespace: 'department',

  state: {
    data: {
      list: []
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryDepartment, payload);
      yield put({
        type: 'queryList',
        payload: response.data.departmentList
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        data: {
          list: action.payload
        },
      };
    },
  },
}