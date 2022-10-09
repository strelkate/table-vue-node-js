<template>
	<tr>
		<td>{{ tableRow.date }}</td>
		<td>{{ tableRow.name }}</td>
		<td>{{ tableRow.quantity }}</td>
		<td>{{ tableRow.distance }}</td>
	</tr>
</template>

<script>
export default {
	name: "TableRow",
	props: {
		tableRow: {
			type: Object,
			required: true
		},
	},

}
</script>

<style lang="scss">
td {
	border: 1px solid black;
	width: 25%;
	padding: 5px 7px;
}
</style>
