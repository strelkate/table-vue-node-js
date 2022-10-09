import http from "@/store/axios";

export const moduleTableRows = {
	state: () => ({
		tableRows: []
	}),
	getters: {
		getTableRows(state) {
			return state.tableRows
		}
	},
	mutations: {
		addTableRows(state, tableRows) {
			tableRows.forEach(tr => {
				state.tableRows.push(tr)
			})
		},
		setTableRows(state, tableRows) {
			state.tableRows = tableRows
		}
	},
	actions: {
		loadTableRows(context, filters) {
			const json = JSON.stringify(filters);
			return http.post("/", json).then(response => {
				if (response.status !== 200) {
					throw 'unknown server response'
				}
				context.commit('setTableRows', response.data)
				return response.data
			}, (error) => {
				if (error.response.status === 500) {
					if ('error' in error.response.data) {
						throw error.response.data.error
					}
				}
				throw 'unknown server response'
			})
		},
		nextTableRows(context, filters) {
			const json = JSON.stringify(filters);
			return http.post("/", json).then(response => {
				if (response.status !== 200) {
					throw 'unknown server response'
				}
				context.commit('addTableRows', response.data)
				return response.data
			}, (error) => {
				if (error.response.status === 500) {
					if ('error' in error.response.data) {
						throw error.response.data.error
					}
				}
				throw 'unknown server response'
			})
		},
	},
}


