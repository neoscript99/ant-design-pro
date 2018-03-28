import { list, create } from '../services/department';

export default {
  namespace: 'department',

  state: {
    data: {
      departmentCreate: null,
      list: []
    }
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(list, payload);
      yield put({
        type: 'listed',
        payload: response.data.departmentList
      });
    },
    *create({ payload }, { call, put }) {
      const response = yield call(create, { ...payload, seq: 1, enabled: true });
      yield put({
        type: 'created',
        payload: response.data.departmentCreate
      });
    }
  },

  reducers: {
    listed(state, action) {
      return {
        ...state,
        data: {
          departmentCreate: null,
          list: action.payload
        },
      };
    },
    created(state, action) {
      return {
        ...state,
        departmentCreate: action.payload,
        data: {
          departmentCreate: null,
          list: state.data.list.push(action.payload)
        },
      };
    },
  },
}