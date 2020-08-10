const state = {
  fileList: [],
  keepAliveComps: ['create', 'edit']
};

const mutations = {
  setFileList(state, val) {
    state.fileList = val;
  },
  setKeepAliveComps(state, val) {
    state.keepAliveComps = val;
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
