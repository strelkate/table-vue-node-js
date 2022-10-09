<template>
	<table class="table">
		<TableHead class="table__head"/>
		<TableRow
			v-for="(tableRow, index) in getTableRows"
			:key="index"
			:tableRow="tableRow"
		/>
	</table>
</template>

<script>

import TableHead from "./TableHead";
import TableRow from "./TableRow";
import {mapGetters} from "vuex";

export default {
	name: "Table",
	components: {TableRow, TableHead},
	computed: {
		...mapGetters(['getTableRows'])
	},
}
</script>

<style lang="scss">
.table {
	position: relative;
	width: 100%;
	border: 1px solid black;
	border-collapse: collapse;

	&__head {
		position: sticky;
		top: -1px;
	}
}
</style>
