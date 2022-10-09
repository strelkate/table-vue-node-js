import { createStore } from 'vuex';
import {moduleTableRows} from "@/store/tableRows";


export const store = createStore ({
	modules: {
		tableRows: moduleTableRows,
	}
})
