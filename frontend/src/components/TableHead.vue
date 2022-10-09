<template>
	<tr class="head">
		<th>Дата</th>
		<th>Название</th>
		<th>Количество</th>
		<th>Расстояние</th>
	</tr>
</template>

<script>
export default {
	name: "TableHead"
}
</script>

<style lang="scss">
.head {
	width: 100%;
	border: 1px solid black;
	border-collapse: collapse;
}

th {
	border: 1px solid black;
	width: 25%;
	padding: 5px 7px;
	background-color: $color-primary;

}
</style>
